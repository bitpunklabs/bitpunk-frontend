import type { Metadata } from "next";
import { PageHero, SectionLabel, ArrowLink } from "@/components/editorial";
import { destinations } from "@/lib/showcase";

export const metadata: Metadata = {
  title: "TradingView",
  description: "An introduction to Bitpunk’s open-source TradingView chart studies and their approach.",
  alternates: { canonical: "/open-source/tradingview" },
};

export default function TradingViewPage() {
  return (
    <>
      <PageHero
        eyebrow="Open source / TradingView"
        title={<>OPEN SCRIPTS.<br /><span className="serif-word">Closer reading.</span></>}
        copy="Chart studies in Pine Script. Read the logic and adapt it to your own analysis."
        art="classical-bust-candlestick-blindfold"
        alt="A classical bust with a candlestick chart across its eyes."
      >
        {destinations.tradingview ? (
          <ArrowLink href={destinations.tradingview} external solid>Visit Bitpunk on TradingView</ArrowLink>
        ) : (
          <p className="notice">TradingView profile link coming soon.</p>
        )}
      </PageHero>
      <section className="content-section">
        <SectionLabel number="01">Read, inspect, adapt</SectionLabel>
        <div className="split-note">
          <h2>THE LOGIC<br /><span className="serif-word">in plain sight.</span></h2>
          <div>
            <p>Read how each script works, then explore it on the chart.</p>
            <p className="notice">Public scripts and introductions coming soon.</p>
            <ArrowLink href="/indicators">Explore paid indicators</ArrowLink>
            <br />
            <ArrowLink href="/open-source/github">Explore GitHub projects</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
