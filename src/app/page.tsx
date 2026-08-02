import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { getPublicPosts } from "@/lib/content-repository";

export default async function HomePage() {
  const featuredPosts = (await getPublicPosts()).slice(0, 3);

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Market intelligence for systematic traders</p>
        <h1>Make market complexity easier to reason about.</h1>
        <p className="hero-copy">
          Bitpunk publishes structured frameworks, risk boundaries, and operating notes for traders who value discipline over noise.
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

      <section className="principles" aria-labelledby="principles-title">
        <p className="eyebrow" id="principles-title">
          What Bitpunk helps you do
        </p>
        <div className="three-column-grid">
          <article><h2>Learn the framework.</h2><p>Build repeatable ways to read conditions and risk.</p></article>
          <article><h2>Read with structure.</h2><p>Separate evidence, assumptions, and invalidation points.</p></article>
          <article><h2>Act with discipline.</h2><p>Keep decisions tied to rules rather than noise.</p></article>
        </div>
      </section>

      <section className="section" aria-labelledby="featured-title">
        <div className="section-heading">
          <div><p className="eyebrow">Featured public research</p><h2 id="featured-title">Start with a better operating framework.</h2></div>
          <Link href="/playbook">All Playbook →</Link>
        </div>
        <div className="content-grid">{featuredPosts.map((post) => <ContentCard key={post.slug} post={post} />)}</div>
      </section>

      <section className="membership-panel">
        <p className="eyebrow">Bitpunk Membership</p>
        <h2>One account for future Bitpunk access.</h2>
        <p>Public research stays open. Membership will connect product access, Discord and TradingView rights over time.</p>
        <Link className="button button-primary" href="/pricing">Become a member</Link>
      </section>
    </>
  );
}
