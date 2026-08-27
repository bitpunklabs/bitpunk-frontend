import Link from "next/link";
import { PLAYBOOK_URL } from "@/lib/links";

const memberAccess = [
  {
    name: "Discord",
    body: "Member discussion, product updates and practical teaching inside the Bitpunk server.",
  },
  {
    name: "TradingView",
    body: "Invite-only Bitpunk indicators, granted to the TradingView username in your account.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero ruled">
        <p className="eyebrow">Independent market research and tools</p>
        <h1>A better market process.</h1>
        <p className="hero-copy">
          Bitpunk publishes a free market Playbook and builds member tools for
          traders who want clearer analysis, repeatable rules and defined risk.
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
              Playbook — coming soon
            </span>
          )}
          <Link className="button button-secondary" href="/pricing">
            Explore membership
          </Link>
        </div>
      </section>

      <section className="block" aria-labelledby="playbook-title">
        <div className="product-feature">
          <div>
            <p className="eyebrow">The Playbook</p>
            <h2 id="playbook-title">Research you can read for free.</h2>
          </div>
          <div>
            <p>
              Technical and fundamental analysis, written to explain the
              evidence, the framework and the limits of the conclusion. No
              membership is required.
            </p>
            {PLAYBOOK_URL ? (
              <a href={PLAYBOOK_URL} target="_blank" rel="noopener noreferrer">
                Open the Playbook ↗
              </a>
            ) : (
              <span>Publishing soon</span>
            )}
          </div>
        </div>
      </section>

      <section className="block" aria-labelledby="membership-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Bitpunk Membership</p>
            <h2 id="membership-title">Community and tools, in one account.</h2>
          </div>
          <Link href="/pricing">Membership details</Link>
        </div>
        <div className="cell-grid cols-2">
          {memberAccess.map((item) => (
            <article className="stack-cell" key={item.name}>
              <h3>{item.name}</h3>
              <p>{item.body}</p>
              <span className="stack-status">
                <span className="badge">Members</span>
              </span>
            </article>
          ))}
        </div>
        <div className="membership-facts" aria-label="Membership terms">
          <div>
            <span>Playbook</span>
            <strong>Free</strong>
          </div>
          <div>
            <span>Refund period</span>
            <strong>30 days</strong>
          </div>
          <div>
            <span>Subscription</span>
            <strong>Cancel anytime</strong>
          </div>
        </div>
      </section>

      <section className="block" aria-labelledby="account-title">
        <div className="membership-panel">
          <p className="eyebrow">Your account</p>
          <h2 id="account-title">See exactly what is connected.</h2>
          <p>
            Sign in with an account you already use. Then manage your profile,
            email, membership, Discord access, TradingView access and billing
            from one place.
          </p>
          <Link className="button button-primary" href="/login">
            Sign in
          </Link>
        </div>
      </section>
    </>
  );
}
