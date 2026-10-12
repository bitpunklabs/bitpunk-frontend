import type { Metadata } from "next";
import { PageHero, SectionLabel, ArrowLink } from "@/components/editorial";

export const metadata: Metadata = {
  title: "Open source",
  description: "Explore Bitpunk’s open-source TradingView scripts and research projects on GitHub.",
  alternates: { canonical: "/open-source" },
};

export default function OpenSourcePage() {
  return (
    <>
      <PageHero
        eyebrow="BP / Open source"
        title={<>GOOD IDEAS<br />TRAVEL <span className="serif-word">open.</span></>}
        copy="Research benefits from a closer look. Explore the chart studies, inspect the code, and follow the reasoning behind the work."
        art="sculpture-hand-safety-pin"
        alt="An engraved hand holding a safety pin."
      >
        <ArrowLink href="#platforms" solid>Explore the projects</ArrowLink>
      </PageHero>
      <section className="content-section" id="platforms">
        <SectionLabel number="01">Two places to explore</SectionLabel>
        <div className="capability-grid">
          <article className="capability">
            <span>01</span>
            <div>
              <h3>TRADINGVIEW</h3>
              <p>Open-source chart studies. A place to explore how each script reads the market and how its conditions are defined.</p>
              <ArrowLink href="/open-source/tradingview">Explore TradingView scripts</ArrowLink>
            </div>
          </article>
          <article className="capability">
            <span>02</span>
            <div>
              <h3>GITHUB</h3>
              <p>Research tools and the code behind Bitpunk. Browse the repositories, inspect the methods, and build on the work.</p>
              <ArrowLink href="/open-source/github">Explore GitHub projects</ArrowLink>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
