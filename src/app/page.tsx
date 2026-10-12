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
            For those who read the market
            <br />
            and question the consensus.
          </p>
          <p className="hero-description">
            Evidence, open methods and field notes.
            <br />A considered view. Always open to question.
          </p>
          <div className="hero-actions">
            <ArrowLink href="#indicators" solid>Explore indicators</ArrowLink>
            <ArrowLink href="#work">Explore open source</ArrowLink>
          </div>
        </div>
        <HeroArt />
      </section>
      <section id="indicators" className="work-section">
        <SectionLabel number="01">Indicator</SectionLabel>
        <div className="journal-spread indicator-spread">
          <div className="journal-copy">
            <h2>READ BETWEEN<br /><span className="serif-word">the candles.</span></h2>
            <p className="lead">Structure, context,<br />and signals worth a closer look.</p>
            <p>Paid TradingView indicators for a consistent reading process. Explore market structure, focus your watchlist, and follow defined conditions with alerts and structured output.</p>
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
      <section id="work" className="work-section">
        <SectionLabel number="02">Open source</SectionLabel>
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
              A point of view is only as useful
              <br />
              as the reasoning behind it.
            </p>
            <p>
              Explore the code behind the research, starting with Ticker
              Universe Builder: market universes with explicit criteria, dated
              evidence and a record you can inspect.
            </p>
            <ArrowLink href="/open-source">Explore open source</ArrowLink>
          </div>
        </div>
      </section>
      <section id="blog" className="journal-section">
        <SectionLabel number="03">Blog</SectionLabel>
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
              Markets, the stories they tell,
              <br />
              and the ideas that won’t sit still.
            </p>
            <p>
              Field notes on market behavior, competing explanations and the
              evidence that changes a view.
            </p>
            <ArrowLink
              href={destinations.substack || "/blog"}
              external={Boolean(destinations.substack)}
            >
              {destinations.substack ? "Read on Substack" : "Explore the blog"}
            </ArrowLink>
            <span className="publication-note">
              {destinations.substack
                ? "Published on Substack."
                : "Essays coming soon."}
            </span>
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
            Question the obvious. Make the reasoning visible. Leave room for a
            different view. That’s the thread running through everything here.
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
