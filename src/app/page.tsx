import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { getPublicPosts } from "@/lib/content-repository";

const stack = [
  {
    index: "01",
    name: "Playbook",
    href: "/playbook",
    line: "The operating manual for systematic traders.",
    body: "Frameworks for market state, rotation, confirmation and risk boundaries.",
    status: "Open",
    tone: "accent" as const,
  },
  {
    index: "02",
    name: "Threads",
    href: "/pricing",
    line: "Market threads for regime, rotation and risk.",
    body: "What drives the market now, where leadership sits, what invalidates the read.",
    status: "Members",
    tone: "default" as const,
  },
  {
    index: "03",
    name: "Alpha",
    href: "/pricing",
    line: "Confirmed signals for systematic traders.",
    body: "TradingView indicators, signal quality, priority setups, regime fit.",
    status: "Members",
    tone: "default" as const,
  },
  {
    index: "04",
    name: "Automata",
    href: "/about",
    line: "Autonomous agent trading.",
    body: "Perceive, decide, execute — inside explicit risk rules and human override.",
    status: "Coming later",
    tone: "muted" as const,
  },
];

const method = [
  {
    index: "01",
    title: "Learn the framework.",
    body: "Repeatable ways to read conditions, structure and risk — not opinions.",
  },
  {
    index: "02",
    title: "Read with structure.",
    body: "Separate evidence, assumptions and invalidation points before acting.",
  },
  {
    index: "03",
    title: "Act with discipline.",
    body: "Keep every decision tied to a rule you wrote down in advance.",
  },
];

export default async function HomePage() {
  const featuredPosts = (await getPublicPosts()).slice(0, 3);

  return (
    <>
      <section className="hero ruled">
        <p className="eyebrow">Market intelligence for systematic traders</p>
        <h1>
          Read the market.
          <br />
          Run the system.
        </h1>
        <p className="hero-copy">
          Bitpunk turns market complexity into structured intelligence — frameworks, market
          threads and confirmed signals for traders who work by rules.
        </p>
        <div className="actions">
          <Link className="button button-primary" href="/playbook">
            Explore Playbook
          </Link>
          <Link className="button button-secondary" href="/pricing">
            View membership
          </Link>
        </div>
      </section>

      <div className="tape" aria-hidden="true">
        <span>No hype</span>
        <span>No black box</span>
        <span>No signal worship</span>
      </div>

      <section className="block" aria-labelledby="stack-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The stack</p>
            <h2 id="stack-title">Four layers, one path.</h2>
          </div>
          <Link href="/about">How it fits together</Link>
        </div>
        <div className="cell-grid cols-4">
          {stack.map((item) => (
            <Link className="stack-cell" key={item.index} href={item.href}>
              <span className="stack-index">{item.index}</span>
              <h3>{item.name}</h3>
              <p>{item.line}</p>
              <p>{item.body}</p>
              <span className="stack-status">
                <span
                  className={
                    item.tone === "accent"
                      ? "badge badge-accent"
                      : item.tone === "muted"
                        ? "badge badge-muted"
                        : "badge"
                  }
                >
                  {item.status}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="block" aria-labelledby="method-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Method</p>
            <h2 id="method-title">Discipline over noise.</h2>
          </div>
        </div>
        <div className="cell-grid cols-3">
          {method.map((item) => (
            <article className="stack-cell" key={item.index}>
              <span className="stack-index">{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="block" aria-labelledby="featured-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Public research</p>
            <h2 id="featured-title">Start with a better operating framework.</h2>
          </div>
          <Link href="/playbook">All Playbook</Link>
        </div>
        {featuredPosts.length > 0 ? (
          <div className="content-grid">
            {featuredPosts.map((post) => (
              <ContentCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="empty-state">No public research published yet.</p>
        )}
      </section>

      <section className="block" aria-labelledby="membership-title">
        <div className="membership-panel">
          <p className="eyebrow">Membership</p>
          <h2 id="membership-title">One account for every Bitpunk layer.</h2>
          <p>
            Public research stays open. Membership connects product access, Discord and
            TradingView rights under a single account.
          </p>
          <Link className="button button-primary" href="/pricing">
            Become a member
          </Link>
        </div>
      </section>
    </>
  );
}
