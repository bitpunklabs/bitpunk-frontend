import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { BLOG_URL, DISCORD_INVITE_URL } from "@/lib/links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Link className="wordmark" href="/" aria-label="Bitpunk home">
          <Wordmark />
        </Link>
        <p>Market tools for systematic traders. Not investment advice.</p>
      </div>

      <div className="footer-columns">
        <div>
          <p className="label">Products</p>
          <Link href="/indicators">Indicators</Link>
          <Link href="/agentics">Agentics</Link>
          <Link href="/pricing">Pricing</Link>
        </div>
        <div>
          <p className="label">Open</p>
          {BLOG_URL ? (
            <a href={BLOG_URL} target="_blank" rel="noopener noreferrer">
              Blog on Substack <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <Link href="/blog">Blog</Link>
          )}
          <Link href="/open-source">Open Source</Link>
          <Link href="/docs">Docs</Link>
        </div>
        <div>
          <p className="label">Community</p>
          {DISCORD_INVITE_URL ? (
            <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
              Discord — free <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className="is-muted">Discord — free, opening soon</span>
          )}
          <Link href="/about">About</Link>
        </div>
        <div>
          <p className="label">Legal</p>
          <Link href="/refund-policy">Refunds</Link>
          <Link href="/disclaimer">Disclaimer</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
