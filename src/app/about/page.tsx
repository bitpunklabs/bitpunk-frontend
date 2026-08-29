import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "How Bitpunk approaches market research, decision tools and membership.",
};

const principles = [
  {
    index: "01",
    title: "Keep evidence and interpretation separate",
    body: "A chart, filing or market event is an input. The thesis built from it should remain open to challenge.",
  },
  {
    index: "02",
    title: "Define what would change the view",
    body: "A useful market idea includes its horizon, assumptions and invalidation before the outcome is known.",
  },
  {
    index: "03",
    title: "Design for the next decision",
    body: "Research earns its place when it helps someone notice a change, size uncertainty or review an action.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="page-section about-hero ruled">
        <p className="eyebrow">About Bitpunk</p>
        <h1>Independent by design. Practical by default.</h1>
        <p className="lead">
          Bitpunk is a market research and tools business. The free Playbook
          makes the thinking public; membership provides a place to discuss the
          work and use the tools built around it.
        </p>
      </section>

      <section className="block about-statement">
        <p className="eyebrow">The premise</p>
        <p className="statement-copy">
          Better decisions rarely come from one more prediction. They come from
          seeing the evidence, knowing what the current view depends on and
          recognizing when the facts have changed.
        </p>
      </section>

      <section className="block" aria-labelledby="principles-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Working principles</p>
            <h2 id="principles-title">How the work is built.</h2>
          </div>
        </div>
        <div className="principle-list">
          {principles.map((principle) => (
            <article key={principle.index}>
              <span>{principle.index}</span>
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="block about-products" aria-labelledby="products-title">
        <div>
          <p className="eyebrow">Public work</p>
          <h2 id="products-title">The Playbook</h2>
          <p>
            Free technical and fundamental analysis on Substack. It is the best
            place to understand the quality, language and limits of Bitpunk
            research before creating an account.
          </p>
        </div>
        <div>
          <p className="eyebrow">Member workspace</p>
          <h2>Community and tools</h2>
          <p>
            Plus provides Discord access. Pro adds TradingView tools. Account,
            access and payment state remain visible and separate so one badge
            never hides an unfinished setup step.
          </p>
        </div>
      </section>

      <section className="block boundary-section">
        <div>
          <p className="eyebrow">The boundary</p>
          <h2>You keep the decision.</h2>
        </div>
        <p>
          Bitpunk provides research, education and analytical tools. It does not
          know your objectives or risk tolerance, does not manage money and does
          not provide personal investment advice. Every market decision remains
          yours.
        </p>
      </section>
    </>
  );
}
