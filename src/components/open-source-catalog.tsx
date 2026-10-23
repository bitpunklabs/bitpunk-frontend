import Image from "next/image";
import { destinations } from "@/lib/showcase";
import { getChannelArtwork } from "@/lib/scene-assets";
import { ActionLabel } from "./action-label";
import { PageAction, marbleStyles } from "./marble-page";
import { PlatformIcon } from "./platform-icon";
import { OpenIndicatorSection } from "./open-indicator-section";
import { ResearchDirections } from "./research-directions";
import catalog from "./indicator-catalog.module.css";
import styles from "./open-source-catalog.module.css";

const developmentDirections = [
  {
    title: "Market tools",
    copy: "Build watchlists and organise market data into a clearer starting point for research.",
    href: destinations.universe, action: "Ticker Universe Builder",
  },
  {
    title: "Research workflows",
    copy: "Turn sources and observations into repeatable market briefs and practical research tools.",
    href: "https://github.com/bitpunklabs/market-brief", action: "Market Brief",
  },
  {
    title: "Apps & experiments",
    copy: "Explore small apps, creative tools and useful ideas made tangible through code.",
    href: destinations.github + "?tab=repositories", action: "Explore projects",
  },
];

function GitHubSection() {
  const artwork = getChannelArtwork();
  const banner = artwork.github;
  return <article id="github" className={catalog.product} aria-labelledby="github-title">
    <div className={catalog.withGallery}>
      <div className={catalog.introduction}>
        <h2 className={catalog.name} id="github-title"><span>GitHub{" "}</span><span>projects</span></h2>
        <div className={catalog.description}>
          <p>Open-source projects and shared tools to explore and build on.</p>
          <p>Explore practical tools and small experiments. Read the code, test an idea and adapt it to your own workflow.</p>
          <p>This website’s frontend code is open source on GitHub. Artwork, brand assets and paid indicator logic stay private.</p>
        </div>
        <div className={catalog.resources}><PageAction href={destinations.github} external quiet>Explore on GitHub</PageAction><PageAction href={destinations.website} external quiet>View website source</PageAction></div>
      </div>
      <div className={styles.githubPreview}>
        <a className={styles.githubFrame} href={destinations.github} target="_blank" rel="noopener noreferrer"
          aria-label="Explore BITPUNK projects on GitHub">
          <span className={styles.frameBar}><PlatformIcon name="GitHub" /><span>bitpunklabs <span className={styles.fileName}>/ README.md</span></span>
            <span className={styles.externalMark} aria-hidden="true">↗</span>
          </span>
          <picture className={styles.banner}>
            <source media="(prefers-reduced-motion: reduce)" srcSet={banner.staticSrc} />
            <Image src={banner.src} width={banner.width} height={banner.height} unoptimized
              alt="BITPUNK — Research, indicators and open source. Where market ideas take shape." />
          </picture>
          <span className={styles.profileFooter}>
            <Image {...artwork.avatar} alt="" unoptimized />
            <span><strong>BITPUNK</strong><small>@bitpunklabs</small></span>
            <span className={styles.frameAction}><ActionLabel>Explore on GitHub</ActionLabel></span>
          </span>
        </a>
      </div>
    </div>
    <ResearchDirections label="GitHub development directions" topics={developmentDirections} />
  </article>;
}

export function OpenSourceCatalog() {
  return <section className={marbleStyles.chapter} aria-label="Open-source collections">
    <div className={catalog.grid}>
      <GitHubSection />
      <OpenIndicatorSection title="TradingView indicators" id="tradingview" />
    </div>
  </section>;
}
