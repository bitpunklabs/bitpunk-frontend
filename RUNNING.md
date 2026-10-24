# Running Bitpunk

## Development

```sh
pnpm install
cp -R ../bitpunk-frontend-private/assets/public/. public/
pnpm assets:check
pnpm dev --port 3001
```

The sibling-directory path is an example for an authorised local asset pack; use its actual location when different. Port 3001 avoids another app on port 3000. Do not terminate unrelated servers.

Optional public URLs and the contact address are configured in `.env.local`; start from `.env.example`. No Supabase, payment or private service credential is required.

The shared market ticker starts collapsed, including its header-height allocation. It appears only after TradingView reports content readiness, local configuration finishes and the widget has rendered. Script/provider failures, partial required-data errors or a 15-second initial timeout leave it hidden without a placeholder; refresh to retry. A ready ticker also collapses if its required data subsequently fails.

### Homepage updates

The approved default is the original A0 gallery transition with dark platform windows. Development-only comparisons remain available via `?feed=light` and the existing `?transition=...` URLs.

Confirmed profiles work without environment configuration; the following public URLs are optional overrides. No local update script or API credential is required:

- `NEXT_PUBLIC_X_URL`: the public X profile URL. Defaults to `https://x.com/bitpunklabs`. Loads the official dark profile timeline near the viewport. A local profile card and profile link remain available if X is blocked, empty, or unavailable. Protected accounts are not supported by X's timeline widget. Ordering and availability are controlled by X.
- `NEXT_PUBLIC_SUBSTACK_PROFILE_URL`: the public Substack profile used by social icons and profile CTAs. Defaults to `https://substack.com/@bitpunklabs`.
- `NEXT_PUBLIC_BLOG_URL`: the separate Substack **publication homepage** used for RSS. Defaults to `https://bitpunklabs.substack.com/`; the confirmed `/feed` endpoint returns RSS. The server displays up to three recent articles on both the homepage and Research, with a title, short excerpt, image when supplied, date and original article link. Custom publication domains are supported. Set `SUBSTACK_RSS_URL` only when a different RSS URL is needed.
- TradingView stays curated: edit the TradingView entries in `src/lib/home-updates.ts`. The profile and published Alpha link are already populated. For an Idea embed, use the optional Idea URL pair below.

Substack fetch/parse results and the homepage use 30-minute stale-while-revalidate caching on Vercel. Expiration makes the next visit trigger background revalidation; this is not a fixed-interval crawler. Successful cached feed data is retained when revalidation fails. On a cold start with an unavailable feed, the column offers the publication link instead. Feed fetching has a timeout; it runs on the server, not once per visitor in the browser. No cron, persistent worker or database is needed.

X and Substack use their confirmed profiles, current brand artwork and one shared avatar from the private asset pack. As reviewed on 23 October 2026, Substack's feed contained no articles; its empty state stays compact until real articles arrive. There are no invented X/Substack posts, dates or engagement counts. RSS entries are rendered as text and links, never as feed HTML or paid-article bodies. RSS parsing stays out of the browser bundle.

Optional selected-post embeds:

- `NEXT_PUBLIC_X_POST_URL`: a public X status URL. When set, its official `widgets.js` renderer replaces the homepage timeline.
- `NEXT_PUBLIC_SUBSTACK_POST_URL`: a publication article URL (`https://publication/p/slug`, including custom domains). When RSS has no items or is unavailable, the homepage can show its official embed, including the resize-message protocol.
- `NEXT_PUBLIC_TRADINGVIEW_IDEA_URL` and `NEXT_PUBLIC_TRADINGVIEW_IDEA_EMBED_URL`: a published Idea URL and the exact iframe `src` copied from its official embed code. Do not supply an entire HTML snippet. The Alpha script page has no corresponding embed action; it keeps a linked chart card.

Restart development after changing environment values. For Vercel, set the values and redeploy once; subsequent article updates use the feed cache without redeploying. Each post has one responsive DOM instance. X supports the requested dark embed theme; other vendor iframe documents keep the styling provided by that vendor. Automatic RSS cards use the approved dark Substack window design.

### Coming soon design review

In development, open `/coming-soon?view=atrium`, `?view=study` or `?view=gallery` to compare the three launch-page layouts. A small review bar switches between them; append `&review=off` for a clean view. The standalone page omits site navigation, the market ticker and the regular footer. It reuses the authorised asset pack, local fonts and rotating logo star, with a static star for reduced motion.

The full site's `/coming-soon` preview route hides the review controls and ignores query variants in production. `COMING_SOON_VARIANT=atrium`, `study` or `gallery` selects that preview route's design; the default is `atrium`. The standalone prelaunch deployment below always uses the selected A design at `/`. Restore the private delivery pack before building, as with the full site.

The selected prelaunch design is A, with “Research, indicators and open source. Where market ideas take shape.” Run `pnpm build:coming-soon` to export it as an independent static site. The build reuses the reviewed component, typography and identity; it contains only the landing page, its ten authorised artwork/favicon files, fonts and framework delivery files. It does not include unfinished pages, the artwork registry, environment files or account services. Font licence notices are included under `/licenses/`.

The build creates an ignored, timestamped directory under `.private/coming-soon/`. `latest.json` records its deployment directory and file hashes. Deploy that directory with `vercel deploy --prebuilt --prod`; never deploy the complete workspace for the prelaunch site. The deployment uses the existing `.vercel/project.json` binding. The build alone does not publish anything or modify the full site's normal development homepage. Production domain and certificate status must be verified after deployment.

For the prelaunch domain setup, `www.bitpunk.io` redirects to the apex domain, `https://bitpunk.io`. The website records use the project's Vercel CNAME target in Cloudflare with DNS-only routing; email DNS records remain separate. For later releases, deploy with `--skip-domain`, verify the protected deployment, then run `vercel promote <deployment-url>` to switch production. Vercel CLI may return JSON when an agent is detected; use `deployment.url` rather than assuming stdout is a bare URL. Deployment receipts and verification captures stay in private storage.

### Research profiles

`/research` has X and Substack columns with locally rendered dark profile windows. Public names and bios are in `src/lib/research.ts`. The homepage uses the same `PlatformProfile` component with compact spacing, integrated content and one follow action per window. X uses its official timeline; Substack shows real RSS articles with 30-minute revalidation. Its Activity and Posts links follow the current profile layout. Titles, avatars, navigation, cover artwork and CTAs use the confirmed channel destinations. They open the platform; they do not follow or subscribe on a visitor's behalf.

The private pack's `channels.avatar` is the shared delivery image for homepage post/profile bylines, Research profiles and the GitHub card. It is a 512px WebP export of the supplied portrait; the source remains private. Platform icons and the website favicon keep their separate roles. X cover art and the Substack wordmark are locally delivered copies reviewed against the live profiles.

`/open-source` contains stacked TradingView and GitHub sections. `OpenIndicatorSection` shares the same charts, copy and controls with `/indicators`. The GitHub banner uses the approved profile's original animated SVG, with a matching single-frame SVG selected for reduced motion; it links to the profile. Development directions link to the public projects. Channel artwork is delivered locally through `site-assets.json`, alongside the existing private asset pack.

## Email contact

The footer's Contact link and About's email address use a normal `mailto:` link. There is no dialog, CAPTCHA, contact API, external script or email-sending service. The address is encoded on the server and restored locally by the browser after hydration, following the same lightweight obfuscation pattern as Cloudflare's Email Address Obfuscation. This is a local implementation, not a claim that Cloudflare's proxy feature is enabled. Initial HTML and React payloads receive only the encoded address; browser users can click or copy the restored address normally.

Set `CONTACT_EMAIL` in ignored `.env.local` or Vercel's build environment, then rebuild/redeploy. The local configuration is already populated; no Turnstile configuration is needed. The raw address stays out of Git and browser bundles. A source checkout without an address simply omits the link. This works with static prerendering; the standalone Coming Soon export currently has no contact entry. With JavaScript disabled, visitors can still use the site's social profile links. The small offline check is `node tools/check-contact.mjs`.

Obfuscation reduces straightforward HTML harvesting; it is reversible and does not identify humans or stop JavaScript-capable crawlers. Keep mailbox spam filtering enabled. Never add real mailbox passwords or service credentials to source or public environment variables.

## Private delivery assets

The pack supplies `public/art/`, `public/brand/` and `public/favicon.ico`. It includes `public/art/site-assets.json`, which holds the approved homepage crop geometry, Alpha and open-source gallery metadata, the three Alpha case studies, and the delivery-file hash inventory. The server reads this metadata from disk; it is not embedded in tracked source files. Alpha case studies keep the original chart pixels; the paper mount, perspective and shadows are rendered by the page.

`pnpm assets:check` checks delivery hashes and homepage/gallery references. The normal production build runs this check first, accepts an absent pack and rejects altered registered files. Use `node tools/check-private-assets.mjs --required` to require the complete pack for a branded release. Original artwork, prompts, design documents and review captures do not belong in the delivery pack.

`next.config.ts` includes delivery files in the Vercel function trace so cached pages can still read the pack and check image availability when they regenerate. A prebuilt release needs both the public image deliveries and these runtime files.

For a full-site prebuilt release, use `vercel build --prod --standalone` so function dependencies are contained in `.vercel/output/`. Deploy with `--prebuilt --prod --skip-domain`, verify the protected deployment, then promote it. Upload only this clean delivery output; keep environment files and review material outside it.

Chart presentation has two formats: `ImageCarousel` for switchable collections and `ImageSingle` for an independent image. Both use `ImageFrame` for thumbnail metadata and a shared click-to-enlarge `ImageViewer`. The carousel switches through full-height left/right edge controls or its selection labels; it has no swipe/drag navigation. Its progress bar still drives automatic playback. Enlarged images have no header or navigation controls: click/tap the image again, click the backdrop or press Escape to close. Mobile images fit the largest available viewport dimension without cropping; desktop images keep a bounded size. Reduced-motion preferences skip the expansion animation.

A deployment must receive these delivery files from authorised private storage before building. They must not be committed to make a Git-based deployment work. The website's displayed images are necessarily available to its visitors; keeping them out of Git protects the source repository, not against saving a displayed image.

## Checks

```sh
pnpm lint
pnpm typecheck
node tools/check-market-ticker.mjs
node tools/check-home-updates.mjs
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

The privacy policy blocks artwork/design paths, private configuration, credentials, retired source and review outputs. Commit checks read staged files and require GitHub noreply identities. Push checks also scan all reachable history, including author/committer email metadata; deleting a private file in the latest commit alone is insufficient. After a privacy-related history rewrite, use a fresh clone rather than merging an old clone back into the cleaned history.

`.vercelignore` excludes original/review/private working folders from CLI deployment uploads. Local environment files and backend archives stay outside the checkout. Reintroducing a database or membership flow requires a separate implementation scope.

### About: persona and Bitpunk Run

About opens with the runner and the large heading “A true punk never stops running.” Behind the mask follows the game, with Jake's brief personal introduction and the approved Stonks mask meme, displayed in full without cropping. The original image stays in the branding workspace; its 960px WebP delivery is registered as `about.persona.stonks`. The previous persona toggle is removed, and the Thinking export appears at the far right of the homepage's closing CTA, beside About Bitpunk. On mobile, the About meme occupies its own row, while the homepage character sits to the right of the About link.

“Hi, this is Jake.” opens the copy; the next paragraph covers spending most of his time on crypto / US equities, studying price action and testing ideas. The closing sentence is “Stay close and be patient—let’s cook something big.”, followed by X, Substack, TradingView and GitHub links with an extra 1rem of separation from the copy. These use the shared destinations, platform marks and arrow/hover treatment, and open the public profiles in a new tab. All introduction paragraphs inherit the same shared body type role, regular weight, normal font style and muted text colour. Paragraph spacing uses the shared `--paragraph-gap` token. Headings retain the site's editorial role.

About opens with the shared marble hero and the original winged sculpture, followed by the Stonks portrait and personal introduction; the game is the final section. The Stonks portrait has no caption.

Bitpunk Run is an About-only, dynamically imported Canvas controller; the rest of the site does not import its engine. It reuses the branding prototype's movement, generation, enemies and rendering helpers. Runtime images and technical persona exports live in the authorised private delivery pack under `public/art/about/`. Refresh shared rules and delivery art with `node tools/sync-about-game.mjs /path/to/bitpunk-branding`, then run the asset check. Original persona masters and game review material remain in the branding workspace.

Website-specific additions live in `encounters.mjs`, `grounded-decor.mjs` and `jump-rewards.mjs`, so refreshing the prototype helpers preserves these rules. Meme props are anchored in world coordinates to continuous ground ledges; the complete prop width plus a 12px edge margin must fit. Placement also reserves the full 84px prop height and 8px clearance around floating platforms, including their painted lips. The nearest unobstructed interval is used; narrow or fully obstructed ledges are skipped. Ground placements are cached with the four retained chunks. Props render after terrain with a small contact shadow; clipping hides their last two pixels at the exact ground surface, including raised ground.

Coins are filtered once per generated chunk to clear the full standing runner sprite. Ground-level running below optional platforms earns no coins; elevated, validated routes retain their rewards. Map geometry, enemies and jump physics stay with the shared core.

Descending onto a bear awards 10 points; a black swan awards 20. Consecutive stomps before touching terrain use 1×, 2× and a capped 3× multiplier. A stomp rebounds automatically and restores one air jump. Side/underside contacts and candle spikes remain fatal. Defeated enemies cannot collide or score again. A brief squashed sprite, bounded pixel burst and score popup use existing art. The HUD remains Score / Best with no extra buttons. Run `node tools/check-bitpunk-run.mjs` for deterministic collision and generated-ground placement checks; these do not establish browser gameplay feel or device performance.

The game is controlled directly on the canvas: clicking/tapping starts and jumps, and clicking after a game ends starts another run. There are no explicit jump, pause or new-run buttons. The visible instruction is “Click to jump, again to double jump.” Space / Up / Enter jump and P pauses while the canvas has focus. Offscreen/background/orientation changes pause; leaving About cancels animation, work queues, image-loading timers and event listeners. Rendering targets 60FPS with a fixed 120Hz physics step, sliced generation and at most four retained map sections.

The current game update received type/lint checks, deterministic encounter / ground-placement checks and Computer Use desktop/mobile layout inspection. Browser gameplay and device performance benchmarks were not run. Historical prototype results apply to their recorded source hashes.

Personal copy is editable in `src/lib/about.ts`. The public name is Jake. `aboutProfile.marketExperience`, `motivation` and `personalDetail` allow owner-supplied detail. Empty fields use compact, direct statements; they never display placeholder text. `aboutContent.signoff` provides the combined closing statement and CTA. Keep the voice personal, energetic and brief. Specific employment, years, education and trading results have not been invented.

### Shared risk notice

The global footer displays “For information only. Not financial advice. Trading involves risk.” from `src/lib/disclaimer.ts`. The same wording introduces `/disclaimer`, which retains the detailed risks and limitations. Product documentation already links to this page; the shared footer also covers Research, Indicators, Open source and About without repeating notices inside each section.

### Source-only frontend

The GitHub section links to the frontend repository. The public source excludes artwork, brand assets and paid indicator implementation. An ordinary source checkout can run `pnpm dev --port 3001` and `pnpm build` without a private asset pack. Asset readers return typed metadata with neutral placeholders; missing game art disables game loading and shows an explicit explanation. The shared footer contains the copyright, risk notice, email contact and legal links. Fallback rewrites handle absent art and brand files while leaving installed static files intact. Placeholders never invent market data or include original brand illustrations.

`pnpm assets:check` permits absent files but verifies any available registered asset's hash. `node tools/check-private-assets.mjs --required` requires every delivery file for a complete branded release. Use `BITPUNK_ASSET_MODE=placeholder` to preview the source-only view while keeping authorised local originals in place. The separate prelaunch export still requires its authorised delivery assets.
