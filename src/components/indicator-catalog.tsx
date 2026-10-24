import { alphaIndicator } from "@/lib/indicators";
import { PageAction, marbleStyles } from "./marble-page";
import styles from "./indicator-catalog.module.css";
import { AlphaShowcase } from "./alpha-showcase";
import { AlphaStudies } from "./alpha-studies";
import { OpenIndicatorSection } from "./open-indicator-section";
import { getAlphaScreenshots, getAlphaCaseStudies } from "@/lib/scene-assets";
import type { AlphaShowcaseVariant } from "@/lib/alpha-showcase";

export function IndicatorResource({ href, label, product }: {
  href: string | null;
  label: string;
  product: string;
}) {
  return href ? (
    <PageAction href={href} external={!href.startsWith("/")} quiet>{label}</PageAction>
  ) : (
    <button type="button" className={styles.pendingResource} disabled
      aria-label={`${product} ${label} — coming soon`}>
      <span className={styles.resourceLabel}>{label} (Coming soon)</span>
    </button>
  );
}

export function IndicatorCatalog({ variant = "stack" }: { variant?: AlphaShowcaseVariant }) {
  const screenshots = getAlphaScreenshots();
  const alphaStudies = getAlphaCaseStudies();
  return (
    <section className={marbleStyles.chapter} aria-label="Indicators">
      <div className={styles.grid}>
        <article id="alpha" className={styles.product} aria-labelledby="alpha-title">
          <div className={`${styles.overview} ${styles.withGallery}`}>
            <div className={styles.introduction}>
              <h2 className={styles.name} id="alpha-title">
                <span>The{" "}</span>
                <span>&quot;<em>bitpunk.alpha</em>&quot;{" "}</span>
                <span>indicator</span>
              </h2>
              <div className={styles.description}>
                <p>
                  bitpunk.alpha brings <em>Momentum</em>, <em>Trend</em> and <em>Market Structure</em> into one clear view.
                </p>
                <p>
                  Read the strength of a move, follow the trend and see nearby support and resistance.
                </p>
              </div>
              <div className={styles.resources}>
                <IndicatorResource href={alphaIndicator.documentationUrl} label="Read the Doc" product="bitpunk.alpha" />
                <PageAction href={alphaIndicator.tradingViewUrl} external quiet>Explore the &quot;<em>bitpunk.alpha</em>&quot; on TradingView</PageAction>
              </div>
            </div>
            <AlphaShowcase key={variant} slides={screenshots} variant={variant} />
          </div>
          <AlphaStudies slides={alphaStudies} topics={alphaIndicator.topics} />
        </article>
        <OpenIndicatorSection key={variant} variant={variant} />
      </div>
    </section>
  );
}
