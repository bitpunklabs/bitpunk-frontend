import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { navigation } from "@/lib/showcase";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
      <div className="footer-top">
        <div>
          <Link href="/" className="footer-signature" aria-label="Bitpunk home"><Wordmark /></Link>
          <p>Independent in thought.<br /><em>Open in spirit.</em></p>
        </div>
        <nav aria-label="Footer navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/open-source/github">GitHub</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} BITPUNK LABS</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/disclaimer">Disclaimer</Link>
        </div>
      </div>
      </div>
    </footer>
  );
}
