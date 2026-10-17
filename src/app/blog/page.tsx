import type { Metadata } from "next";
import { MarblePage, MarbleHero, MarbleContent, PageAction, Availability, RelatedRoom, marbleStyles as s } from "@/components/marble-page";
import { destinations } from "@/lib/showcase";

export const metadata: Metadata = {
  title: "Substack",
  description: "Independent market research, essays and field notes.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <MarblePage>
      <MarbleHero scene="research" section="Research" eyebrow="Essays & field notes"
        title={<>Room for<br /><em>another view.</em></>}
        copy="Research and observations on a changing market.">
        <PageAction href="#publications">Explore the writing</PageAction>
      </MarbleHero>
      <MarbleContent>
        <section className={s.chapter} id="publications" aria-labelledby="publications-title">
          <h2 id="publications-title" className={s.kicker}>Where we publish</h2>
          <div className={s.readingGrid}>
            <article className={s.channel}>
              <p className={s.kicker}>Longer reads</p>
              <h3>Substack</h3>
              <p>Essays, market context and ideas worth spending time with.</p>
              {destinations.substack
                ? <PageAction href={destinations.substack} external quiet>Read on Substack</PageAction>
                : <Availability>Publication coming soon</Availability>}
            </article>
            <article className={s.channel}>
              <p className={s.kicker}>From the notebook</p>
              <h3>X</h3>
              <p>Charts, short observations and work in progress.</p>
              <Availability>Profile coming soon</Availability>
            </article>
          </div>
        </section>
        <RelatedRoom label="Behind the writing" title={<>The methods,<br /><em>in the open.</em></>}
          href="/open-source" action="Explore open source" />
      </MarbleContent>
    </MarblePage>
  );
}
