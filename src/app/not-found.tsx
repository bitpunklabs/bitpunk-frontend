import { Artwork } from "@/components/artwork";
import { ArrowLink } from "@/components/editorial";
export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">404 / Off the record</p>
      <Artwork
        name="wired-microphone"
        alt="An engraved microphone and tangled cable."
        sizes="400px"
      />
      <h1>LOST THE SIGNAL.</h1>
      <p>This page isn’t in the collection.</p>
      <ArrowLink href="/" solid>
        Back to Bitpunk
      </ArrowLink>
    </section>
  );
}
