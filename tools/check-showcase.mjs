import assert from "node:assert/strict";

const origin = new URL(process.argv[2] || "http://localhost:3000");
const paths = [
  "/",
  "/indicators",
  "/open-source",
  "/open-source/tradingview",
  "/open-source/github",
  "/blog",
  "/about",
  "/privacy",
  "/terms",
  "/disclaimer",
];
const pages = new Map();
const linkedPages = new Set();
const assets = new Set();
const fragments = [];
const retired =
  /^(?:\/account|\/auth|\/login|\/register|\/pricing|\/refund-policy|\/agentics|\/docs)(?:\/|$)/;
for (const path of paths) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  assert.equal(
    response.headers.get("set-cookie"),
    null,
    `${path} sets cookies`,
  );
  const html = await response.text();
  pages.set(path, html);
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    `${path} must have one h1`,
  );
  assert.ok(!/<form(?:\s|>)/i.test(html), `${path} unexpectedly has a form`);
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const url = new URL(href.replaceAll("&amp;", "&"), new URL(path, origin));
    if (url.origin !== origin.origin) continue;
    assert.ok(
      !retired.test(url.pathname),
      `${path} links to retired ${url.pathname}`,
    );
    linkedPages.add(url.pathname);
    if (url.hash)
      fragments.push([url.pathname, decodeURIComponent(url.hash.slice(1))]);
  }
  for (const [, src] of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
    const url = new URL(src.replaceAll("&amp;", "&"), origin);
    assert.equal(url.origin, origin.origin, "Artwork must be served locally");
    assets.add(url.href);
  }
}
for (const path of linkedPages)
  assert.ok(pages.has(path), `Unreviewed internal destination: ${path}`);
for (const [path, id] of fragments)
  assert.ok(
    pages.get(path).includes(`id="${id}"`),
    `Missing anchor ${path}#${id}`,
  );
for (const url of assets) {
  const response = await fetch(url);
  assert.equal(response.status, 200, url);
  assert.match(response.headers.get("content-type"), /^image\//, url);
}
for (const path of [
  "/login",
  "/register",
  "/account",
  "/account/billing",
  "/account/settings",
  "/pricing",
  "/refund-policy",
  "/auth/callback?code=smoke-only&next=https://example.invalid",
  "/auth/retired",
  "/agentics",
  "/docs",
]) {
  const response = await fetch(new URL(path, origin), { redirect: "manual" });
  assert.equal(response.status, 307, path);
  const target = new URL(response.headers.get("location"), origin);
  assert.equal(target.pathname, "/", path);
  assert.equal(target.search, "", `Retired auth parameters leaked: ${path}`);
  assert.equal(response.headers.get("set-cookie"), null, path);
}
const missing = await fetch(new URL("/not-a-real-bitpunk-page", origin));
assert.equal(missing.status, 404);
assert.match(await missing.text(), /LOST THE SIGNAL/);
const sitemap = await (await fetch(new URL("/sitemap.xml", origin))).text();
for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))
  assert.ok(
    !retired.test(new URL(url).pathname),
    `Retired page in sitemap: ${url}`,
  );
assert.match(
  await (await fetch(new URL("/robots.txt", origin))).text(),
  /Sitemap:/,
);
console.log(
  `PASS: ${pages.size} public pages; ${assets.size} image deliveries; internal links and anchors; 11 retired redirects; 404; sitemap; no account forms or session cookies.`,
);
