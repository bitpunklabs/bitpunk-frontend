import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>bitpunk</span>
      <p>For research and education only. Not investment advice.</p>
      <div>
        <Link href="/refund-policy">Refunds</Link>
        <Link href="/disclaimer">Disclaimer</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
