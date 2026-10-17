import type { Metadata } from "next";
import { MarblePage, MarbleHero, MarbleContent, CollectionLink, marbleStyles as s } from "@/components/marble-page";

export const metadata: Metadata = {
  title: "Open source",
  description: "Open TradingView scripts and research tools from Bitpunk.",
  alternates: { canonical: "/open-source" },
};

export default function OpenSourcePage() {
  return (
    <MarblePage>
      <MarbleHero scene="opensource" section="Open source"
        title={<>Ideas,{" "}<br /><em>made open.</em></>}
        copy="Open scripts and research tools." />
      <MarbleContent>
        <section className={s.chapter} aria-label="Open-source collections">
          <div className={s.collectionGrid}>
            <CollectionLink href="/open-source/tradingview" title="TradingView"
              copy="Open chart studies in Pine Script." action="View scripts" />
            <CollectionLink href="/open-source/github" title="GitHub"
              copy="Research tools and reusable code." action="View projects" />
          </div>
        </section>
      </MarbleContent>
    </MarblePage>
  );
}
