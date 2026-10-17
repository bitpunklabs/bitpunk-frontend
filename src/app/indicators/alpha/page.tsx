import type { Metadata } from "next";
import Link from "next/link";
import { MarblePage, MarbleHero, MarbleContent, PageAction, marbleStyles as s } from "@/components/marble-page";
import { IndicatorResource } from "@/components/indicator-catalog";
import { alphaIndicator } from "@/lib/indicators";
import styles from "./alpha.module.css";

export const metadata: Metadata = {
  title: "Alpha",
  description: "Trend, structure and momentum in one TradingView study. Explore Alpha from Bitpunk.",
  alternates: { canonical: "/indicators/alpha" },
};

const perspectives = [
  { label: "Trend", title: "Read the direction.", copy: "Follow the confirmed trend track, with live bias and volatility for the current chart timeframe." },
  { label: "Location", title: "Know the setting.", copy: "Nearby structure bands and volume context show where a signal appears." },
  { label: "Timing", title: "Understand the signal.", copy: "Read momentum observations with trend alignment, structure and divergence context." },
];

export default function AlphaPage() {
  return (
    <MarblePage>
      <MarbleHero scene="indicators" section="Alpha" parent={{ href: "/indicators", label: "Indicators" }}
        eyebrow="Alpha / TradingView indicator" title={<>Signals,<br /><em>in context.</em></>}
        copy="Trend, structure and momentum. Read together.">
        <PageAction href="#overview">Explore Alpha</PageAction>
      </MarbleHero>
      <MarbleContent>
        <section className={s.chapter} id="overview" aria-labelledby="overview-title">
          <p className={s.kicker}>Three connected perspectives</p>
          <h2 id="overview-title" className={styles.heading}>The whole chart, <em>in view.</em></h2>
          <div className={styles.perspectives}>
            {perspectives.map(item => (
              <article className={styles.perspective} key={item.label}>
                <p className={s.kicker}>{item.label}</p>
                <h3>{item.title}</h3>
                <p className={styles.copy}>{item.copy}</p>
              </article>
            ))}
          </div>
          <div className={styles.alerts}>
            <h3>From chart to alert.</h3>
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
