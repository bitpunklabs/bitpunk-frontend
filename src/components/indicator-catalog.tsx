import { alphaIndicator, openIndicatorCollection } from "@/lib/indicators";
import { PageAction, marbleStyles } from "./marble-page";
import styles from "./indicator-catalog.module.css";
import { AlphaShowcase } from "./alpha-showcase";
import { getAlphaScreenshots } from "@/lib/scene-assets";
import type { AlphaShowcaseVariant } from "@/lib/alpha-showcase";

export function IndicatorResource({ href, label, product }: {
  href: string | null;
  label: string;
  product: string;
}) {
  return href ? (
    <PageAction href={href} external={!href.startsWith("/")} quiet>{label}</PageAction>
  ) : (
    <button type="button" className={styles.pendingResource} aria-disabled="true"
      aria-label={`${product} ${label} — coming soon`}>
      <span className={styles.resourceLabel}>{label}</span>
      <span className={styles.resourceStatus}>Coming soon</span>
    </button>
  );
}

export function IndicatorCatalog({ variant = "stack" }: { variant?: AlphaShowcaseVariant }) {
  const screenshots = getAlphaScreenshots();
  return (
    <section className={marbleStyles.chapter} aria-label="Indicators">
      <div className={styles.grid}>
        <article id="alpha" className={`${styles.product} ${styles.alpha}`} aria-labelledby="alpha-title">
          <div className={styles.introduction}>
            <h2 className={styles.name} id="alpha-title">The &quot;<em>bitpunk.alpha</em>&quot; indicator</h2>
            <p className={styles.description}>{alphaIndicator.description}</p>
            <div className={styles.resources}>
              <PageAction href={alphaIndicator.overviewUrl} quiet>Explore Alpha</PageAction>
            </div>
          </div>
          <AlphaShowcase key={variant} slides={screenshots} variant={variant} />
        </article>
        <article className={styles.product} aria-labelledby="open-indicators-title">
          <div className={styles.introduction}>
            <h2 className={styles.name} id="open-indicators-title">{openIndicatorCollection.name}</h2>
            <p className={styles.description}>{openIndicatorCollection.description}</p>
          </div>
          <div className={styles.resources}>
            <IndicatorResource href={openIndicatorCollection.tradingViewUrl} label="TradingView"
              product={openIndicatorCollection.name} />
          </div>
        </article>
      </div>
    </section>
  );
}
