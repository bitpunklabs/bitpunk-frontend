import type { Metadata } from "next";
import Link from "next/link";
import { AboutPersona } from "@/components/about-persona";
import { ContactLink } from "@/components/contact-link";
import { BitpunkRun } from "@/components/bitpunk-run";
import { MarblePage, PageAction, marbleStyles } from "@/components/marble-page";
import { PlatformIcon } from "@/components/platform-icon";
import { aboutContent } from "@/lib/about";
import { getAboutArtwork } from "@/lib/scene-assets";
import { destinations } from "@/lib/showcase";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "Hi, I’m Jake, the person behind Bitpunk. Research, indicators and open-source tools for exploring how markets behave.",
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
            <div className={styles.follow}>
              <p>{aboutContent.signoff}</p>
              <nav className={styles.channels} aria-label="Follow Jake">
                <PageAction href={destinations.x ?? "https://x.com/bitpunklabs"} external quiet><span className={styles.platform}><PlatformIcon name="X" />X</span></PageAction>
                <PageAction href={destinations.substack ?? "https://substack.com/@bitpunklabs"} external quiet><span className={styles.platform}><PlatformIcon name="Substack" />Substack</span></PageAction>
                <PageAction href={destinations.tradingview} external quiet><span className={styles.platform}><PlatformIcon name="TradingView" />TradingView</span></PageAction>
                <PageAction href={destinations.github} external quiet><span className={styles.platform}><PlatformIcon name="GitHub" />GitHub</span></PageAction>
                <ContactLink label="Email" icon showAddress />
              </nav>
            </div>
          </div>
        </section>
      </div>
    </MarblePage>
  );
}
