import Image from "next/image";
import type { ReactNode } from "react";
import type { ChannelArtwork } from "@/lib/scene-assets";
import { ActionLabel, actionStyles } from "./action-label";
import { PlatformIcon } from "./platform-icon";
import styles from "./platform-profile.module.css";

type PlatformProfileProps = {
  platform: "X" | "Substack";
  profile: { name: string; handle?: string; bio: string };
  href: string | null;
  publicationUrl?: string;
  action: string;
  artwork: ChannelArtwork;
  compact?: boolean;
  theme?: "light" | "dark";
  emptyMessage?: string;
  children?: ReactNode;
};

function ProfileLink({ href, children, className, label }: {
  href: string | null; children: ReactNode; className?: string; label?: string;
}) {
  return href
    ? <a href={href} className={className} aria-label={label} target="_blank" rel="noopener noreferrer">{children}</a>
    : <span className={className}>{children}</span>;
}

/** Shared native profile window: Research uses the full layout; Home uses compact spacing. */
export function PlatformProfile({ platform, profile, href, publicationUrl, action, artwork,
  compact = false, theme = "dark", emptyMessage, children }: PlatformProfileProps) {
  const x = platform === "X";
  const url = href?.replace(/\/$/, "") ?? null;
  const label = `Visit ${profile.name} on ${platform}`;
  const follow = href
    ? <a className={`${styles.action} ${actionStyles.interactive}`} href={href} target="_blank" rel="noopener noreferrer" aria-label={action}>
      <ActionLabel>{compact ? "Follow" : action}</ActionLabel>
    </a>
    : <button className={styles.action} type="button" disabled><ActionLabel>{compact ? "Follow" : action}</ActionLabel></button>;

  return <div className={`${styles.profile} ${x ? styles.x : styles.substack}`} aria-label={`${profile.name} on ${platform}`}
    data-platform-profile={x ? "x" : "substack"} data-size={compact ? "compact" : "full"} data-theme={theme}>
    <div className={styles.nativeBar}>
      {x ? <>
        {!compact && <ProfileLink href={url} className={styles.nativeBack} label={label}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" /></svg>
        </ProfileLink>}
        <ProfileLink href={url} className={styles.nativeIdentity}>
          <strong>{profile.name}</strong><small>Market notes &amp; ideas</small>
        </ProfileLink>
        <ProfileLink href={url} className={styles.platformMark} label="Open X"><PlatformIcon name="X" /></ProfileLink>
      </> : <>
        <ProfileLink href={href} className={styles.platformMark} label="Open Bitpunk on Substack"><PlatformIcon name="Substack" /></ProfileLink>
        <ProfileLink href={href} className={styles.nativeWordmark} label={label}>
          <Image {...artwork.substack.wordmark} alt="BITPUNK" unoptimized />
        </ProfileLink>
        {follow}
      </>}
    </div>
    {x ? <>
      <ProfileLink href={url} className={styles.coverLink} label={label}>
        <Image {...artwork.x.header} alt="BITPUNK — Where market ideas take shape." unoptimized className={styles.cover} />
      </ProfileLink>
      <div className={styles.xBody}>
        <div className={styles.xIdentity}>
          <ProfileLink href={url} className={styles.avatarLink} label={label}>
            <Image {...artwork.avatar} alt={profile.name} unoptimized className={styles.avatar} />
          </ProfileLink>
          {follow}
        </div>
        <h3 className={styles.profileName}><ProfileLink href={url}>{profile.name}</ProfileLink></h3>
        <ProfileLink href={url} className={styles.handle}>@{profile.handle}</ProfileLink>
        <p className={styles.bio}>{profile.bio}</p>
        <a href="https://bitpunk.io" target="_blank" rel="noopener noreferrer" className={styles.profileUrl}>bitpunk.io</a>
      </div>
    </> : <div className={styles.publication}>
      <div className={styles.substackIdentity}>
        <div><h3 className={styles.profileName}><ProfileLink href={href}>{profile.name}</ProfileLink></h3>
          <ProfileLink href={href} className={styles.handle}>@{profile.handle}</ProfileLink>
        </div>
        <ProfileLink href={href} label={label}><Image {...artwork.avatar} alt={profile.name} unoptimized /></ProfileLink>
      </div>
      <p className={styles.publicationBio}>{profile.bio}</p>
    </div>}
    <nav className={styles.tabs} aria-label={`Visit ${platform} profile sections`}>
      <ProfileLink href={href} className={styles.selectedTab}>{x ? "Posts" : "Activity"}</ProfileLink>
      <ProfileLink href={x ? (url ? url + "/media" : null) : (publicationUrl ? new URL("/profile/posts", publicationUrl).href : href)}>{x ? "Media" : "Posts"}</ProfileLink>
    </nav>
    {emptyMessage && <div className={styles.emptyProfile}><PlatformIcon name={platform} /><p>{emptyMessage}</p></div>}
    {children}
    {!compact && <div className={x ? styles.profileFooter : styles.publicationFooter}>
      {x && <span>See the next idea as it develops.</span>}{follow}
    </div>}
  </div>;
}
