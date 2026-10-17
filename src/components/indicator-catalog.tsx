import { alphaIndicator, openIndicatorCollection } from "@/lib/indicators";
import { PageAction, marbleStyles } from "./marble-page";
import styles from "./indicator-catalog.module.css";

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

export function IndicatorCatalog() {
  return (
    <section className={marbleStyles.chapter} aria-label="Indicators">
      <div className={styles.grid}>
        <article className={styles.product} aria-labelledby="alpha-title">
          <h2 className={styles.name} id="alpha-title">{alphaIndicator.name}</h2>
          <p className={styles.description}>{alphaIndicator.description}</p>
          <div className={styles.resources}>
            <PageAction href={alphaIndicator.overviewUrl} quiet>Explore Alpha</PageAction>
          </div>
        </article>
        <article className={styles.product} aria-labelledby="open-indicators-title">
          <h2 className={styles.name} id="open-indicators-title">{openIndicatorCollection.name}</h2>
          <p className={styles.description}>{openIndicatorCollection.description}</p>
          <div className={styles.resources}>
            <IndicatorResource href={openIndicatorCollection.tradingViewUrl} label="TradingView"
              product={openIndicatorCollection.name} />
          </div>
        </article>
      </div>
    </section>
  );
}
