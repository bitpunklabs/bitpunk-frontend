export const contactAction = "reveal-email";

export type ContactConfiguration = {
  email?: string;
  siteKey?: string;
  secretKey?: string;
  production: boolean;
};

const headers = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
};
const reply = (body: object, status = 200) => Response.json(body, { status, headers });
const unavailable = () => reply({ error: "Email is temporarily unavailable. Please try again later." }, 503);

function configured(config: ContactConfiguration) {
  if (!config.siteKey || !config.secretKey || !config.email ||
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/i.test(config.email)) return false;
  // Cloudflare's public dummy keys must never protect a real production address.
  return !config.production || ![config.siteKey, config.secretKey].some(key => /^[123]x0{10}/.test(key));
}

async function readToken(request: Request): Promise<string | null> {
  if (!request.body) return null;
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0, text = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) { await reader.cancel(); return null; }
      text += decoder.decode(value, { stream: true });
    }
    const body: unknown = JSON.parse(text + decoder.decode());
    if (!body || typeof body !== "object" || !("token" in body)) return null;
    const token = body.token;
    return typeof token === "string" && token.trim().length > 0 && token.length <= 2048 ? token : null;
  } catch { return null; }
  finally { reader.releaseLock(); }
}

/** No address in HTML/config responses. Reveal only after a fresh, server-verified token. */
export async function contactResponse(request: Request, config: ContactConfiguration, send: typeof fetch = fetch) {
  if (!configured(config)) return unavailable();
  if (request.method === "GET") return reply({ siteKey: config.siteKey });
  if (request.method !== "POST") return reply({ error: "Method not allowed." }, 405);

  const url = new URL(request.url);
  if (request.headers.get("origin") !== url.origin) return reply({ error: "Open contact from this website." }, 403);
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") {
    return reply({ error: "Invalid request." }, 415);
  }
  const token = await readToken(request);
  if (!token) return reply({ error: "Please complete the verification." }, 400);

  try {
    const response = await send("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", cache: "no-store", signal: AbortSignal.timeout(6000),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: config.secretKey!, response: token }),
    });
    if (!response.ok) return unavailable();
    const result: unknown = await response.json();
    if (!result || typeof result !== "object" || !("success" in result) || result.success !== true ||
        !("action" in result) || result.action !== contactAction ||
        !("hostname" in result) || result.hostname !== url.hostname) {
      return reply({ error: "Verification expired or failed. Please try again." }, 403);
    }
    return reply({ email: config.email });
  } catch { return unavailable(); }
}
