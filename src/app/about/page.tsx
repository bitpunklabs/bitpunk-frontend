import type { Metadata } from "next";
import Link from "next/link";
import { AboutPersona } from "@/components/about-persona";
import { BitpunkRun } from "@/components/bitpunk-run";
import { MarblePage, marbleStyles } from "@/components/marble-page";
import { aboutContent } from "@/lib/about";
import { getAboutArtwork } from "@/lib/scene-assets";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the person behind Bitpunk. Crypto, US equities, and tools shaped by research and trading.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const artwork = getAboutArtwork();
  return (
    <MarblePage>
      <div className={styles.content}>
        <nav className={`${marbleStyles.breadcrumb} ${styles.breadcrumb}`} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">About</span>
        </nav>
        <BitpunkRun artwork={artwork.game} />
        <section className={styles.introduction} aria-labelledby="about-title">
          <header className={styles.heading}><h2 id="about-title">Behind <em>the mask.</em></h2></header>
          <div className={styles.persona}><AboutPersona artwork={artwork.persona} /></div>
          <div className={styles.prose}>
            <p>{aboutContent.introduction}</p>
            {aboutContent.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>
      </div>
    </MarblePage>
  );
}
