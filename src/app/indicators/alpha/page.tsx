import type { Metadata } from "next";
import Link from "next/link";
import { PageAction } from "@/components/marble-page";
import { alphaIndicator } from "@/lib/indicators";
import styles from "./alpha.module.css";

export const metadata: Metadata = {
  title: "bitpunk.alpha documentation",
  description: "Read momentum, follow the trend and understand key price areas with bitpunk.alpha.",
  alternates: { canonical: "/indicators/alpha" },
};

// Reader-facing concepts and visible behaviour; implementation details stay private.
const sections = [
  {
    id: "overview", title: "Overview",
    paragraphs: [
      "bitpunk.alpha brings momentum, trend and key price areas into one view. Use it to understand a move and decide what deserves a closer look.",
    ],
  },
  {
    id: "composite-momentum", title: "Momentum",
    paragraphs: [
      "Momentum is the strength behind a price move. Use Alpha's visual cues to see whether a move is gaining strength or losing steam.",
    ],
  },
  {
    id: "trend", title: "Trend",
    paragraphs: [
      "Trend keeps the broader direction in view. Use it to judge whether a move is going with the trend or against it. A pullback is a temporary move in the opposite direction; it can happen within an ongoing trend.",
    ],
  },
  {
    id: "market-structure", title: "Market Structure",
    paragraphs: [
      "Market Structure highlights areas of potential support and resistance: places where price may find buyers or encounter selling pressure. Read them as areas to watch when considering a signal.",
    ],
  },
  {
    id: "reading-the-chart", title: "Reading the chart",
    paragraphs: [
      "Begin with the trend. Note nearby support and resistance, then use Momentum to explore the strength of the current move. Consider each signal alongside the whole chart and your own trading plan.",
    ],
  },
  {
    id: "alerts", title: "Alerts",
    paragraphs: [
      "Set TradingView alerts to follow signals. Hollow markers show developing previews and may change before a candle closes. Recreate alerts after changing the indicator's settings.",
    ],
  },
  {
    id: "limitations", title: "Notes & limitations",
    paragraphs: [
      "Alpha is a tool for reading the market. Signals can be wrong and live readings can change. Make trading decisions with your own judgement and risk plan.",
    ],
  },
];
const updatedAt = "2026-10-21";
const introduction = "Understand the move, follow the trend and see the bigger picture.";
const wordCount = [introduction, ...sections.flatMap(section => [section.title, ...section.paragraphs])]
  .join(" ").match(/\S+/g)?.length ?? 0;
const readingMinutes = Math.max(1, Math.ceil(wordCount / 220));

export default function AlphaDocumentationPage() {
  return (
    <article className={styles.page} aria-labelledby="doc-title">
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link><span aria-hidden="true">/</span>
        <Link href="/indicators">Indicators</Link><span aria-hidden="true">/</span>
        <span aria-current="page">bitpunk.alpha</span>
      </nav>
      <div className={styles.layout}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Documentation</p>
          <h1 id="doc-title"><em>bitpunk.alpha</em></h1>
          <div className={styles.meta}>
            <span>Updated <time dateTime={updatedAt}>Oct 21, 2026</time></span>
            <span aria-hidden="true">·</span><span>{readingMinutes} min read</span>
          </div>
          <p className={styles.introduction}>{introduction}</p>
        </header>
        <aside className={styles.sidebar}>
          <p className={styles.contentsLabel}>On this page</p>
          <nav aria-label="Table of contents">
            <ol className={styles.contents}>
              {sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}
            </ol>
          </nav>
        </aside>
        <div className={styles.body}>
          {sections.map(section => (
            <section className={styles.section} id={section.id} key={section.id} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <footer className={styles.resources}>
            <PageAction href={alphaIndicator.tradingViewUrl} external quiet>View on TradingView</PageAction>
            <PageAction href="/disclaimer" quiet>Trading risks & limitations</PageAction>
          </footer>
        </div>
      </div>
    </article>
  );
}
