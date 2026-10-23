import Link from "next/link";
import { riskNotice } from "@/lib/disclaimer";
import styles from "./site-footer.module.css";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} BITPUNK LABS</span>
          <p className={styles.notice}>{riskNotice}</p>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
