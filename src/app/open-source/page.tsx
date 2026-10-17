import type { Metadata } from "next";
import { MarblePage, MarbleHero, MarbleContent, PageAction, CollectionLink, RelatedRoom, marbleStyles as s } from "@/components/marble-page";

export const metadata: Metadata = {
  title: "Open source",
  description: "Open TradingView scripts and research tools from Bitpunk.",
  alternates: { canonical: "/open-source" },
};

export default function OpenSourcePage() {
  return (
    <MarblePage>
      <MarbleHero scene="opensource" section="Open source" eyebrow="Read. Explore. Build."
        title={<>Ideas,<br /><em>made open.</em></>}
        copy="Scripts and research tools, with the work in view.">
        <PageAction href="#platforms">Explore the collection</PageAction>
      </MarbleHero>
      <MarbleContent>
        <section className={s.chapter} id="platforms" aria-labelledby="platforms-title">
          <h2 className={s.kicker} id="platforms-title">Two places to explore</h2>
          <div className={s.collectionGrid}>
            <CollectionLink href="/open-source/tradingview" label="Chart studies" title="TradingView"
              copy="Open scripts. A closer look at the chart." action="Explore scripts" />
            <CollectionLink href="/open-source/github" label="Tools & code" title="GitHub"
              copy="Research tools and the methods behind them." action="Explore projects" />
          </div>
        </section>
        <RelatedRoom label="The independent spirit" title={<>Rigor in the work.<br /><em>Room to question.</em></>}
          href="/about" action="About Bitpunk" />
      </MarbleContent>
    </MarblePage>
  );
}
