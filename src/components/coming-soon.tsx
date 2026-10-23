import Image from "next/image";
import Link from "next/link";
import { PlatformIcon } from "@/components/platform-icon";
import { Wordmark } from "@/components/wordmark";
import type { HomeArtwork } from "@/lib/scene-assets";
import { destinations } from "@/lib/showcase";
import styles from "./coming-soon.module.css";

const variants = [
  { id: "atrium", letter: "A", name: "浮雕序厅" },
  { id: "study", letter: "B", name: "思考者" },
  { id: "gallery", letter: "C", name: "小型展廊" },
] as const;
export type ComingSoonVariant = typeof variants[number]["id"];
export function isComingSoonVariant(value: unknown): value is ComingSoonVariant {
  return variants.some(item => item.id === value);
}

function Status() {
  return <p className={styles.status}><span aria-hidden="true" />A new perspective is taking shape.</p>;
}

function FollowLink() {
  return <a className={styles.follow} href={destinations.tradingview!}
    target="_blank" rel="noopener noreferrer">
    <PlatformIcon name="TradingView" />
    <span>Find us on TradingView</span>
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  </a>;
}

function ReviewNav({ variant }: { variant: ComingSoonVariant }) {
  return <nav className={styles.review} aria-label="Coming soon design review">
    <span className={styles.reviewLabel}>方案预览</span>
    {variants.map(item => <Link key={item.id} href={`/coming-soon?view=${item.id}`}
      aria-current={variant === item.id ? "page" : undefined} scroll={false}>
      <b>{item.letter}</b><span>{item.name}</span>
    </Link>)}
    <Link className={styles.back} href="/">返回网站</Link>
  </nav>;
}

export function ComingSoon({ variant, artwork, review = false }: {
  variant: ComingSoonVariant;
  artwork: HomeArtwork;
  review?: boolean;
}) {
  const wordmark = <Wordmark artwork={artwork.wordmark} />;
  return <div className={styles.page} data-coming-soon data-variant={variant} data-review={review || undefined}>
    {variant === "atrium" ? <>
      <picture className={styles.atriumArt}>
        <source media="(max-width: 700px), (max-aspect-ratio: 4/5)" srcSet={artwork.plates.mobile.src} />
        <Image src={artwork.plates.desktop.src} alt="" width={artwork.plates.desktop.width}
          height={artwork.plates.desktop.height} unoptimized loading="eager" fetchPriority="high" />
      </picture>
      <div className={styles.atriumContent}>
        <div className={styles.atriumBrand}>{wordmark}</div>
        <p className={styles.brandLine}>Research, indicators and open source.<br />{" "}Where market ideas take shape.</p>
        <div className={styles.atriumAnnouncement}>
          <h1>Coming <em>soon.</em></h1>
          <FollowLink />
        </div>
      </div>
    </> : variant === "study" ? <>
      <Image className={styles.studyArt} src="/art/marble-pages/research.webp" alt=""
        fill unoptimized sizes="100vw" loading="eager" fetchPriority="high" />
      <header className={styles.header}>
        <div className={styles.smallBrand}>{wordmark}</div>
      </header>
      <div className={styles.studyContent}>
        <p className={styles.kicker}>Coming soon</p>
        <h1>Another<br /><em>perspective.</em></h1>
        <p className={styles.brandLine}>Research, indicators and open-source tools<br />{" "}for those who read the market.</p>
        <div className={styles.studyAnnouncement}><FollowLink /></div>
      </div>
      <footer className={styles.studyFooter}><Status /><span>Bitpunk © {new Date().getFullYear()}</span></footer>
    </> : <>
      <header className={styles.galleryHeader}><div className={styles.smallBrand}>{wordmark}</div><span className={styles.soonLabel}>Coming soon</span></header>
      <div className={styles.galleryIntro}>
        <h1>Ideas take <em>shape.</em></h1>
        <p className={styles.brandLine}>Research, indicators and open-source tools<br />{" "}for those who read the market.</p>
      </div>
      <div className={styles.exhibits} aria-label="Bitpunk sculpture collection">
        {[
          { id: "indicators", label: "Market observation", src: "/art/marble-pages/indicators.webp" },
          { id: "research", label: "Independent thought", src: "/art/marble-pages/research.webp" },
          { id: "about", label: "An open perspective", src: "/art/marble-pages/about.webp" },
        ].map(item => <figure className={styles.exhibit} key={item.id} data-exhibit={item.id}>
          <div className={styles.exhibitImage}><Image src={item.src} alt={item.label}
            fill sizes="(max-width: 700px) 50vw, 30vw" unoptimized loading="eager" /></div>
          <figcaption>{item.label}</figcaption>
        </figure>)}
      </div>
      <footer className={styles.galleryFooter}><Status /><FollowLink /></footer>
    </>}
    {review && <ReviewNav variant={variant} />}
  </div>;
}
