import Link from "next/link";
import { Wordmark } from "@/components/wordmark";
import { navigation } from "@/lib/showcase";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <p>An independent point of view.</p>
        <nav aria-label="Footer navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link href="/open-source/github">GitHub</Link>
        </nav>
      </div>
      <Link href="/" className="footer-wordmark" aria-label="Bitpunk home">
        <Wordmark />
      </Link>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} BITPUNK LABS</span>
        <div>
          <Link href="/privacy">Privacy</Link>
          <Link href="/disclaimer">Disclaimer</Link>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
