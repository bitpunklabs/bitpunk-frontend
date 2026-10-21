"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ActionLabel, actionStyles } from "./action-label";
import { PlatformIcon } from "./platform-icon";
import { OfficialPostEmbed } from "./official-post-embed";
import type { HomePost, HomeUpdate } from "@/lib/home-updates";
import type { MarketScreenshot } from "@/lib/alpha-showcase";
import styles from "./home-waterfall.module.css";

type FeedItem = { channel: HomeUpdate; post: HomePost; rank: number };

/** Concept illustrations have no prices or dates and do not represent market data. */
function PostArtwork({ kind, chart }: { kind: HomePost["artwork"]; chart: MarketScreenshot }) {
  if (!kind) return null;
  if (kind === "alpha") return <div className={styles.chartImage}>
    <Image src={chart.src} alt={`${chart.name} chart showing bitpunk.alpha`}
      width={chart.width} height={chart.height} unoptimized loading="lazy" />
    <span>{chart.label} / {chart.timeframe}</span>
  </div>;
  if (kind === "essay") return <div className={`${styles.artwork} ${styles.essayArtwork}`} aria-hidden="true">
    <span className={styles.artLabel}>BITPUNK / RESEARCH</span>
    <span className={styles.essayTitle}>Context<br />before<br /><i>conviction.</i></span>
    <span className={styles.essayRule} />
  </div>;
  return <div className={styles.artwork} data-artwork={kind} aria-hidden="true">
    <span className={styles.artLabel}>{kind === "context" ? "FIELD NOTES" : "OPEN CHART STUDIES"}</span>
    <svg viewBox="0 0 400 220" fill="none" className={styles.studyChart}>
      <path className={styles.chartGrid} d="M0 50h400M0 110h400M0 170h400M60 0v220M160 0v220M260 0v220M360 0v220" />
      {kind === "context" ? <>
        <path className={styles.chartContext} d="M0 183c74 0 90-51 148-49s75 8 121-31S345 71 400 30" />
        <path className={styles.chartLine} d="m0 182 19-14 18 7 19-34 18 14 19-39 18 14 19-8 18-37 19 22 18-3 19 26 18-14 19 8 18-31 19 10 18-39 19 11 18-42 19 5 18-25" />
        <circle className={styles.chartFocus} cx="240" cy="119" r="20" />
        <path className={styles.chartAnnotation} d="m255 105 28-28h53" />
      </> : <>
        <path className={styles.chartZone} d="M15 75h365v44H15z" />
        <path className={styles.chartLine} d="m5 172 20-21 19 9 20-36 19 12 20-39 19 12 20-45 19 19 20-7 19 24 20-13 19 8 20-30 19 13 20-41 19 14 20-45 19 9" />
        <path className={styles.chartAnnotation} d="M15 75h365M15 119h365" />
      </>}
    </svg>
  </div>;
}

function PostCard({ item, chart, onRead, theme }: { item: FeedItem; chart: MarketScreenshot; onRead: (item: FeedItem) => void; theme: "light" | "dark" }) {
  const { channel, post } = item;
  const titleId = useId();
  if (post.embed) return <OfficialPostEmbed embed={post.embed} platform={channel.platform} theme={theme} />;
  const artwork = post.imageUrl && post.href ? <PostThumbnail post={post} /> : post.artwork && <button className={styles.artButton} type="button" onClick={() => onRead(item)} aria-label={`View: ${post.title}`}>
    <PostArtwork kind={post.artwork} chart={chart} />
  </button>;
  const byline = <div className={styles.cardByline}>
    <span className={styles.avatar}><Image src="/brand/nav-favicon.svg" width={30} height={30} alt="" unoptimized /></span>
    <span className={styles.author}><strong>{post.author || "Bitpunk"}</strong><span>{channel.id === "tradingview" ? "bitpunk_labs" : channel.platform}</span></span>
    <span className={styles.cardSource}><PlatformIcon name={channel.platform} /></span>
  </div>;
  const copy = <div className={styles.cardCopy}>
    <p className={styles.cardCategory}>{post.category}{post.publishedAt && <time dateTime={post.publishedAt}>{new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(post.publishedAt))}</time>}{!post.published && <span>Preview</span>}</p>
    <h3 id={titleId}>{post.published && post.href
      ? <a href={post.href} target="_blank" rel="noopener noreferrer">{post.title}</a>
      : <button type="button" onClick={() => onRead(item)}>{post.title}</button>}</h3>
    <p className={styles.summary}>{post.summary}</p>
  </div>;
  return <article className={styles.card} data-platform={channel.id} aria-labelledby={titleId}>
    {channel.id === "x" ? <>{byline}{copy}{artwork}</>
      : channel.id === "substack" ? <>{artwork}{copy}{byline}</>
      : <>{artwork}{byline}{copy}</>}
    <div className={styles.postFooter}>
      {channel.id === "x" && <span className={styles.postActions} aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-9a9 9 0 1 1 18-1Z" /></svg>
        <svg viewBox="0 0 24 24"><path d="M20.8 5.7a5.5 5.5 0 0 0-7.8 0L12 6.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z" /></svg>
        <svg viewBox="0 0 24 24"><path d="M12 16V2m-5 5 5-5 5 5M4 14v7h16v-7" /></svg>
      </span>}
      {post.published && post.href
        ? <a className={styles.platformButton} href={post.href} target="_blank" rel="noopener noreferrer">{channel.id === "substack" ? "Read on" : "View on"} {channel.platform}</a>
        : <button className={styles.platformButton} type="button" onClick={() => onRead(item)}>Read preview</button>}
    </div>
  </article>;
}

function PostThumbnail({ post }: { post: HomePost }) {
  const [failed, setFailed] = useState(false);
  if (failed || !post.imageUrl || !post.href) return null;
  return <a className={styles.artButton} href={post.href} target="_blank" rel="noopener noreferrer" aria-label={`Read: ${post.title}`}>
    <Image className={styles.postThumbnail} src={post.imageUrl} alt="" width={1200} height={750}
      data-post-thumbnail unoptimized loading="lazy" onError={() => setFailed(true)} />
  </a>;
}

function ChannelAction({ channel }: { channel: HomeUpdate }) {
  return channel.href ? <a className={`${styles.channelAction} ${actionStyles.interactive}`} href={channel.href} target="_blank" rel="noopener noreferrer">
    <ActionLabel>{channel.action}</ActionLabel>
  </a> : <span className={`${styles.channelAction} ${styles.pendingAction}`}>
    <span>{channel.action}</span><small>Coming soon</small>
  </span>;
}

export function HomeUpdates({ entries, chartPreview, theme = "dark" }: { entries: readonly HomeUpdate[]; chartPreview: MarketScreenshot; theme?: "light" | "dark" }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const [reading, setReading] = useState<FeedItem | null>(null);
  const reader = useRef<HTMLDialogElement>(null);
  const feedId = useId();
  const readerTitleId = useId();
  const allPosts = entries.flatMap(channel => channel.posts.map((post, rank) => ({ channel, post, rank })))
    .sort((a, b) => a.rank - b.rank);
  const selectedChannel = entries.find(channel => channel.id === filter);

  useEffect(() => {
    if (reading && !reader.current?.open) reader.current?.showModal();
  }, [reading]);

  return <div className={styles.waterfall} data-updates-waterfall data-theme={theme}>
    <nav className={styles.filters} aria-label="Filter updates by platform">
      <button type="button" aria-pressed={filter === "all"} aria-controls={feedId} onClick={() => { setFilter("all"); setExpanded(false); }}>All</button>
      {entries.map(channel => <button key={channel.id} type="button" aria-pressed={filter === channel.id} aria-controls={feedId}
        onClick={() => { setFilter(channel.id); setExpanded(false); }}><PlatformIcon name={channel.platform} />{channel.platform}</button>)}
    </nav>
    <div className={styles.desktopColumns} id={feedId}>
      {entries.map(channel => <section className={styles.channel} key={channel.id} aria-label={`${channel.platform} updates`}
        data-mobile-hidden={filter !== "all" && filter !== channel.id || undefined}>
        <header className={styles.channelHeading}>
          <span className={styles.channelName}><PlatformIcon name={channel.platform} />{channel.platform}</span>
          <span className={styles.channelCategory}>{channel.category}</span>
        </header>
        <div className={styles.channelPosts}>
          {channel.timeline && <OfficialPostEmbed embed={channel.timeline} platform={channel.platform} theme={theme} />}
          {!channel.timeline && !channel.posts.length && <div className={styles.emptyChannel}>
            <PlatformIcon name={channel.platform} /><p>{channel.emptyMessage || "New posts will appear here."}</p>
          </div>}
          {channel.posts.map((post, rank) => <div key={post.id} className={styles.postSlot}
            data-mobile-hidden={rank > 0 && !expanded && filter === "all" || undefined}>
            <PostCard item={{ channel, post, rank }} chart={chartPreview} onRead={setReading} theme={theme} />
          </div>)}
        </div>
        <div className={styles.channelFooter}><ChannelAction channel={channel} /></div>
      </section>)}
    </div>

      {filter === "all" && allPosts.some(item => item.rank > 0) && <button type="button" className={styles.moreButton}
        aria-expanded={expanded} aria-controls={feedId} onClick={() => setExpanded(value => !value)}>
        {expanded ? "Fewer updates" : "More updates"}<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" data-expanded={expanded || undefined}><path d="m4 6 4 4 4-4" /></svg>
      </button>}
      <div className={styles.mobileDestinations} aria-label="Platform profiles">
        {(selectedChannel ? [selectedChannel] : entries).map(channel => <div key={channel.id}><ChannelAction channel={channel} /></div>)}
      </div>
    <dialog className={styles.reader} ref={reader} data-update-reader aria-labelledby={readerTitleId}
      data-platform={reading?.channel.id}
      onClose={() => setReading(null)} onClick={event => { if (event.target === event.currentTarget) reader.current?.close(); }}>
      {reading && <>
        <div className={styles.readerBar}>
          <span><PlatformIcon name={reading.channel.platform} />{reading.channel.platform}{!reading.post.published && <small>Preview</small>}</span>
          <button type="button" className={actionStyles.interactive} onClick={() => reader.current?.close()}><ActionLabel icon="close">Close</ActionLabel></button>
        </div>
        <div className={styles.readerContent}>
          <p className={styles.cardCategory}>{reading.post.category}</p>
          <h2 id={readerTitleId}>{reading.post.title}</h2>
          <p>{reading.post.summary}</p>
          {reading.post.artwork && <div className={styles.readerArt}><PostArtwork kind={reading.post.artwork} chart={chartPreview} /></div>}
          {reading.post.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <div className={styles.readerAction}>
            {reading.post.href ? <a className={`${styles.channelAction} ${actionStyles.interactive}`} href={reading.post.href} target="_blank" rel="noopener noreferrer"><ActionLabel>View on TradingView</ActionLabel></a> : <ChannelAction channel={reading.channel} />}
          </div>
        </div>
      </>}
    </dialog>
  </div>;
}
