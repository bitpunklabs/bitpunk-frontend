import type { Metadata } from "next";
import { PageHero, SectionLabel, ArrowLink } from "@/components/editorial";
import { destinations } from "@/lib/showcase";
export const metadata: Metadata = {
  title: "Blog",
  description:
    "Independent market research and field notes. Observations, working hypotheses and the reasoning behind a point of view.",
  alternates: { canonical: "/blog" },
};
const topics = [
  [
    "01",
    "Markets & methods",
    "Observations, working hypotheses and the process of changing your mind.",
  ],
  [
    "02",
    "Evidence & context",
    "The sources, structural shifts and competing explanations behind a market narrative.",
  ],
  [
    "03",
    "Independent thought",
    "Reading, creative detours and ideas from beyond the chart.",
  ],
];
export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow={
          destinations.substack
            ? "The Bitpunk Blog / Published on Substack"
            : "The Bitpunk Blog / Coming to this space"
        }
        title={
          <>
            THINKING
            <br />
            OUT <span className="serif-word">loud.</span>
          </>
        }
        copy="A place for the longer thought. Field notes on markets, evidence and finding a point of view that’s your own."
        art="poet-jacket-portrait"
        alt="A monochrome engraved poet with a loose tie and a jacket over one shoulder."
      >
        {destinations.substack ? (
          <ArrowLink href={destinations.substack} external solid>
            Read on Substack
          </ArrowLink>
        ) : (
          <div className="notice">
            <strong>The blog is coming to this space.</strong>
            <br />
            The Substack publication link will appear here when it’s ready.
          </div>
        )}
      </PageHero>
      <section className="content-section">
        <SectionLabel number="01">What you’ll find in the margins</SectionLabel>
        <div className="topic-list">
          {topics.map(([number, title, text]) => (
            <article key={number}>
              <span className="eyebrow">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="content-section">
        <div className="split-note">
          <h2>
            FOLLOW THE WORK.
            <br />
            <span className="serif-word">Form your own view.</span>
          </h2>
          <div>
            <p>
              The open-source work is another way into the research: inspect a
              repository, examine an approach, and trace the reasoning back to
              its evidence.
            </p>
            <ArrowLink href="/open-source">Explore the research code</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
