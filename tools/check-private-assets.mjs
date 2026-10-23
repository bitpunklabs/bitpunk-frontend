import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';

const publicRoot = resolve('public');
let pack;
try {
  pack = JSON.parse(await readFile(join(publicRoot, 'art/site-assets.json'), 'utf8'));
} catch {
  console.error('Private artwork is missing. Restore the authorised asset pack described in RUNNING.md.');
  process.exit(1);
}
if (pack.version !== 1 || !Array.isArray(pack.files) || !pack.files.length || !pack.home?.wordmark ||
    !Array.isArray(pack.showcases?.alpha) || !Array.isArray(pack.showcases?.openSource) ||
    !Array.isArray(pack.showcases?.alphaStudies)) {
  throw new Error('Invalid private asset pack.');
}
const files = new Set();
for (const item of pack.files) {
  if (typeof item.path !== 'string' || !item.path.startsWith('/')) throw new Error('Invalid asset path.');
  const file = resolve(publicRoot, '.' + item.path);
  if (!file.startsWith(publicRoot + sep)) throw new Error('Asset path escapes public/.');
  const data = await readFile(file);
  const hash = createHash('sha256').update(data).digest('hex');
  if (hash !== item.sha256 || data.length !== item.bytes) throw new Error(`Asset changed: ${item.path}`);
  files.add(item.path);
}
function checkReferences(value) {
  if (!value || typeof value !== 'object') return;
  for (const key of ['src', 'staticSrc', 'logoSrc', 'iconSrc']) {
    if (key in value && !files.has(value[key])) throw new Error('Artwork reference is missing from the asset pack.');
  }
  for (const child of Object.values(value)) checkReferences(child);
}
checkReferences(pack.home);
checkReferences(pack.showcases);
checkReferences(pack.about);
if (!pack.about?.persona?.thinking || !pack.about?.persona?.building || !pack.about?.persona?.stonks || !pack.about?.game?.images) {
  throw new Error('About artwork is missing from the current delivery pack.');
}
for (const path of Object.values(pack.about.game.images)) {
  if (!files.has(path)) throw new Error('A game image is missing from the delivery pack.');
}
await stat(join(publicRoot, 'art/site-assets.json'));
console.log(`PASS: ${files.size} authorised delivery assets match their hashes.`);
