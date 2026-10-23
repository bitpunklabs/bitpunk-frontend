export function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const variant = params.get("variant"), asset = params.get("asset") || "";
  let svg: string;
  if (variant === "transparent" || /mask|glow|wall-grain|asterisk|star/i.test(asset)) {
    svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>';
  } else if (variant === "wordmark" || /favicon|apple-touch-icon/i.test(asset)) {
    svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 460 100"><text x="0" y="80" fill="#171b1c" font-family="Arial,sans-serif" font-size="84" font-weight="700">BITPUNK</text></svg>';
  } else {
    svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 540"><rect width="960" height="540" fill="#eee9df"/><rect x="1" y="1" width="958" height="538" fill="none" stroke="#cfc7b9"/><g fill="#61635e" font-family="Arial,sans-serif" text-anchor="middle"><text x="480" y="260" font-size="25">Artwork unavailable</text><text x="480" y="297" font-size="17">Private assets are not included in this source build.</text></g></svg>';
  }
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}
