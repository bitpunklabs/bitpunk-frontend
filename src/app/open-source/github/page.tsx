import type { Metadata } from "next";
import { MarblePage, MarbleHero, MarbleContent, PageAction, RelatedRoom, marbleStyles as s } from "@/components/marble-page";
import { destinations } from "@/lib/showcase";

export const metadata: Metadata = {
  title: "GitHub",
  description: "Research tools and open-source projects from Bitpunk Labs.",
  alternates: { canonical: "/open-source/github" },
};

export default function GitHubPage() {
  return (
    <MarblePage>
      <MarbleHero scene="opensource" section="GitHub" parent={{href:"/open-source",label:"Open source"}}
        eyebrow="Tools & code" title={<>The work,<br /><em>shared openly.</em></>}
        copy="Explore the tools and code behind Bitpunk.">
        <PageAction href={destinations.github} external>Visit GitHub</PageAction>
      </MarbleHero>
      <MarbleContent>
        <section className={s.chapter} aria-labelledby="repository-title">
          <p className={s.kicker}>Selected project</p>
          <div className={s.featureGrid}>
            <div>
              <div className={s.repoHeader}><h2 id="repository-title">Ticker Universe<br /><em>Builder</em></h2></div>
              <p className={s.repoSummary}>Ticker universes, with clear criteria and traceable research.</p>
              <div className={s.repoMeta}><span>Python</span><span>Watchlists & research</span></div>
              <PageAction href={destinations.universe} external>View repository</PageAction>
            </div>
            <div className={s.detailList}>
              <article><h3>Methods in view</h3><p>Explore how the universe is assembled.</p></article>
              <article><h3>This website</h3><p>The code behind this space.</p><PageAction href={destinations.website} external quiet>View website source</PageAction></article>
            </div>
          </div>
        </section>
        <RelatedRoom label="On the chart" title={<>Open studies.<br /><em>Closer reading.</em></>}
          href="/open-source/tradingview" action="Explore TradingView scripts" />
      </MarbleContent>
    </MarblePage>
  );
}
