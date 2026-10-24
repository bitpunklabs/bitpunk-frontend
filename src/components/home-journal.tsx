import Link from "next/link";
import Image from "next/image";
import { AlphaShowcase } from "./alpha-showcase";
import { HomeUpdates } from "./home-waterfall";
import { PlatformIcon } from "./platform-icon";
import { ActionLabel, actionStyles } from "./action-label";
import { getAboutArtwork, getAlphaScreenshots, getChannelArtwork } from "@/lib/scene-assets";
import { getHomeUpdates } from "@/lib/home-updates.server";
import { alphaIndicator } from "@/lib/indicators";
import styles from "./home-journal.module.css";

export async function HomeJournal({ feedTheme = "dark" }: { feedTheme?: "light" | "dark" }) {
  const homeUpdates = await getHomeUpdates();
  const screenshots = getAlphaScreenshots();
  const artwork = getChannelArtwork();
  const thinking = getAboutArtwork().persona.thinking;
  return <div className={styles.journal} data-home-journal>
    <div className={styles.inner}>
      <section className={`${styles.section} ${styles.updatesSection}`} aria-labelledby="home-updates-title">
        <div className={styles.sectionHeading}>
          <h2 id="home-updates-title">Stay in the loop.</h2>
          <p>Market notes, deeper reads and tools to explore.</p>
        </div>
        <HomeUpdates entries={homeUpdates} chartPreview={screenshots[0]} artwork={artwork} theme={feedTheme} />
      </section>

      <section className={`${styles.section} ${styles.product}`} aria-labelledby="home-indicators-title">
        <div className={styles.productCopy}>
          <p className={styles.eyebrow}>Indicators</p>
          <h2 id="home-indicators-title">Beyond<br /><em>the candles.</em></h2>
          <p className={styles.description}>Momentum, Trend and Market Structure, in one view.<br />Meet <em>bitpunk.alpha</em>.</p>
          <div className={styles.productActions}>
            <Link className={`${styles.link} ${actionStyles.interactive}`} href="/indicators"><ActionLabel>Explore Indicators</ActionLabel></Link>
            <a className={`${styles.link} ${actionStyles.interactive}`} href={alphaIndicator.tradingViewUrl} target="_blank" rel="noopener noreferrer"><ActionLabel>Explore Alpha on TradingView</ActionLabel></a>
          </div>
        </div>
        <div className={styles.gallery}><AlphaShowcase slides={screenshots} /></div>
      </section>

      <section className={`${styles.section} ${styles.resources}`} aria-labelledby="home-research-title">
        <div className={styles.resourceIntroduction}>
          <p className={styles.eyebrow}>Research &amp; open source</p>
          <h2 id="home-research-title">Open to<br /><em>exploration.</em></h2>
          <p className={styles.description}>Fresh perspectives and tools to make your own.</p>
        </div>
        <div className={styles.resourceList}>
          <Link className={`${styles.resource} ${actionStyles.interactive}`} href="/research">
            <span className={styles.resourceType}>Research</span>
            <h3>Another perspective.</h3>
            <p>Market notes and deeper reads to inform your own view.</p>
            <span className={styles.resourceAction}><ActionLabel>Explore Research</ActionLabel></span>
          </Link>
          <Link className={`${styles.resource} ${actionStyles.interactive}`} href="/open-source">
            <span className={styles.resourceType}>Open source</span>
            <h3>Ideas, made open.</h3>
            <p>Chart studies and research tools you can use and adapt.</p>
            <span className={styles.resourceAction}><ActionLabel>Explore Open Source</ActionLabel></span>
          </Link>
        </div>
      </section>

      <section className={styles.follow} aria-labelledby="home-follow-title">
        <h2 id="home-follow-title">Follow the research<br /><em>as it develops.</em></h2>
        <div className={styles.followLinks}>
          {homeUpdates.map(entry => entry.href ?
            <a key={entry.id} className={`${styles.followLink} ${actionStyles.interactive}`} href={entry.href} target="_blank" rel="noopener noreferrer">
              <PlatformIcon name={entry.platform} /><ActionLabel>{entry.platform}</ActionLabel>
            </a> : <span key={entry.id} className={`${styles.followLink} ${styles.followPending}`}>
              <PlatformIcon name={entry.platform} /><span>{entry.platform}<small>Coming soon</small></span>
            </span>)}
        </div>
        <Link className={`${styles.aboutLink} ${actionStyles.interactive}`} href="/about"><ActionLabel>About Bitpunk</ActionLabel></Link>
        <Image {...thinking} className={styles.followPersona} unoptimized loading="lazy"
          alt="The Bitpunk persona, seated in thought." />
      </section>
    </div>
  </div>;
}
