import { alphaIndicator, openIndicatorCollection } from "@/lib/indicators";
import { PageAction, marbleStyles } from "./marble-page";
import styles from "./indicator-catalog.module.css";
import { AlphaShowcase } from "./alpha-showcase";
import { AlphaStudies } from "./alpha-studies";
import { ImageCarousel } from "./image-showcase";
import { getAlphaScreenshots, getAlphaCaseStudies, getOpenSourceScreenshots } from "@/lib/scene-assets";
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

function IndicatorTopics({ label, topics }: {
  label: string;
  topics: { title: string; copy: string }[];
}) {
  return (
    <div className={styles.topics} role="group" aria-label={label}>
      {topics.map(topic => (
        <section className={styles.topic} key={topic.title}>
          <h3>{topic.title}</h3>
          <p>{topic.copy}</p>
        </section>
      ))}
    </div>
  );
}

export function IndicatorCatalog({ variant = "stack" }: { variant?: AlphaShowcaseVariant }) {
  const screenshots = getAlphaScreenshots();
  const alphaStudies = getAlphaCaseStudies();
  const openSourceScreenshots = getOpenSourceScreenshots();
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
                <PageAction href={alphaIndicator.documentationUrl} quiet>Read the Doc (Coming soon)</PageAction>
                <PageAction href={alphaIndicator.tradingViewUrl} external quiet>Explore Alpha on TradingView</PageAction>
              </div>
            </div>
            <AlphaShowcase key={variant} slides={screenshots} variant={variant} />
          </div>
          <AlphaStudies slides={alphaStudies} topics={alphaIndicator.topics} />
        </article>
        <article id="open-indicators" className={styles.product} aria-labelledby="open-indicators-title">
          <div className={`${styles.overview} ${styles.withGallery}`}>
            <div className={styles.introduction}>
              <h2 className={styles.name} id="open-indicators-title">
                {openIndicatorCollection.name.split(" ").map(word => <span key={word}>{word}{" "}</span>)}
              </h2>
              <div className={styles.description}>
                <p>{openIndicatorCollection.description}</p>
                <p>{openIndicatorCollection.researchPurpose}</p>
              </div>
              <div className={styles.resources}>
                <IndicatorResource href={openIndicatorCollection.tradingViewUrl} label="Explore Open-source on TradingView"
                  product={openIndicatorCollection.name} />
              </div>
            </div>
            <ImageCarousel key={variant} slides={openSourceScreenshots} variant={variant}
              label="Open-source script demos" selectionLabel="Choose a study" />
          </div>
          <IndicatorTopics label="Open-source research directions" topics={openIndicatorCollection.topics} />
        </article>
      </div>
    </section>
  );
}
