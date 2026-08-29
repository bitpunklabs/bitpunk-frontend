import Image from "next/image";
import Link from "next/link";
import { PLAYBOOK_URL } from "@/lib/links";
import { membershipPlans, stablecoinLaunch } from "@/lib/membership-plans";

const researchLoop = [
  {
    index: "01",
    title: "Observe",
    body: "Start with price, participation and context. Keep the raw evidence separate from the story built around it.",
  },
  {
    index: "02",
    title: "Frame",
    body: "Turn the evidence into a testable view with explicit conditions, time horizon and invalidation.",
  },
  {
    index: "03",
    title: "Act",
    body: "Use tools to make the current state visible. The decision and its risk still belong to you.",
  },
  {
    index: "04",
    title: "Review",
    body: "Compare what happened with what was expected, then update the process without rewriting the past.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero hero-system ruled">
        <div className="hero-content">
          <p className="eyebrow">Independent market research and tools</p>
          <h1>See the market. Keep your process.</h1>
          <p className="hero-copy">
            Bitpunk publishes a free market Playbook and builds a focused
            workspace for traders who want clearer evidence, explicit risk and
            decisions they can review.
          </p>
          <div className="actions">
            {PLAYBOOK_URL ? (
              <a
                className="button button-primary"
                href={PLAYBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the Playbook <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span
                className="button button-primary is-disabled"
                aria-disabled="true"
              >
                Playbook — opening soon
              </span>
            )}
            <Link className="button button-secondary" href="/pricing">
              Compare membership
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <Image
            src="/brand/hero-system-v1.png"
            alt=""
            fill
            priority
            sizes="(max-width: 900px) 100vw, 58vw"
          />
          <div className="hero-art-index">
            <span>System / 01</span>
            <span>Evidence → decision</span>
          </div>
        </div>
      </section>

      <section className="fact-rail" aria-label="Bitpunk facts">
        <div>
          <span>Playbook</span>
          <strong>Free</strong>
        </div>
        <div>
          <span>Membership</span>
          <strong>Plus / Pro</strong>
        </div>
        <div>
          <span>First payment rail</span>
          <strong>USDC / USDT</strong>
        </div>
        <div>
          <span>Access period</span>
          <strong>{stablecoinLaunch.billing}</strong>
        </div>
      </section>

      <section className="block process-section" aria-labelledby="process-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A repeatable loop</p>
            <h2 id="process-title">From evidence to review.</h2>
          </div>
          <p className="section-intro">
            Markets change. A useful process keeps the assumptions, limits and
            next action visible while they do.
          </p>
        </div>
        <div className="process-grid">
          {researchLoop.map((step) => (
            <article key={step.index}>
              <span className="process-index">{step.index}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="block playbook-section" aria-labelledby="playbook-title">
        <div className="playbook-art" aria-hidden="true">
          <Image
            src="/brand/playbook-cover-v1.png"
            alt=""
            fill
            loading="eager"
            sizes="(max-width: 700px) 100vw, 42vw"
          />
        </div>
        <div className="playbook-copy">
          <p className="eyebrow">The Playbook / Free</p>
          <h2 id="playbook-title">Read the work before buying anything.</h2>
          <p>
            Technical and fundamental analysis, published with the evidence,
            working thesis and limits of the conclusion. The Playbook lives on
            Substack and remains free for everyone.
          </p>
          <ul className="plain-list">
            <li>Market structure and technical context</li>
            <li>Fundamental developments that change the thesis</li>
            <li>Process notes you can adapt to your own decisions</li>
          </ul>
          {PLAYBOOK_URL ? (
            <a href={PLAYBOOK_URL} target="_blank" rel="noopener noreferrer">
              Open the Playbook ↗
            </a>
          ) : (
            <span className="text-link-muted">Publication opening soon</span>
          )}
        </div>
      </section>

      <section className="block" aria-labelledby="membership-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Bitpunk Membership</p>
            <h2 id="membership-title">Choose how close you want to work.</h2>
          </div>
          <Link href="/pricing">Full comparison</Link>
        </div>
        <div className="plan-grid plan-grid-home">
          {membershipPlans.map((plan) => (
            <article className={`plan-card plan-${plan.key}`} key={plan.key}>
              <div className="plan-card-head">
                <div>
                  <p className="eyebrow">Bitpunk {plan.name}</p>
                  <h3>{plan.summary}</h3>
                </div>
                <div className="plan-price">
                  <strong>{plan.price}</strong>
                  <span>/ {plan.accessPeriod}</span>
                </div>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <p className="plan-note">{plan.note}</p>
            </article>
          ))}
        </div>
        <p className="commerce-note">
          Stablecoin checkout will open first with USDC and USDT. Access is
          prepaid for 30 days and does not renew automatically.
        </p>
      </section>

      <section className="block account-callout" aria-labelledby="account-title">
        <div>
          <p className="eyebrow">One account, visible state</p>
          <h2 id="account-title">Know what is active and what needs attention.</h2>
        </div>
        <div>
          <p>
            Sign in with an account you already use. Then manage your profile,
            verified email, membership period, Discord access, TradingView
            status and billing history in one place.
          </p>
          <Link className="button button-primary" href="/login">
            Sign in
          </Link>
        </div>
      </section>
    </>
  );
}
