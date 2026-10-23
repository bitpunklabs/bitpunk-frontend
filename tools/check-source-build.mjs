import assert from 'node:assert/strict';

const origin = new URL(process.argv[2] || 'http://127.0.0.1:3002');
const paths = ['/', '/about', '/indicators', '/indicators/alpha', '/research', '/open-source', '/open-source/github', '/open-source/tradingview', '/privacy', '/disclaimer'];
const images = new Set();
for (const path of paths) {
  const response = await fetch(new URL(path, origin));
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path}: heading`);
  assert.ok(html.includes('Some artwork is not included in this open-source build.'), `${path}: missing-art notice`);
  assert.ok(html.includes('Not financial advice.'), `${path}: risk notice`);
  if (path === '/about') {
    assert.ok(html.includes('Game artwork is not included in this source build.'));
    assert.ok(!html.includes('<canvas'), 'Missing game art must not start the engine');
  }
  if (path === '/open-source') {
    assert.ok(html.includes('paid indicator logic stay private.'));
    assert.ok(html.includes('https://github.com/bitpunklabs/bitpunk-frontend'));
  }
  for (const [, src] of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
    const url = new URL(src.replaceAll('&amp;', '&'), origin);
    if (url.origin === origin.origin) images.add(url.href);
  }
}
for (const path of ['/art/missing-chart.webp', '/brand/favicon-light.png', '/brand/asterisk-solid-static-v1.svg']) images.add(new URL(path, origin).href);
for (const url of images) {
  const response = await fetch(url);
  assert.equal(response.status, 200, url);
  assert.match(response.headers.get('content-type'), /^image\/svg\+xml/);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.ok((await response.text()).includes('<svg'));
}
console.log(`PASS: ${paths.length} source-only pages; ${images.size} image deliveries; game fallback; repository link; risk and missing-art notices.`);
