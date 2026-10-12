import type { Metadata } from "next";
import { Artwork } from "@/components/artwork";
import { PageHero, SectionLabel, ArrowLink } from "@/components/editorial";
import { destinations } from "@/lib/showcase";
export const metadata: Metadata = {
  title: "About",
  description:
    "Independent market research with rigor in the work and rebellion in the spirit. Meet Bitpunk.",
  alternates: { canonical: "/about" },
};
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Bitpunk / The independent spirit"
        title={
          <>
            A MIND
            <br />
            OF OUR <span className="serif-word">own.</span>
          </>
        }
        copy="Bitpunk is a home for independent market research. We follow the evidence, question familiar narratives, and make room for a different view."
        art="classical-bust-pinned-blindfold"
        alt="A classical bust with a torn-paper blindfold held by a safety pin."
      >
        <ArrowLink href={destinations.github} external solid>
          Follow the work
        </ArrowLink>
      </PageHero>
      <section className="content-section">
        <SectionLabel number="01">
          Rigor in the work. Rebellion in the spirit.
        </SectionLabel>
        <div className="about-band">
          <Artwork
            name="punk-band-portrait"
            alt="An illustrated portrait of four punk musicians."
          />
          <p>
            The DIY impulse is simple: question what’s there, learn how it
            works, and make something yourself. We bring that attitude to market
            research: examine the evidence, test the explanation, and form our
            own view.
          </p>
        </div>
        <div className="capability-grid">
          <article className="capability">
            <span>01</span>
            <div>
              <h3>Question the obvious.</h3>
              <p>
                Keep evidence and interpretation separate. Give an idea room to
                be challenged.
              </p>
            </div>
          </article>
          <article className="capability">
            <span>02</span>
            <div>
              <h3>Show your working.</h3>
              <p>
                Make the assumptions, methods and limits visible. Good work
                should stand up to a closer look.
              </p>
            </div>
          </article>
          <article className="capability">
            <span>03</span>
            <div>
              <h3>Stay open to revision.</h3>
              <p>
                State what would change the thesis. Revisit conclusions as new
                evidence arrives, and make uncertainty part of the work.
              </p>
            </div>
          </article>
          <article className="capability">
            <span>04</span>
            <div>
              <h3>Keep your own voice.</h3>
              <p>
                Discipline and imagination belong together. Leave space for art,
                music and a different perspective.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className="content-section">
        <SectionLabel number="02">From the visual notebook</SectionLabel>
        <div className="section-heading">
          <h2>
            A LITTLE
            <br />
            <span className="serif-word">beautiful friction.</span>
          </h2>
          <p>
            Engraved lines, safety pins and familiar forms turned sideways. A
            visual nod to the DIY energy of punk and the absurdity of collage.
          </p>
        </div>
        <div className="art-gallery">
          {[
            [
              "banana-safety-pin",
              "01 / The underground",
              "A peeled banana held together with a safety pin.",
            ],
            [
              "victorian-iron-head",
              "02 / A different head",
              "A Victorian figure with a clothes iron in place of a head.",
            ],
            [
              "rose-thorns-safety-pin",
              "03 / Tender resistance",
              "A black rose with thorns and a safety pin.",
            ],
          ].map(([name, caption, alt]) => (
            <figure key={name}>
              <Artwork
                name={name}
                alt={alt}
                sizes="(max-width: 700px) 85vw, 28vw"
              />
              <figcaption>
                <span>{caption}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
