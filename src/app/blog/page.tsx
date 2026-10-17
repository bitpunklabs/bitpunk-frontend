import type { Metadata } from "next";
import { MarblePage, MarbleHero, MarbleContent, PageAction, Availability, marbleStyles as s } from "@/components/marble-page";
import { destinations } from "@/lib/showcase";

export const metadata: Metadata = {
  title: "Research",
  description: "Independent market research, essays and field notes.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <MarblePage>
      <MarbleHero scene="research" section="Research"
        title={<>Room for{" "}<br /><em>another view.</em></>}
        copy="Research and observations on a changing market." />
      <MarbleContent>
        <section className={s.chapter} aria-label="Research channels">
          <div className={s.readingGrid}>
            <article className={s.channel}>
              <h2>X</h2>
              <p>Charts, observations and work in progress.</p>
              <div className={s.channelAction}><Availability>Coming soon</Availability></div>
            </article>
            <article className={s.channel}>
              <h2>Substack</h2>
              <p>Longer essays and market context.</p>
              <div className={s.channelAction}>{destinations.substack
                ? <PageAction href={destinations.substack} external quiet>Read on Substack</PageAction>
                : <Availability>Coming soon</Availability>}</div>
            </article>
            <article className={s.channel}>
              <h2>GitHub</h2>
              <p>Open tools and methods behind the research.</p>
              <div className={s.channelAction}><PageAction href="/open-source/github" quiet>Explore the code</PageAction></div>
            </article>
          </div>
        </section>
      </MarbleContent>
    </MarblePage>
  );
}
