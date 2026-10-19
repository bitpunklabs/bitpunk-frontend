import type { Metadata } from "next";
import Link from "next/link";
import { MarblePage, MarbleHero, MarbleContent, marbleStyles as s } from "@/components/marble-page";
import { IndicatorResource } from "@/components/indicator-catalog";
import { alphaIndicator } from "@/lib/indicators";
import styles from "./alpha.module.css";
import { AlphaShowcase } from "@/components/alpha-showcase";
import { AlphaShowcaseReview } from "@/components/alpha-showcase-review";
import { getAlphaScreenshots } from "@/lib/scene-assets";
import { alphaShowcaseVariant } from "@/lib/alpha-showcase";

export const metadata: Metadata = {
  title: "Alpha",
  description: "Trend, structure and momentum in one TradingView study. Explore Alpha from Bitpunk.",
  alternates: { canonical: "/indicators/alpha" },
};

const perspectives = [
  { title: "Read the trend.", copy: "Follow the confirmed trend track, with live bias and volatility context." },
  { title: "Locate the signal.", copy: "See momentum observations alongside nearby structure and volume context." },
  { title: "Understand momentum.", copy: "Read trend alignment, structure and divergence with each signal." },
];

export default async function AlphaPage({ searchParams }: {
  searchParams: Promise<{ showcase?: string }>;
}) {
  const preview = process.env.NODE_ENV === "development" ? (await searchParams).showcase : undefined;
  const variant = alphaShowcaseVariant(preview);
  return (
    <MarblePage>
      <MarbleHero scene="indicators" section="Alpha" parent={{ href: "/indicators", label: "Indicators" }}
        eyebrow="Alpha / TradingView indicator" title={<>Signals,{" "}<br /><em>in context.</em></>}
        copy="Trend, structure and momentum. Read together." />
      <MarbleContent>
        {preview && <AlphaShowcaseReview variant={variant} basePath="/indicators/alpha" />}
        <section id="alpha" className={`${s.chapter} ${styles.showcase}`} aria-label="Alpha chart examples">
          <AlphaShowcase key={variant} slides={getAlphaScreenshots()} variant={variant} />
        </section>
        <section className={s.chapter} aria-label="Alpha features">
          <div className={styles.perspectives}>
            {perspectives.map(item => (
              <article className={styles.perspective} key={item.title}>
                <h2>{item.title}</h2>
                <p className={styles.copy}>{item.copy}</p>
              </article>
            ))}
          </div>
          <div className={styles.alerts}>
            <h2>Alerts with context.</h2>
            <p>Bar-close alerts carry direction and context. Developing previews are marked separately.</p>
          </div>
        </section>
        <section className={`${s.chapter} ${styles.access}`} aria-labelledby="access-title">
          <div>
            <h2 id="access-title" className={styles.accessTitle}>Explore Alpha.</h2>
            <p className={styles.note}>For discretionary analysis. Live readings and previews can change before close.</p>
            <Link className={styles.disclaimer} href="/disclaimer">Trading risks & limitations</Link>
          </div>
          <div className={styles.resources}>
            <IndicatorResource href={alphaIndicator.documentationUrl} label="Documentation" product="Alpha" />
            <IndicatorResource href={alphaIndicator.tradingViewUrl} label="TradingView" product="Alpha" />
          </div>
        </section>
      </MarbleContent>
    </MarblePage>
  );
}
