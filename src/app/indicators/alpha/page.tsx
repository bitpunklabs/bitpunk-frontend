import type { Metadata } from "next";
import Link from "next/link";
import { alphaIndicator } from "@/lib/indicators";
import styles from "./alpha.module.css";

export const metadata: Metadata = {
  title: "bitpunk.alpha documentation",
  description: "A guide to reading bitpunk.alpha on TradingView.",
  alternates: { canonical: "/indicators/alpha" },
};

// A concise starting structure; detailed instructions and examples will follow.
const sections = [
  {
    id: "overview", title: "Overview",
    paragraphs: ["bitpunk.alpha brings trend, momentum and market structure into one TradingView study. Read the chart as a whole, with each observation in context."],
  },
  {
    id: "reading-the-chart", title: "Reading the chart",
    paragraphs: ["Read market context alongside trend, momentum, and structures. Nearby structure and volume context help place individual signals within the chart."],
  },
  {
    id: "alerts", title: "Alerts",
    paragraphs: ["Bar-close alerts carry direction and context. Developing previews are marked separately."],
  },
  {
    id: "limitations", title: "Notes & limitations",
    paragraphs: ["For discretionary analysis. Live readings and previews can change before close. See the trading risks and limitations before using the indicator."],
  },
];
const updatedAt = "2026-10-20";
const introduction = "A guide to reading the chart. Detailed instructions and examples are being updated.";
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
            <span>Updated <time dateTime={updatedAt}>Oct 20, 2026</time></span>
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
            <a href={alphaIndicator.tradingViewUrl} target="_blank" rel="noopener noreferrer">View on TradingView</a>
            <Link href="/disclaimer">Trading risks & limitations</Link>
          </footer>
        </div>
      </div>
    </article>
  );
}
