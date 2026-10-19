# Bitpunk

A compact market research website with Indicators, Research, Open source and About pages.

This repository contains application code. Proprietary artwork, logos, design records, review exports and private configuration are kept outside Git. A local asset pack is required to render the complete site.

## Local development

Requires Node.js 20.9+, pnpm 10 and Gitleaks for commit/push checks.

```sh
pnpm install
# Restore your authorised private delivery pack:
cp -R ../bitpunk-frontend-private/assets/public/. public/
pnpm assets:check
pnpm dev --port 3001
```

Open http://localhost:3001. Keep other local apps running on their existing ports.

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

Installation configures the tracked Git hooks. Commit checks inspect staged paths and secrets; push checks inspect reachable history as well. Gitleaks must be installed for these checks to pass. Do not bypass the hooks or force-add ignored artwork/configuration.

See [RUNNING.md](RUNNING.md) for private assets, deployment and production checks.
