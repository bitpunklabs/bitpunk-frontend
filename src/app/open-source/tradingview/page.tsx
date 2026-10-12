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
        copy="Chart studies written in Pine Script. Explore the logic behind an observation, read the conditions, and adapt the code to your own research."
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
            <p>Open-source scripts make their calculations available to read. Start with the study’s description, compare its observations with the chart, and inspect how the conditions are expressed in code.</p>
            <p>This page will collect Bitpunk’s public scripts and their introductions as they are published.</p>
            <ArrowLink href="/indicators">Explore paid indicators</ArrowLink>
            <br />
            <ArrowLink href="/open-source/github">Explore the GitHub projects</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
