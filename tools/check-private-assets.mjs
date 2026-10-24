import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { join, resolve, sep } from 'node:path';

const publicRoot = resolve('public');
const required = process.argv.includes('--required');
let pack;
try {
  pack = JSON.parse(await readFile(join(publicRoot, 'art/site-assets.json'), 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
  if (required) {
    console.error('Private artwork is required for this build. Restore the authorised asset pack described in RUNNING.md.');
    process.exit(1);
  }
  console.log('INFO: Private artwork is not installed. The site will use source-build placeholders.');
  process.exit(0);
}
if (pack.version !== 1 || !Array.isArray(pack.files)) {
  throw new Error('Invalid private asset pack.');
}
if (required && (!pack.files.length || !pack.home?.wordmark || !pack.channels?.avatar ||
    !Array.isArray(pack.showcases?.alpha) || !Array.isArray(pack.showcases?.openSource) ||
    !Array.isArray(pack.showcases?.alphaStudies))) throw new Error('The complete private asset pack is required.');
const files = new Set();
let missing = 0;
for (const item of pack.files) {
  if (typeof item.path !== 'string' || !item.path.startsWith('/')) throw new Error('Invalid asset path.');
  const file = resolve(publicRoot, '.' + item.path);
  if (!file.startsWith(publicRoot + sep)) throw new Error('Asset path escapes public/.');
  let data;
  try { data = await readFile(file); }
  catch (error) {
    if (error.code !== 'ENOENT' || required) throw error;
    files.add(item.path); missing++; continue;
  }
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
checkReferences(pack.channels);
checkReferences(pack.about);
if (required && (!pack.about?.persona?.thinking || !pack.about?.persona?.building || !pack.about?.persona?.stonks || !pack.about?.persona?.stonksUnmasked || !pack.about?.game?.images)) {
  throw new Error('About artwork is missing from the current delivery pack.');
}
for (const path of Object.values(pack.about?.game?.images || {})) {
  if (!files.has(path)) throw new Error('A game image is missing from the delivery pack.');
}
await stat(join(publicRoot, 'art/site-assets.json'));
console.log(missing ? `INFO: ${missing} delivery assets are absent; placeholders will be shown. Available files passed hash validation.` : `PASS: ${files.size} authorised delivery assets match their hashes.`);
