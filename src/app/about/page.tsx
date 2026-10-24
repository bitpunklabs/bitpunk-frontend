import type { Metadata } from "next";
import { AboutPersona } from "@/components/about-persona";
import { ContactLink } from "@/components/contact-link";
import { BitpunkRun } from "@/components/bitpunk-run";
import { MarblePage, MarbleHero, MarbleContent, PageAction } from "@/components/marble-page";
import { PlatformIcon } from "@/components/platform-icon";
import { aboutContent } from "@/lib/about";
import { getAboutArtwork } from "@/lib/scene-assets";
import { destinations } from "@/lib/showcase";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: aboutContent.introduction,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const artwork = getAboutArtwork();
  return (
    <MarblePage>
      <MarbleHero scene="about" section="About"
        title={<>Behind<br /><em>the mask.</em></>}
        copy="Meet the bitpunk." />
      <MarbleContent>
        <section className={styles.introduction} aria-label="About Jake and Bitpunk">
          <div className={styles.prose}>
            <p>{aboutContent.introduction}</p>
            {aboutContent.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            <div className={styles.follow}>
              <p><em className={styles.signoff}>{aboutContent.signoff}</em></p>
              <nav className={styles.channels} aria-label="Follow Jake">
                <PageAction href={destinations.x ?? "https://x.com/bitpunklabs"} external quiet><span className={styles.platform}><PlatformIcon name="X" />X</span></PageAction>
                <PageAction href={destinations.substack ?? "https://substack.com/@bitpunk"} external quiet><span className={styles.platform}><PlatformIcon name="Substack" />Substack</span></PageAction>
                <PageAction href={destinations.tradingview} external quiet><span className={styles.platform}><PlatformIcon name="TradingView" />TradingView</span></PageAction>
                <PageAction href={destinations.github} external quiet><span className={styles.platform}><PlatformIcon name="GitHub" />GitHub</span></PageAction>
                <ContactLink label="Email" icon showAddress />
              </nav>
            </div>
          </div>
          <div className={styles.persona}><AboutPersona artwork={artwork.persona} /></div>
        </section>
        <BitpunkRun artwork={artwork.game} />
      </MarbleContent>
    </MarblePage>
  );
}
