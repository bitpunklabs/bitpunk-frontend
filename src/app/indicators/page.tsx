import type { Metadata } from "next";
import { PageHero, SectionLabel, ArrowLink } from "@/components/editorial";

export const metadata: Metadata = {
  title: "Indicator",
  description: "TradingView indicators for exploring trend context and market structure.",
  alternates: { canonical: "/indicators" },
};

const capabilities = [
  { title: "Market structure", copy: "Read trends, ranges and key levels in context." },
  { title: "Screening", copy: "Find charts that match your criteria." },
  { title: "Alerts", copy: "Follow the conditions you choose." },
  { title: "Structured output", copy: "Use chart signals in your own workflow." },
];

export default function IndicatorsPage() {
  return (
    <>
      <PageHero
        eyebrow="BP / Indicator — Paid TradingView tools"
        title={<>READ BETWEEN<br />THE CANDLES.</>}
        copy="Explore trend context and market structure. A framework for your own analysis."
        art="classical-bust-candlestick-blindfold"
        alt="A classical bust with a candlestick chart across its eyes."
      >
        <ArrowLink href="#capabilities" solid>Explore indicators</ArrowLink>
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
        <SectionLabel number="02">Your own view</SectionLabel>
        <div className="split-note">
          <h2>OBSERVATION FIRST.<br /><span className="serif-word">Judgment stays yours.</span></h2>
          <div>
            <p>Use the tools to explore the chart and form your own view.</p>
            <p className="notice">Indicator details and access coming soon.</p>
            <ArrowLink href="/open-source/tradingview">Explore open-source scripts</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
