import type { Metadata } from "next";
import Link from "next/link";
import { DISCORD_INVITE_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "About",
  description:
    "Bitpunk builds indicators and agent-native market tools for systematic traders.",
};

const principles = [
  {
    index: "01",
    title: "Keep evidence and interpretation separate",
    body: "A chart, filing or market event is an input. The thesis built from it should stay open to challenge.",
  },
  {
    index: "02",
    title: "Define what would change the view",
    body: "A useful market idea includes its horizon, assumptions and invalidation before the outcome is known.",
  },
  {
    index: "03",
    title: "Design for the next decision",
    body: "A tool earns its place when it helps someone notice a change, size uncertainty or review an action.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">About</p>
        <h1>Market systems for systematic traders.</h1>
        <p className="hero-copy">
          Bitpunk builds indicators and agent-native market tools for
          systematic traders.
        </p>
      </section>

      <section className="block">
        <p className="eyebrow">The premise</p>
        <p className="statement-copy" style={{ marginTop: 20 }}>
          Better decisions rarely come from one more prediction.
        </p>
        <p className="lead">
          They come from seeing the evidence, knowing what the current view
          depends on, and recognising when the facts have changed. The work is
          not to produce more signals — it is to produce better structure.
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

      <section className="block" aria-labelledby="what-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">What Bitpunk makes</p>
            <h2 id="what-title">Two products, and an open half.</h2>
          </div>
        </div>
        <div className="cell-grid cols-2">
          <article>
            <p className="eyebrow">Product 01</p>
            <h3>Indicators</h3>
            <p>
              Trading indicators and screening tools built around market
              structure, delivered on TradingView.
            </p>
            <Link className="text-link" href="/indicators">Explore Indicators</Link>
          </article>
          <article>
            <p className="eyebrow">Product 02</p>
            <h3>Agentics</h3>
            <p>
              Market context, tools and workflows for trading agents. Includes
              everything in Indicators.
            </p>
            <Link className="text-link" href="/agentics">View Agentics</Link>
          </article>
          <article>
            <p className="eyebrow">Open</p>
            <h3>Blog, Open Source and Docs</h3>
            <p>
              Free and public. The best way to judge the quality and the limits
              of the work before paying for anything.
            </p>
            <Link className="text-link" href="/blog">Read the Blog</Link>
          </article>
          <article>
            <p className="eyebrow">Community</p>
            <h3>Discord</h3>
            <p>
              Free for everyone. No account and no purchase required. It is
              also where support tickets go.
            </p>
            {DISCORD_INVITE_URL ? (
              <a
                className="text-link"
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Discord <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span className="is-muted">Opening soon</span>
            )}
          </article>
        </div>
      </section>

      <section className="block" aria-labelledby="boundary-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The boundary</p>
            <h2 id="boundary-title">You keep the decision.</h2>
          </div>
        </div>
        <p className="lead">
          Bitpunk provides tools, education and market context. It does not
          know your objectives or risk tolerance, does not manage money and
          does not provide personal investment advice. Every market decision
          remains yours.
        </p>
      </section>
    </>
  );
}
