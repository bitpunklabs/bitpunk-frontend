# Bitpunk

A compact market research website with Indicators, Research, Open source and About pages.

This repository contains the website's frontend application code. Proprietary artwork, brand assets, design records, review exports, private configuration and paid indicator implementation are excluded. Open-source indicator projects are separate repositories with their own licences.

The frontend runs without the private artwork. Missing images show neutral placeholders and a clear notice; the game explains when its artwork is unavailable. No private art, screenshots or paid indicator logic is substituted into the public source.

## Local development

Requires Node.js 20.9+, pnpm 10 and Gitleaks for commit/push checks.

```sh
pnpm install
pnpm dev --port 3001
```

Open http://localhost:3001. Keep other local apps running on their existing ports.

To restore the original visuals, install your authorised delivery pack under `public/art/` and `public/brand/`, then run `pnpm assets:check`. `node tools/check-private-assets.mjs --required` enforces the complete pack for a branded release. Normal development and `pnpm build` allow an absent pack; present assets must still pass integrity checks. `BITPUNK_ASSET_MODE=placeholder` previews the source-build appearance without moving local originals. Restart development or rebuild production after changing the pack or this setting.

Optional public settings are listed in [.env.example](.env.example). Put local values in ignored `.env.local`. The current site has no database, account or payment runtime dependency.

## Structure

- `src/app`: public routes, metadata and shared layout.
- `src/components`: navigation, ticker, relief scenes and content components.
- `src/lib`: public copy, destinations and the private asset-pack reader.
- `src/fonts`: openly licensed fonts and their licence notices.
- `tools`: asset validation, public-site checks and repository privacy checks.

The homepage uses the approved breathing interaction. Alternative motion/copy previews and retired application source are not shipped.

## Validation and privacy

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm privacy:check
```

For a build without private assets, serve it on port 3002 and run `node tools/check-source-build.mjs http://127.0.0.1:3002` to verify the public pages, placeholder image deliveries and missing-game explanation.

Installation configures the tracked Git hooks. Commit checks inspect staged paths, secrets and the configured Git identity; push checks inspect reachable history, commit metadata and messages as well. Use a GitHub noreply email for both author and committer identities. Gitleaks must be installed for these checks to pass. Do not bypass the hooks or force-add ignored artwork/configuration.

Original image files, the root `assets/` directory and Pine source files are blocked by the repository checks. Freely shared indicator projects belong in their separate repositories; this frontend repository excludes paid indicator implementation.

See [RUNNING.md](RUNNING.md) for private assets, deployment and production checks.
