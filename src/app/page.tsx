import Image from "next/image";
import Link from "next/link";
import { PLAYBOOK_URL } from "@/lib/links";
import { membershipPlans } from "@/lib/membership-plans";

const researchLoop = [
  {
    index: "01",
    title: "Observe",
    status: "Evidence first",
    body: "Start with price, participation and context. Keep the raw evidence separate from the story built around it.",
  },
  {
    index: "02",
    title: "Frame",
    status: "State the limits",
    body: "Turn the evidence into a testable view with explicit conditions, time horizon and invalidation.",
  },
  {
    index: "03",
    title: "Act",
    status: "Keep risk visible",
    body: "Use tools to make the current state visible. The decision and its risk still belong to you.",
  },
  {
    index: "04",
    title: "Review",
    status: "Update the process",
    body: "Compare what happened with what was expected, then update the process without rewriting the past.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero hero-system ruled">
        <div className="hero-content">
          <p className="eyebrow hero-path">
            Independent market research
          </p>
          <h1>See the market. Keep your process.</h1>
          <p className="hero-copy hero-quote">
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
                className="button button-secondary is-disabled"
                aria-disabled="true"
              >
                Playbook opening soon
              </span>
            )}
            <Link
              className={`button ${PLAYBOOK_URL ? "button-secondary" : "button-primary"}`}
              href="/pricing"
            >
              Explore membership
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <Image
            src="/brand/hero-editorial-v3.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 900px) 100vw, 58vw"
          />
          <div className="hero-editor hero-lens">
            <div className="hero-editor-bar">
              <span>Research lens</span>
              <span>
                <i aria-hidden="true" /> A repeatable framework
              </span>
            </div>
            <ol>
              {researchLoop.map((step) => (
                <li key={step.index}>
                  <span>{step.index}</span>
                  <strong>{step.title}</strong>
                  <small>{step.status}</small>
                </li>
              ))}
            </ol>
          </div>
          <div className="hero-art-index">
            <span>Research method</span>
            <span>Evidence → judgment → review</span>
          </div>
        </div>
      </section>

      <section className="fact-rail" aria-label="Bitpunk facts">
        <div>
          <span>Open research</span>
          <strong>Free Playbook</strong>
        </div>
        <div>
          <span>Community</span>
          <strong>Plus · lifetime</strong>
        </div>
        <div>
          <span>Tools</span>
          <strong>Pro · 30 days</strong>
        </div>
        <div>
          <span>Payments</span>
          <strong>USDC · USDT</strong>
        </div>
      </section>

      <section className="block process-section" aria-labelledby="process-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Our method</p>
            <h2 id="process-title">One loop. Four deliberate steps.</h2>
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
                <small>{step.status}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="block playbook-section" aria-labelledby="playbook-title">
        <div className="playbook-art" aria-hidden="true">
          <Image
            src="/brand/playbook-cover-v2.webp"
            alt=""
            fill
            loading="eager"
            sizes="(max-width: 700px) 100vw, 42vw"
          />
        </div>
        <div className="playbook-copy">
          <p className="eyebrow">Free research</p>
          <h2 id="playbook-title">Read the work. Then decide.</h2>
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
              Read on Substack <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <span className="text-link-muted">Publication opening soon</span>
          )}
        </div>
      </section>

      <section className="block" aria-labelledby="membership-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Membership</p>
            <h2 id="membership-title">Choose the layer you need.</h2>
          </div>
          <Link href="/pricing">Compare plans</Link>
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
                  <span>{plan.priceCaption}</span>
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
          Plus is a one-time USD 4.90 payment for lifetime community access.
          Pro is USD 29.90 for 30 prepaid days and never renews automatically.
          Stablecoin checkout will open first with USDC and USDT.
        </p>
      </section>

      <section className="block account-callout" aria-labelledby="account-title">
        <div>
          <p className="eyebrow">Your workspace</p>
          <h2 id="account-title">One account. No hidden state.</h2>
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
