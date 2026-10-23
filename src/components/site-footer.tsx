import Link from "next/link";
import { riskNotice } from "@/lib/disclaimer";
import { getArtworkStatus } from "@/lib/scene-assets";
import styles from "./site-footer.module.css";
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {getArtworkStatus().missing && <p className={styles.assetNotice} role="status">Some artwork is not included in this open-source build. Add an authorised asset pack to restore the original visuals.</p>}
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
