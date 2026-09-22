import Link from "next/link";
import { BLOG_URL } from "@/lib/links";
import { products, tiers } from "@/lib/products";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Market tools for systematic traders</p>
        <h1>Structure over noise.</h1>
        <p className="hero-copy">
          Indicators and agent-native market tools for systematic traders.
        </p>
        <div className="actions">
          <Link className="button button-primary" href="/indicators">
            Explore Indicators
          </Link>
          <Link className="button button-secondary" href="/agentics">
            View Agentics
          </Link>
        </div>
      </section>

      <section className="block block-tight" aria-label="Bitpunk Indicators">
        <div className="product-shot">
          {/* Real product UI belongs here — no mockup shell, no browser frame.
              Until the capture exists, an honest placeholder beats a fake one. */}
          <div className="product-shot-empty">
            <p className="eyebrow">Product screenshot</p>
            <p>
              A real Indicators chart goes here. Nothing is rendered until the
              capture exists — a mockup would only describe a product that has
              not been photographed yet.
            </p>
          </div>
        </div>
      </section>

      <section className="block" aria-labelledby="products-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Products</p>
            <h2 id="products-title">Two products. One market language.</h2>
          </div>
          <p className="section-intro">
            The same view of market structure, delivered twice: once for you to
            read, once for your agent to use.
          </p>
        </div>

        {products.map((product) => (
          <div className="product-row" key={product.key}>
            <div className="product-row-head">
              <p className="eyebrow">Product {product.index}</p>
              <h2>{product.name}</h2>
              <p className="tagline">{product.tagline}</p>
              <p className="is-muted">{product.summary}</p>
              <div className="actions">
                <Link className="button button-secondary" href={product.href}>
                  {product.key === "indicators"
                    ? "Explore Indicators"
                    : "View Agentics"}
                </Link>
              </div>
            </div>
            <ul className="capability-list">
              {product.capabilities.map(([title, body]) => (
                <li key={title}>
                  <strong>{title}</strong>
                  <span>{body}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="block" aria-labelledby="open-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Open</p>
            <h2 id="open-title">The rest is free.</h2>
          </div>
          <p className="section-intro">
            The work is easier to trust when you can read it before you pay for
            anything.
          </p>
        </div>
        <div className="cell-grid cols-4">
          <article>
            <h3>Blog</h3>
            <p>Market structure, trading systems, indicator design and engineering notes.</p>
            {BLOG_URL ? (
              <a className="text-link" href={BLOG_URL} target="_blank" rel="noopener noreferrer">
                Read the Blog on Substack <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <Link className="text-link" href="/blog">Read the Blog</Link>
            )}
          </article>
          <article>
            <h3>Open Source</h3>
            <p>Tools, schemas and agent utilities published under the Bitpunk org.</p>
            <Link className="text-link" href="/open-source">Browse projects</Link>
          </article>
          <article>
            <h3>Docs</h3>
            <p>How to set the indicators up and how to connect an agent.</p>
            <Link className="text-link" href="/docs">Read the docs</Link>
          </article>
          <article>
            <h3>Discord</h3>
            <p>Free for everyone. No account and no purchase required to join.</p>
            <Link className="text-link" href="/about">About the community</Link>
          </article>
        </div>
      </section>

      <section className="block" aria-labelledby="pricing-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Pricing</p>
            <h2 id="pricing-title">Free, then one step at a time.</h2>
          </div>
          <Link className="text-link" href="/pricing">See full pricing</Link>
        </div>
        <div className="fact-rail">
          {tiers.map((tier) => (
            <div key={tier.key}>
              <span>{tier.name}</span>
              <strong>
                {tier.price}
                {tier.priceCaption ? ` ${tier.priceCaption}` : ""}
              </strong>
              {tier.termNote ? <small>{tier.termNote}</small> : null}
            </div>
          ))}
          <div>
            <span>Settlement</span>
            <strong>USDC · USDT</strong>
          </div>
        </div>
        <p className="commerce-note">
          Indicators and Agentics are sold as 30 prepaid days. Nothing renews
          automatically — you buy the next period yourself when you want it.
          Agentics includes everything in Indicators. Checkout is not open yet.
        </p>
      </section>
    </>
  );
}
