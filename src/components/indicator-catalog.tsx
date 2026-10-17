import { indicators } from "@/lib/indicators";
import { PageAction, marbleStyles } from "./marble-page";
import styles from "./indicator-catalog.module.css";

function ProductResource({ href, label, product }: {
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
    <section className={marbleStyles.chapter} id="toolkit" aria-labelledby="toolkit-title">
      <h2 id="toolkit-title" className={marbleStyles.kicker}>The toolkit</h2>
      <div className={styles.grid}>
        {indicators.map(product => (
          <article className={styles.product} key={product.id} aria-labelledby={`${product.id}-title`}>
            <p className={marbleStyles.kicker}>{product.role}</p>
            <h3 className={styles.name} id={`${product.id}-title`}>{product.name}</h3>
            <p className={styles.description}>{product.description}</p>
            <div className={styles.resources}>
              <ProductResource href={product.documentationUrl} label="Documentation" product={product.name} />
              <ProductResource href={product.tradingViewUrl} label="TradingView" product={product.name} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
