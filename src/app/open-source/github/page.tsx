import type { Metadata } from "next";
import { MarblePage, MarbleHero, MarbleContent, PageAction, marbleStyles as s } from "@/components/marble-page";
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
        title={<>The work,{" "}<br /><em>shared openly.</em></>}
        copy="Tools and code from Bitpunk.">
        <PageAction href={destinations.github} external>Visit GitHub</PageAction>
      </MarbleHero>
      <MarbleContent>
        <section className={s.chapter} aria-label="GitHub projects">
          <div className={s.collectionGrid}>
            <article className={s.channel}>
              <h2>Ticker Universe Builder</h2>
              <p>Ticker universes with clear criteria and traceable research.</p>
              <div className={s.channelAction}><PageAction href={destinations.universe} external quiet>View repository</PageAction></div>
            </article>
            <article className={s.channel}>
              <h2>This website</h2>
              <p>The code behind Bitpunk, built with Next.js.</p>
              <div className={s.channelAction}><PageAction href={destinations.website} external quiet>View repository</PageAction></div>
            </article>
          </div>
        </section>
      </MarbleContent>
    </MarblePage>
  );
}
