import type { Metadata } from "next";
import { MarblePage, MarbleHero, MarbleContent, PageAction, Availability, RelatedRoom, marbleStyles as s } from "@/components/marble-page";
import { destinations } from "@/lib/showcase";

export const metadata: Metadata = {
  title: "TradingView",
  description: "Open-source chart studies from Bitpunk.",
  alternates: { canonical: "/open-source/tradingview" },
};

export default function TradingViewPage() {
  return (
    <MarblePage>
      <MarbleHero scene="indicators" section="TradingView" parent={{href:"/open-source", label:"Open source"}}
        eyebrow="Open-source chart studies" title={<>Studies to<br /><em>build on.</em></>}
        copy="Pine Script studies. Read the logic and explore it on the chart.">
        {destinations.tradingview
          ? <PageAction href={destinations.tradingview} external>Visit TradingView</PageAction>
          : <Availability>TradingView profile coming soon</Availability>}
      </MarbleHero>
      <MarbleContent>
        <section className={s.chapter} aria-labelledby="scripts-title">
          <p className={s.kicker}>The scripts</p>
          <div className={s.featureGrid}>
            <div className={s.featureIntro}><h2 id="scripts-title">The logic,<br /><em>in plain sight.</em></h2><p>Open methods for a closer reading of price.</p><Availability>Script collection coming soon</Availability></div>
            <div className={s.detailList}>
              <article><h3>Read the source</h3><p>Explore the idea behind each study.</p></article>
              <article><h3>Follow your curiosity</h3><p>Use the work as a starting point for your own analysis.</p></article>
            </div>
          </div>
        </section>
        <RelatedRoom label="More from the collection" title={<>The tools behind<br /><em>the research.</em></>}
          href="/open-source/github" action="Explore GitHub projects" />
      </MarbleContent>
    </MarblePage>
  );
}
