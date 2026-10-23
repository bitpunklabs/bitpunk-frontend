import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next*/**", "node_modules/**", ".private/**", ".vercel/**", ".codex/**", ".pnpm-store/**", ".playwright-mcp/**",
    "temp/**", "tmp/**", "output/**", "branding/**", "design/**", "docs/**",
    "public/art/**", "public/brand/**", "src/legacy/**", "src/app/review/**", "tools/art/**", "tools/build-brand-assets.mjs",
  ]),
]);
