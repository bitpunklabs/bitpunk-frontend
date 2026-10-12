import type { Metadata } from "next";
import { Artwork } from "@/components/artwork";
import { HeroArt } from "@/components/hero-art";
import { ArrowLink, SectionLabel } from "@/components/editorial";
import { destinations } from "@/lib/showcase";
export const metadata: Metadata = { alternates: { canonical: "/" } };
export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" /> Independent market research
          </p>
          <h1>
            MAKE SENSE.
            <br />
            <span className="ink-outline">MAKE NOISE.</span>
          </h1>
          <p className="hero-deck">
            Research, indicators and open-source tools for those who read the market.
          </p>
          <div className="hero-actions">
            <ArrowLink href="#indicators" solid>Explore indicators</ArrowLink>
            <ArrowLink href="#blog">Explore research</ArrowLink>
          </div>
        </div>
        <HeroArt />
      </section>
      <section id="indicators" className="work-section">
        <SectionLabel number="01">Indicator</SectionLabel>
        <div className="journal-spread indicator-spread">
          <div className="journal-copy">
            <h2>READ BETWEEN<br /><span className="serif-word">the candles.</span></h2>
            <p className="lead">A closer look<br />at the market.</p>
            <p>Explore trend context and market structure with our TradingView indicators.</p>
            <ArrowLink href="/indicators">Explore indicators</ArrowLink>
          </div>
          <div className="journal-art">
            <Artwork
              name="classical-bust-candlestick-blindfold"
              alt="A classical bust with a candlestick chart across its eyes."
              sizes="(max-width: 700px) 85vw, 42vw"
            />
          </div>
        </div>
      </section>
      <section id="blog" className="journal-section">
        <SectionLabel number="02">Blog</SectionLabel>
        <div className="journal-spread">
          <div className="journal-art">
            <Artwork
              name="poet-jacket-portrait"
              alt="An engraved portrait of an independent-minded poet, jacket over one shoulder."
            />
          </div>
          <div className="journal-copy">
            <h2>
              THINKING
              <br />
              OUT <span className="serif-word">loud.</span>
            </h2>
            <p className="lead">
              Notes on markets.<br />Room for a different view.
            </p>
            <p>
              Research and reflections on a changing market.
            </p>
            <ArrowLink
              href={destinations.substack || "/blog"}
              external={Boolean(destinations.substack)}
            >
              {destinations.substack ? "Read on Substack" : "Explore research"}
            </ArrowLink>
            <span className="publication-note">
              {destinations.substack
                ? "Published on Substack."
                : "Essays coming soon."}
            </span>
          </div>
        </div>
      </section>
      <section id="work" className="work-section">
        <SectionLabel number="03">Open source</SectionLabel>
        <div className="journal-spread research-spread">
          <div className="journal-art research-art">
            <Artwork
              name="sculpture-hand-safety-pin"
              alt="An engraved hand holding a safety pin."
              sizes="(max-width: 700px) 85vw, 42vw"
            />
          </div>
          <div className="journal-copy research-copy">
            <h2>
              RESEARCH
              <br />
              <span className="serif-word">in the open.</span>
            </h2>
            <p className="lead">
              Open ideas.<br />Shared tools.
            </p>
            <p>
              Explore the code, follow the methods, and build on the work.
            </p>
            <ArrowLink href="/open-source">Explore open source</ArrowLink>
          </div>
        </div>
      </section>
      <section id="about" className="manifesto-section">
        <div>
          <p className="eyebrow">04 / About</p>
          <h2>
            RIGOR IN THE WORK.
            <br />
            <span className="serif-word">Rebellion in the spirit.</span>
          </h2>
          <p>
            Think independently. Show the reasoning. Stay open to change.
          </p>
          <ArrowLink href="/about">Meet Bitpunk</ArrowLink>
        </div>
        <Artwork
          name="rose-thorns-safety-pin"
          alt="A black rose with thorns and a dangling safety pin."
          sizes="(max-width: 700px) 45vw, 25vw"
        />
      </section>
    </>
  );
}
