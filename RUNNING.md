# Running Bitpunk

## Development

```sh
pnpm install
cp -R ../bitpunk-frontend-private/assets/public/. public/
pnpm assets:check
pnpm dev --port 3001
```

The sibling-directory path is an example for an authorised local asset pack; use its actual location when different. Port 3001 avoids another app on port 3000. Do not terminate unrelated servers.

Only optional public URLs are configured in `.env.local`; start from `.env.example`. No Supabase, payment or private service credential is required.

## Private delivery assets

The pack supplies `public/art/`, `public/brand/` and `public/favicon.ico`. It includes `public/art/site-assets.json`, which holds the approved homepage crop geometry and the delivery-file hash inventory. The server reads this metadata from disk; it is not embedded in tracked source files.

`pnpm assets:check` checks delivery hashes and homepage references. The production build runs this check first and fails clearly if the pack is absent or altered. Original artwork, prompts, design documents and review captures do not belong in the delivery pack.

A deployment must receive these delivery files from authorised private storage before building. They must not be committed to make a Git-based deployment work. The website's displayed images are necessarily available to its visitors; keeping them out of Git protects the source repository, not against saving a displayed image.

## Checks

```sh
pnpm lint
pnpm typecheck
pnpm build
pnpm start --port 3002
```

In another terminal:

```sh
node tools/check-showcase.mjs http://localhost:3002
pnpm privacy:check
```

The site check covers public pages, local images, links, retired redirects, 404, sitemap, and removal of review routes. It does not benchmark rendering performance or validate TradingView chart behavior.

## Repository checks

Install Gitleaks from its official release or a trusted package manager, for example `brew install gitleaks` on macOS. `pnpm install` registers `.githooks`. An existing custom hook directory requires manual integration rather than silent replacement.

The privacy policy blocks artwork/design paths, private configuration, credentials, retired source and review outputs. Commit checks read staged files. Push checks also scan all reachable history; deleting a private file in the latest commit alone is insufficient.

`.vercelignore` excludes original/review/private working folders from CLI deployment uploads. Local environment files and backend archives stay outside the checkout. Reintroducing a database or membership flow requires a separate implementation scope.
