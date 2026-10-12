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
        copy="Independent market research. Curious minds. Room for a different view."
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
            Question what’s there. Learn how it works. Make something yourself.
            That DIY spirit shapes our research.
          </p>
        </div>
        <div className="capability-grid">
          <article className="capability">
            <span>01</span>
            <div>
              <h3>Question the obvious.</h3>
              <p>
                Look at the evidence. Test the idea.
              </p>
            </div>
          </article>
          <article className="capability">
            <span>02</span>
            <div>
              <h3>Show your working.</h3>
              <p>
                Make the reasoning and its limits visible.
              </p>
            </div>
          </article>
          <article className="capability">
            <span>03</span>
            <div>
              <h3>Stay open to revision.</h3>
              <p>
                Revisit your view when the evidence changes.
              </p>
            </div>
          </article>
          <article className="capability">
            <span>04</span>
            <div>
              <h3>Keep your own voice.</h3>
              <p>
                Leave room for art, music and a different perspective.
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
            Sketches, safety pins and familiar forms turned sideways.
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
