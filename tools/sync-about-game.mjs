/** Refresh authorised delivery art and shared game rules from the branding workspace. */
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir, copyFile, realpath } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const branding = process.argv[2];
if (!branding) throw new Error('Usage: node tools/sync-about-game.mjs /path/to/bitpunk-branding');
const root = resolve(branding), publicRoot = resolve('public');
const sharp = createRequire(await realpath('node_modules/next/package.json'))('sharp');
const assetRoot = join(root, 'assets/games/speedrun/2026-10-23-v2');
const manifest = JSON.parse(await readFile(join(assetRoot, 'manifest.json'), 'utf8'));
const packPath = join(publicRoot, 'art/site-assets.json');
const pack = JSON.parse(await readFile(packPath, 'utf8'));
const target = '/art/about/bitpunk-run';
await mkdir(join(publicRoot, target), { recursive: true });
await mkdir('src/lib/bitpunk-run', { recursive: true });
const sourceHashes = {};
for (const name of ['core.mjs', 'visual-world.mjs', 'wick-art.mjs', 'work-queue.mjs']) {
  const data = await readFile(join(root, 'tools/speedrun-review', name));
  await writeFile(join('src/lib/bitpunk-run', name), data);
  sourceHashes[name] = createHash('sha256').update(data).digest('hex');
}
const files = [];
async function register(path) {
  const data = await readFile(join(publicRoot, path));
  files.push({ path, bytes: data.length, sha256: createHash('sha256').update(data).digest('hex') });
}
const images = {};
for (const file of Object.keys(manifest.runtime)) {
  const path = `${target}/${file}`;
  await copyFile(join(assetRoot, 'runtime', file), join(publicRoot, path));
  await register(path); images[file.replace('.png', '')] = path;
}
// Technical crops/exports of existing approved art; original pixels/masters stay archived.
const personaRoot = join(root, 'assets/persona/2026-10-22');
const thinking = '/art/about/persona-thinking.webp', building = '/art/about/persona-building.webp';
await sharp(join(personaRoot, '09-action-studies-v2.png'))
  .extract({ left: 0, top: 0, width: 512, height: 512 }).webp({ quality: 85 }).toFile(join(publicRoot, thinking));
await sharp(join(personaRoot, '11-coding-v2.png')).resize(512, 512, { fit: 'inside' })
  .webp({ quality: 85 }).toFile(join(publicRoot, building));
for (const path of [thinking, building]) await register(path);
const rect = ({ x, y, w, h }) => ({ x, y, w, h });
pack.about = {
  persona: { thinking: { src: thinking, width: 512, height: 512 }, building: { src: building, width: 512, height: 512 } },
  game: {
    images,
    sprites: Object.fromEntries(Object.entries(manifest.sprites).map(([id, value]) => [id, rect(value)])),
    decor: Object.fromEntries(Object.entries(manifest.decor).map(([id, value]) => [id, { ...rect(value), sheet: value.sheet }]))
  }
};
const replaced = new Set(files.map(file => file.path));
pack.files = pack.files.filter(file => !replaced.has(file.path));
pack.files.push(...files);
await writeFile(packPath, JSON.stringify(pack, null, 2) + '\n');
await mkdir('.private', { recursive: true });
await writeFile('.private/about-game-delivery.json', JSON.stringify({ sourceHashes, files, originalMastersPreserved: true }, null, 2));
console.log(`Synced ${Object.keys(images).length} runtime images, ${Object.keys(pack.about.game.decor).length} props and two persona exports.`);
