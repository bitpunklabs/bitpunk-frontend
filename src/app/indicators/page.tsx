import type { Metadata } from "next";
import Link from "next/link";
import { products, tiers } from "@/lib/products";

const product = products[0];
const tier = tiers.find((entry) => entry.key === "indicators")!;

export const metadata: Metadata = {
  title: "Indicators",
  description:
    "Trading indicators and screening tools built around market structure, delivered on TradingView.",
};

export default function IndicatorsPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Product {product.index} / Indicators</p>
        <h1>{product.tagline}</h1>
        <p className="hero-copy">{product.summary}</p>
        <div className="actions">
          <Link className="button button-primary" href="/pricing">
            Get Indicators
          </Link>
          <Link className="button button-secondary" href="/docs">
            Read the docs
          </Link>
        </div>
      </section>

      <section className="block block-tight" aria-label="Indicators screenshot">
        <div className="product-shot">
          <div className="product-shot-empty">
            <p className="eyebrow">Product screenshot</p>
            <p>
              A real chart with the indicators running goes here, captured from
              TradingView rather than assembled in a design tool.
            </p>
          </div>
        </div>
      </section>

      <section className="block" aria-labelledby="does-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">What it does</p>
            <h2 id="does-title">Read the market, then narrow it down.</h2>
          </div>
        </div>
        <div className="cell-grid cols-2">
          {product.capabilities.map(([title, body]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="block" aria-labelledby="delivery-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Delivery</p>
            <h2 id="delivery-title">How you get access.</h2>
          </div>
          <p className="section-intro">{product.delivery}</p>
        </div>
        <ul className="plain-list">
          <li>Free indicators are published openly and need no account.</li>
          <li>
            Paid indicators are invite-only scripts. After purchase you submit
            your TradingView username in your account.
          </li>
          <li>
            Access is granted manually and the account page shows the real
            state — submitted, pending review, active, or username not found.
          </li>
        </ul>
      </section>

      <section className="block" aria-labelledby="price-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Price</p>
            <h2 id="price-title">{tier.price} {tier.priceCaption}</h2>
          </div>
        </div>
        <p className="tier-term">{tier.termNote}</p>
        <div className="actions">
          <Link className="button button-primary" href="/pricing">
            Get Indicators
          </Link>
        </div>
        <p className="commerce-note">
          Paid in USDC or USDT. Nothing renews automatically — you buy the next
          30 days yourself. Checkout is not open yet, and creating an account
          does not charge you. Read the{" "}
          <Link href="/refund-policy">refund policy</Link>.
        </p>
      </section>
    </>
  );
}
