import Image from "next/image";
import type { ReactNode } from "react";
import { PlatformProfile } from "./platform-profile";
import { researchChannels, type ResearchChannel, type ResearchPost } from "@/lib/research";
import { getAlphaScreenshots, getChannelArtwork, type ChannelArtwork } from "@/lib/scene-assets";
import { getHomeUpdates } from "@/lib/home-updates.server";
import { destinations } from "@/lib/showcase";
import { xProfileEmbed } from "@/lib/post-embeds";
import { OfficialPostEmbed } from "./official-post-embed";
import styles from "./research-channels.module.css";

function ChannelLink({ href, children, className, label }: {
  href: string | null; children: ReactNode; className?: string; label?: string;
}) {
  return href
    ? <a href={href} className={className} aria-label={label} target="_blank" rel="noopener noreferrer">{children}</a>
    : <a className={className} role="link" aria-disabled="true" aria-label={label} title="Substack is coming soon">{children}</a>;
}

function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M6 18 18 6M6 6h12v12" />
  </svg>;
}

function PostIcons() {
  return <div className={styles.postIcons} aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d="M20 11a8 8 0 0 1-8 8H5l-3 3v-7a8 8 0 1 1 18-4Z" /></svg>
    <svg viewBox="0 0 24 24"><path d="m3 7 4-4 4 4M7 3v13h5m9 1-4 4-4-4m4 4V8h-5" /></svg>
    <svg viewBox="0 0 24 24"><path d="M20 5c-3-3-6-1-8 1-2-2-5-4-8-1-4 4 1 9 8 14 7-5 12-10 8-14Z" /></svg>
    <svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4Z" /></svg>
    <svg viewBox="0 0 24 24"><path d="m8 7 4-4 4 4M12 3v12M4 13v7h16v-7" /></svg>
  </div>;
}

function PostStatus({ post }: { post: ResearchPost }) {
  return <span className={styles.postStatus}>{post.published ? post.date : "Preview"}</span>;
}

function XProfile({ channel, artwork }: { channel: ResearchChannel; artwork: ChannelArtwork }) {
  const chart = getAlphaScreenshots()[0];
  const avatar = artwork.avatar;
  const profile = channel.href?.replace(/\/$/, "") ?? null;
  const timeline = xProfileEmbed(profile ?? undefined);
  return <PlatformProfile platform="X" profile={channel} href={channel.href} action={channel.action} artwork={artwork}>
    {!channel.posts.length && timeline && <div className={styles.timeline}><OfficialPostEmbed embed={timeline} platform="X" theme="dark" compact /></div>}
    {!!channel.posts.length && <div className={styles.selectionHeading}><span>Selected posts</span><small>Curated</small></div>}
    {channel.posts.map(post => <article className={styles.xPost} key={post.id}>
      <ChannelLink href={profile} className={styles.postAvatar} label="Visit BITPUNK on X">
        <Image {...avatar} alt="" unoptimized />
      </ChannelLink>
      <div className={styles.postContent}>
        <div className={styles.postByline}>
          <ChannelLink href={profile}><strong>{channel.name}</strong><span>@{channel.handle}</span></ChannelLink>
          <PostStatus post={post} />
        </div>
        <ChannelLink href={post.published && post.href ? post.href : profile} className={styles.postLink}>
          <p className={styles.postTitle}>{post.title}</p><p>{post.copy}</p>
          {post.image ? <Image {...post.image} alt={post.image.alt ?? ""} unoptimized className={styles.postChart} />
            : post.artwork === "chart" && <Image src={chart.src} width={chart.width} height={chart.height}
              alt="An example bitpunk.alpha chart" unoptimized className={styles.postChart} />}
        </ChannelLink>
        <PostIcons />
      </div>
    </article>)}
  </PlatformProfile>;
}

function SubstackProfile({ channel, artwork }: { channel: ResearchChannel; artwork: ChannelArtwork }) {
  return <PlatformProfile platform="Substack" profile={channel} href={channel.href} publicationUrl={destinations.substackPublication}
    action={channel.action} artwork={artwork} emptyMessage={!channel.posts.length ? "New essays will appear here." : undefined}>
    <div className={styles.articleList}>
      {!!channel.posts.length && <div className={styles.selectionHeading}><span>Latest essays</span></div>}
      {channel.posts.map((post, index) => {
        return <article key={post.id} className={index === 0 ? styles.featureArticle : styles.listArticle}>
          <ChannelLink href={post.published && post.href ? post.href : channel.href} className={styles.articleLink}>
            {post.image && <Image {...post.image} alt={post.image.alt ?? ""} unoptimized className={styles.articleImage} />}
            <div>
              <PostStatus post={post} />
              <h4>{post.title}</h4><p>{post.copy}</p>
              <span className={styles.articleAuthor}>{channel.name}</span>
            </div>
          </ChannelLink>
        </article>;
      })}
    </div>
  </PlatformProfile>;
}

export async function ResearchChannels() {
  const artwork = getChannelArtwork();
  const updates = await getHomeUpdates();
  const essays = updates.find(channel => channel.id === "substack")?.posts.filter(post => !post.embed) ?? [];
  const channels = researchChannels.map(channel => channel.id === "substack" ? {
    ...channel,
    posts: essays.map(post => ({
      id: post.id, title: post.title, copy: post.summary, published: true, href: post.href,
      date: post.publishedAt ? new Intl.DateTimeFormat("en", {month:"short",day:"numeric",year:"numeric",timeZone:"UTC"}).format(new Date(post.publishedAt)) : undefined,
      image: post.imageUrl ? {src:post.imageUrl,width:1200,height:675} : undefined,
    })),
  } : channel);
  return <div className={styles.channels}>
    {channels.map(channel => <section key={channel.id} id={channel.id} className={styles.section}
      aria-labelledby={channel.id + "-title"}>
      <div className={styles.introduction}>
        <h2 id={channel.id + "-title"}><ChannelLink href={channel.href} className={styles.titleLink}>
          {channel.platform}<Arrow />
        </ChannelLink></h2>
        <p className={styles.summary}>{channel.description}</p><p>{channel.detail}</p>
      </div>
      {channel.id === "x" ? <XProfile channel={channel} artwork={artwork} /> : <SubstackProfile channel={channel} artwork={artwork} />}
    </section>)}
  </div>;
}
