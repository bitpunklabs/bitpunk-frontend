import assert from "node:assert/strict";
import { contactAction, contactResponse } from "../src/lib/contact.ts";

// Offline security boundary check. These are fictitious settings, not live credentials.
const config = { email: "reader@example.test", siteKey: "configured-site", secretKey: "configured-secret", production: true };
const request = (body = { token: "fresh-token" }, options = {}) => new Request("https://site.example/api/contact", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: "https://site.example", ...options.headers },
  body: JSON.stringify(body),
});
let calls = 0;
const verified = async (_url, options) => {
  calls++;
  assert.equal(options.method, "POST");
  assert.equal(options.cache, "no-store");
  assert.equal(options.body.get("secret"), config.secretKey);
  return Response.json({ success: true, action: contactAction, hostname: "site.example" });
};
async function denied(req, expected, settings = config, send = verified) {
  const response = await contactResponse(req, settings, send);
  assert.equal(response.status, expected);
  assert.match(response.headers.get("cache-control"), /no-store/);
  const body = await response.text();
  assert.ok(!body.includes(config.email));
  assert.ok(!body.includes(config.secretKey));
}

const publicConfig = await contactResponse(new Request("https://site.example/api/contact"), config, verified);
assert.deepEqual(await publicConfig.json(), { siteKey: config.siteKey });
assert.equal(calls, 0);
await denied(request({}, { headers: { Origin: "https://elsewhere.example" } }), 403);
await denied(request({}, { headers: { Origin: "" } }), 403);
await denied(request({}, { headers: { "Content-Type": "text/plain" } }), 415);
for (const body of [{}, { token: "" }, { token: [] }, { token: "x".repeat(2049) }, { token: "x".repeat(5000) }]) {
  await denied(request(body), 400);
}
assert.equal(calls, 0);
await denied(request(), 503, { ...config, secretKey: undefined });
await denied(request(), 503, { ...config, siteKey: "1x00000000000000000000AA" });
await denied(request(), 503, { ...config, email: "reader@example.test?bcc=other@example.test" });
for (const result of [
  { success: false, "error-codes": ["timeout-or-duplicate"] },
  { success: true, action: "different-action", hostname: "site.example" },
  { success: true, action: contactAction, hostname: "elsewhere.example" },
  { success: true },
]) await denied(request(), 403, config, async () => Response.json(result));
await denied(request(), 503, config, async () => { throw new Error("Upstream unavailable"); });

const success = await contactResponse(request(), config, verified);
assert.equal(success.status, 200);
assert.deepEqual(await success.json(), { email: config.email });
assert.match(success.headers.get("cache-control"), /no-store/);
assert.equal(calls, 1);
await denied(request(), 403, config, async () => Response.json({ success: false, "error-codes": ["timeout-or-duplicate"] }));
console.log("PASS: contact config does not disclose email; origins, payload limits, production test keys, hostname/action, replay rejection, failure handling and verified-only reveal.");
