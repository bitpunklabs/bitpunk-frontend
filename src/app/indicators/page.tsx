import type { Metadata } from "next";
import { PageHero, SectionLabel, ArrowLink } from "@/components/editorial";

export const metadata: Metadata = {
  title: "Indicator",
  description: "Bitpunk’s paid TradingView indicators: market structure, screening, alerts and structured signals.",
  alternates: { canonical: "/indicators" },
};

const capabilities = [
  { title: "Market structure", copy: "Read trends, ranges and the levels that frame a chart. Bring each observation back to its market context." },
  { title: "Screening", copy: "Narrow a broad watchlist to the instruments that deserve a closer look, using a consistent set of conditions." },
  { title: "Alerts", copy: "Follow defined conditions as they appear on the chart. Keep the signal connected to the reason it matters." },
  { title: "Structured output", copy: "Carry chart observations into your own workflow with structured signals and webhook output." },
];

export default function IndicatorsPage() {
  return (
    <>
      <PageHero
        eyebrow="BP / Indicator — Paid TradingView tools"
        title={<>READ BETWEEN<br />THE CANDLES.</>}
        copy="Bitpunk’s paid TradingView indicators bring market structure, screening and alerts into a consistent chart-reading process. Built for a considered view of the market."
        art="classical-bust-candlestick-blindfold"
        alt="A classical bust with a candlestick chart across its eyes."
      >
        <ArrowLink href="#capabilities" solid>Explore the indicators</ArrowLink>
      </PageHero>
      <section className="content-section" id="capabilities">
        <SectionLabel number="01">Inside the toolkit</SectionLabel>
        <div className="capability-grid">
          {capabilities.map((item, index) => (
            <article className="capability" key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{item.title}</h3><p>{item.copy}</p></div>
            </article>
          ))}
        </div>
      </section>
      <section className="content-section">
        <SectionLabel number="02">A repeatable reading process</SectionLabel>
        <div className="split-note">
          <h2>OBSERVATION FIRST.<br /><span className="serif-word">Judgment stays yours.</span></h2>
          <div>
            <p>Structure, context and defined conditions give you something to investigate, compare and revisit as the market changes.</p>
            <p className="notice">Individual indicator introductions and access details are coming soon.</p>
            <ArrowLink href="/open-source/tradingview">Explore open-source scripts</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
