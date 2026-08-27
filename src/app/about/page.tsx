import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "How Bitpunk approaches market research, tools and membership.",
};

const principles = [
  {
    title: "Show the work",
    body: "Explain the evidence, assumptions and limits behind an analysis.",
  },
  {
    title: "Keep the boundary clear",
    body: "Research informs a decision. It does not make the decision for you.",
  },
  {
    title: "Make it usable",
    body: "Turn ideas into frameworks and tools that hold up in day-to-day practice.",
  },
];

export default function AboutPage() {
  return (
    <section className="page-section">
      <p className="eyebrow">About Bitpunk</p>
      <h1>Built for the work between an idea and a decision.</h1>
      <p className="lead">
        Bitpunk is an independent market research and tools business. We publish
        a free Playbook and offer a paid membership for community access and
        TradingView tools.
      </p>
      <div className="detail-grid about-principles">
        {principles.map((principle) => (
          <article key={principle.title}>
            <h2>{principle.title}</h2>
            <p>{principle.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
