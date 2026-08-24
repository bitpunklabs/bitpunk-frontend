import Link from "next/link";
import { PLAYBOOK_URL } from "@/lib/links";

const included = [
  {
    index: "01",
    name: "Playbook",
    line: "Free, and staying free.",
    body: "Technical and fundamental analysis, published on a regular cadence. Open to everyone, members or not.",
    status: "Open",
    tone: "accent" as const,
  },
  {
    index: "02",
    name: "Discord",
    line: "The room where the work happens.",
    body: "Community access, discussion, and teaching material that only exists inside the server.",
    status: "Members",
    tone: "default" as const,
  },
  {
    index: "03",
    name: "TradingView",
    line: "The indicators, on your charts.",
    body: "Access to the Bitpunk invite-only scripts, tied to your TradingView username.",
    status: "Members",
    tone: "default" as const,
  },
];

const steps = [
  { index: "01", title: "Subscribe.", body: "One plan, one account. Cancel any time from your account page." },
  { index: "02", title: "Connect your accounts.", body: "Bind Discord and submit your TradingView username." },
  { index: "03", title: "Get access.", body: "Discord roles are automatic. TradingView access is granted by hand, and the status you see is the real one." },
];

export default function HomePage() {
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
          Bitpunk turns market complexity into structured intelligence — frameworks, analysis
          and confirmed signals for traders who work by rules.
        </p>
        <div className="actions">
          {PLAYBOOK_URL ? (
            <a className="button button-primary" href={PLAYBOOK_URL} target="_blank" rel="noopener noreferrer">
              Read the Playbook <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className="button button-primary is-disabled" aria-disabled="true">
              Playbook — coming soon
            </span>
          )}
          <Link href="/pricing">Become a member →</Link>
        </div>
      </section>

      <div className="tape" aria-hidden="true">
        <span>No hype</span>
        <span>No black box</span>
        <span>No signal worship</span>
      </div>

      <section className="block" aria-labelledby="included-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">What you get</p>
            <h2 id="included-title">One membership, two doors.</h2>
          </div>
          <Link href="/pricing">See what it costs</Link>
        </div>
        <div className="cell-grid cols-3">
          {included.map((item) => (
            <article className="stack-cell" key={item.index}>
              <span className="stack-index">{item.index}</span>
              <h3>{item.name}</h3>
              <p>{item.line}</p>
              <p>{item.body}</p>
              <span className="stack-status">
                <span className={item.tone === "accent" ? "badge badge-accent" : "badge"}>{item.status}</span>
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="block" aria-labelledby="steps-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">How it works</p>
            <h2 id="steps-title">Three steps, no surprises.</h2>
          </div>
        </div>
        <div className="cell-grid cols-3">
          {steps.map((item) => (
            <article className="stack-cell" key={item.index}>
              <span className="stack-index">{item.index}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="block" aria-labelledby="membership-title">
        <div className="membership-panel">
          <p className="eyebrow">Membership</p>
          <h2 id="membership-title">One account for Discord and TradingView.</h2>
          <p>
            The Playbook stays open to everyone. Membership is what connects your Discord
            account and your TradingView username to the product access behind them.
          </p>
          <p>
            Full refund within 30 days, no reason needed, once per member.{" "}
            <Link href="/refund-policy">Read the refund policy</Link>.
          </p>
          <Link className="button button-primary" href="/pricing">
            Become a member
          </Link>
        </div>
      </section>
    </>
  );
}
