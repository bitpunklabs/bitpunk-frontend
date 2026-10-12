import type { Metadata } from "next";
import { PageHero, SectionLabel, ArrowLink } from "@/components/editorial";
import { destinations } from "@/lib/showcase";
export const metadata: Metadata = {
  title: "Blog",
  description:
    "Independent market research, essays and field notes.",
  alternates: { canonical: "/blog" },
};
const topics = [
  [
    "01",
    "Markets & methods",
    "Observations and ideas worth exploring.",
  ],
  [
    "02",
    "Evidence & context",
    "A closer look at the stories behind the market.",
  ],
  [
    "03",
    "Independent thought",
    "Ideas from beyond the chart.",
  ],
];
export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow={
          destinations.substack
            ? "The Bitpunk Blog / Published on Substack"
            : "The Bitpunk Blog"
        }
        title={
          <>
            THINKING
            <br />
            OUT <span className="serif-word">loud.</span>
          </>
        }
        copy="Research, essays and notes on a changing market."
        art="poet-jacket-portrait"
        alt="A monochrome engraved poet with a loose tie and a jacket over one shoulder."
      >
        {destinations.substack ? (
          <ArrowLink href={destinations.substack} external solid>
            Read on Substack
          </ArrowLink>
        ) : (
          <p className="notice">Essays coming soon.</p>
        )}
      </PageHero>
      <section className="content-section">
        <SectionLabel number="01">In the margins</SectionLabel>
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
              Explore the tools and methods behind the research.
            </p>
            <ArrowLink href="/open-source">Explore open source</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
