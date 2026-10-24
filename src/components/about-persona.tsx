import Image from "next/image";
import type { AboutArtwork } from "@/lib/scene-assets";
import styles from "./about-persona.module.css";

export function AboutPersona({ artwork }: { artwork: AboutArtwork["persona"] }) {
  return <figure className={styles.persona}>
    <Image {...artwork.stonks} className={styles.image} unoptimized loading="lazy"
      alt="The masked Bitpunk persona in a suit, beside a rising orange arrow and the word stonks." />
  </figure>;
}
