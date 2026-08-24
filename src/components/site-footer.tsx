import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link className="footer-wordmark" href="/" aria-label="Bitpunk home">
        <Image src="/brand/logo-dark.png" alt="" width={100} height={30} />
      </Link>
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
