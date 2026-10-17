import type { Metadata } from "next";
import { MarblePage, MarbleHero, MarbleContent, PageAction, Availability, RelatedRoom, marbleStyles as s } from "@/components/marble-page";

export const metadata: Metadata = {
  title: "About",
  description: "Bitpunk. Independent market research, indicators and open-source tools.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <MarblePage>
      <MarbleHero scene="about" section="About" eyebrow="Bitpunk / The independent spirit"
        title={<>A mind<br /><em>of our own.</em></>}
        copy="Independent research. Curious minds. A different perspective.">
        <PageAction href="#project">Meet Bitpunk</PageAction>
      </MarbleHero>
      <MarbleContent>
        <section className={s.chapter} id="project" aria-labelledby="project-title">
          <div className={s.statement}>
            <h2 id="project-title">Rigor in the work.<br /><em>Rebellion in the spirit.</em></h2>
            <p>Research, indicators and open-source tools for those who read the market.</p>
          </div>
          <div className={s.aboutColumns}>
            <article><h3>The project</h3><p>Look closely. Question the obvious. Share the reasoning.</p></article>
            <article><h3>The people</h3><p>Independent perspectives, shared curiosity.</p><Availability>More about the team, soon</Availability></article>
          </div>
        </section>
        <RelatedRoom label="Follow the thinking" title={<>Notes from<br /><em>a changing market.</em></>}
          href="/blog" action="Explore research" />
      </MarbleContent>
    </MarblePage>
  );
}
