/** Export an approved X cover without committing its master or delivery art. */
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = process.argv[2];
if (!source) throw new Error('Usage: node tools/sync-x-header.mjs /path/to/header.svg');
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const sharp = createRequire(await realpath(join(root, 'node_modules/next/package.json')))('sharp');
const original = await readFile(source);
const { data, info } = await sharp(original).resize({ width: 1500, withoutEnlargement: true })
  .webp({ quality: 88 }).toBuffer({ resolveWithObject: true });
const sha256 = createHash('sha256').update(data).digest('hex');
const path = `/art/channels/x-header-${sha256.slice(0, 12)}.webp`;
const packPath = join(root, 'public/art/site-assets.json');
const pack = JSON.parse(await readFile(packPath, 'utf8'));
const previous = pack.channels.x.header.src;
const file = { path, bytes: data.length, sha256 };
await mkdir(join(root, 'public/art/channels'), { recursive: true });
await writeFile(join(root, 'public', path), data);
pack.channels.x.header = { src: path, width: info.width, height: info.height };
pack.files = pack.files.filter(item => item.path !== previous && item.path !== path);
pack.files.push(file);
await writeFile(packPath, JSON.stringify(pack, null, 2) + '\n');
await mkdir(join(root, '.private'), { recursive: true });
await writeFile(join(root, '.private/x-header-delivery.json'), JSON.stringify({
  original: basename(source), sourceSha256: createHash('sha256').update(original).digest('hex'),
  originalBytes: original.length, file, width: info.width, height: info.height, originalPreserved: true,
}, null, 2) + '\n');
console.log(`Delivered X cover at ${info.width}x${info.height}: ${data.length} bytes.`);
