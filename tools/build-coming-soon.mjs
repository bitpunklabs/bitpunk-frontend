// Build the approved launch page alone; never upload the working tree or .env.
import { cp, mkdir, readFile, readdir, rm, stat, symlink, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const stamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
const run = join(root, ".private", "coming-soon", stamp);
const build = join(run, "build");
const deployment = join(run, "deploy");
const metadata = JSON.parse(await readFile(join(root, "public/art/site-assets.json"), "utf8"));
const { plates, wordmark } = metadata.home;
const delivery = [...new Set([
  plates.desktop.src, plates.mobile.src, wordmark.lettering.src, wordmark.star.src, wordmark.star.staticSrc,
  "/brand/favicon-light-16.png", "/brand/favicon-light-32.png", "/brand/favicon-light.svg",
  "/brand/apple-touch-icon-light.png", "/favicon.ico",
])];
const copy = async (source, target) => {
  await mkdir(dirname(target), { recursive: true });
  await cp(source, target, { recursive: true });
};
await mkdir(build, { recursive: true });
for (const folder of ["components", "lib", "fonts"]) await copy(join(root, "src", folder), join(build, "src", folder));
for (const file of ["page.tsx", "layout.tsx", "globals.css"]) await copy(join(root, "tools/launch", file), join(build, "src/app", file));
await copy(join(root, "src/app/typography.css"), join(build, "src/app/typography.css"));
await copy(join(root, "tsconfig.json"), join(build, "tsconfig.json"));
await copy(join(root, "public/art/site-assets.json"), join(build, "public/art/site-assets.json"));
for (const src of delivery) {
  if (!src.startsWith("/") || src.includes("..")) throw new Error("Invalid delivery path.");
  await copy(join(root, "public", src), join(build, "public", src));
}
const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
await writeFile(join(build, "package.json"), JSON.stringify({ name: "bitpunk-launch", private: true, dependencies: pkg.dependencies, devDependencies: pkg.devDependencies }, null, 2));
await writeFile(join(build, "next.config.mjs"), 'export default { output: "export", images: { unoptimized: true } };\n');
await symlink(join(root, "node_modules"), join(build, "node_modules"), "dir");
const result = spawnSync(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"], {
  cwd: build, stdio: "inherit", env: { ...process.env, NODE_ENV: "production", NEXT_TELEMETRY_DISABLED: "1", NEXT_PUBLIC_TRADINGVIEW_URL: "https://tradingview.com/u/bitpunk_labs/" },
});
if (result.status !== 0) throw new Error("Launch build failed.");
// The build-time artwork registry is private, and is not needed by visitors.
await rm(join(build, "out/art/site-assets.json"));
const staticRoot = join(deployment, ".vercel/output/static");
await copy(join(build, "out"), staticRoot);
for (const file of ["OFL-InstrumentSans.txt", "cormorant-garamond-OFL.txt"]) {
  await copy(join(root, "src/fonts", file), join(staticRoot, "licenses", file));
}
await copy(join(root, ".vercel/project.json"), join(deployment, ".vercel/project.json"));
await writeFile(join(deployment, ".vercel/output/config.json"), JSON.stringify({
  version: 3,
  routes: [
    { src: "/(.*)", has: [{ type: "host", value: "www.bitpunk.io" }], status: 308, headers: { Location: "https://bitpunk.io/$1" } },
    { src: "/coming-soon/?", status: 307, headers: { Location: "/" } },
    { src: "/(.*)", headers: { "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin" }, continue: true },
    { src: "/_next/static/(.*)", headers: { "Cache-Control": "public, max-age=31536000, immutable" }, continue: true },
    { src: "/", dest: "/index.html" },
    { handle: "filesystem" },
    { src: "/.*", dest: "/404.html", status: 404 },
  ],
}, null, 2));
await writeFile(join(staticRoot, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: https://bitpunk.io/sitemap.xml\n");
await writeFile(join(staticRoot, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://bitpunk.io/</loc></url></urlset>');
const files = [];
async function inventory(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await inventory(path);
    else {
      const name = relative(staticRoot, path);
      if (entry.isSymbolicLink() || /(?:^|\/)(?:\.env|src|tools|site-assets\.json)(?:\/|$)/.test(name)) throw new Error("Private file in launch output.");
      if (/^(?:art|brand)\//.test(name) && !delivery.includes(`/${name}`)) throw new Error("Unexpected artwork in launch output.");
      files.push({ path: name, bytes: (await stat(path)).size, sha256: createHash("sha256").update(await readFile(path)).digest("hex") });
    }
  }
}
await inventory(staticRoot);
const html = await readFile(join(staticRoot, "index.html"), "utf8");
if (!html.includes("Where market ideas take shape.") || !html.includes("Coming ") || html.includes("方案预览") || html.includes("data-site-chrome")) throw new Error("Launch page contract failed.");
const receipt = { created: new Date().toISOString(), design: "A / atrium", deployment, files, bytes: files.reduce((sum, file) => sum + file.bytes, 0) };
await writeFile(join(run, "receipt.json"), JSON.stringify(receipt, null, 2));
await writeFile(join(root, ".private/coming-soon/latest.json"), JSON.stringify(receipt, null, 2));
console.log(`PASS: launch-only static build; ${files.length} files, ${(receipt.bytes / 1024 / 1024).toFixed(2)} MB, ${delivery.length} approved artwork/icon files.`);
console.log(`Deployment directory: ${deployment}`);
