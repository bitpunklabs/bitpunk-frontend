import type { Metadata } from "next";
import { PageHero, SectionLabel, ArrowLink } from "@/components/editorial";
import { destinations } from "@/lib/showcase";
export const metadata: Metadata = {
  title: "GitHub",
  description:
    "Open-source research from Bitpunk Labs. Inspect the methods, evidence and code behind Ticker Universe Builder.",
  alternates: { canonical: "/open-source/github" },
};
export default function GitHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Open source / GitHub"
        title={
          <>
            GOOD IDEAS
            <br />
            TRAVEL <span className="serif-word">open.</span>
          </>
        }
        copy="Research benefits from a closer look. Read the code, examine the evidence, and follow the reasoning from question to conclusion."
        art="sculpture-hand-safety-pin"
        alt="An engraved hand holding a safety pin."
      >
        <ArrowLink href={destinations.github} external solid>
          Visit Bitpunk on GitHub
        </ArrowLink>
      </PageHero>
      <section className="content-section">
        <SectionLabel number="01">Featured repository</SectionLabel>
        <div className="project-feature">
          <div>
            <h2>
              TICKER UNIVERSE
              <br />
              BUILDER
            </h2>
            <p>
              An agent skill for building auditable ticker universes across 14
              markets. It turns market research into a structured collection of
              instruments, with dated evidence and an explicit role for every
              member.
            </p>
            <div className="project-meta">
              <span className="tag">Python</span>
              <span className="tag">MIT license</span>
              <span className="tag">Agent skill</span>
            </div>
            <ArrowLink href={destinations.universe} external solid>
              Explore the repository
            </ArrowLink>
          </div>
          <dl className="project-spec">
            <div>
              <dt>Coverage</dt>
              <dd>14 supported markets</dd>
            </div>
            <div>
              <dt>Outputs</dt>
              <dd>Watchlists, JSON snapshots and validation reports</dd>
            </div>
            <div>
              <dt>Traceability</dt>
              <dd>Membership roles, reasons and dated evidence</dd>
            </div>
            <div>
              <dt>Validation</dt>
              <dd>Deterministic checks over agent-produced research</dd>
            </div>
            <div>
              <dt>Runtime</dt>
              <dd>Python 3.10+ · standard library</dd>
            </div>
          </dl>
        </div>
      </section>
      <section className="content-section">
        <SectionLabel number="02">Behind the publication</SectionLabel>
        <div className="source-row">
          <span className="eyebrow">↳</span>
          <h3>THIS WEBSITE</h3>
          <p>
            The source behind this little corner of the internet. Built with
            Next.js and an independent visual language.
          </p>
          <ArrowLink href={destinations.website} external>
            View source
          </ArrowLink>
        </div>
      </section>
    </>
  );
}
