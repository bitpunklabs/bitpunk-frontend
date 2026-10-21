import Image from "next/image";
import { ActionLabel, actionStyles } from "./action-label";
import { PlatformIcon } from "./platform-icon";
import { researchChannels, type ResearchChannel } from "@/lib/research";
import styles from "./research-channels.module.css";

function Avatar() {
  return <Image className={styles.avatar} src="/brand/favicon-dark.png" alt=""
    width={72} height={72} unoptimized />;
}

function ChannelAction({ channel }: { channel: ResearchChannel }) {
  const className = `${styles.action} ${actionStyles.interactive}`;
  return channel.status === "live" && channel.href
    ? <a className={className} href={channel.href} target="_blank" rel="noopener noreferrer">
      <ActionLabel>{channel.action}</ActionLabel>
    </a>
    : <button className={styles.action} type="button" disabled aria-describedby={`${channel.id}-status`}>
      <ActionLabel>{channel.action}</ActionLabel>
    </button>;
}

function ProfileHeader({ channel }: { channel: ResearchChannel }) {
  const ready = channel.status === "live" && channel.href;
  return <div className={styles.profileHeader}>
    <span className={styles.platform}><PlatformIcon name={channel.platform} />{channel.platform}</span>
    {!ready && <span className={styles.status} id={`${channel.id}-status`}>Coming soon</span>}
  </div>;
}

function Topics({ channel }: { channel: ResearchChannel }) {
  return <ul className={styles.topics} aria-label={`${channel.platform} topics`}>
    {channel.topics.map(topic => <li key={topic}>{topic}</li>)}
  </ul>;
}

function XProfile({ channel }: { channel: ResearchChannel }) {
  return <>
    <div className={styles.cover} aria-hidden="true">
      <span className={styles.coverLabel}>Bitpunk / Market notes</span>
      <span className={styles.coverTitle}>A fresh<br /><em>perspective.</em></span>
      <span className={styles.coverStar}>✳</span>
    </div>
    <div className={styles.xBody}>
      <div className={styles.xIdentity}><Avatar /><ChannelAction channel={channel} /></div>
      <h3 className={styles.profileName}>{channel.name}</h3>
      {channel.handle && <p className={styles.handle}>@{channel.handle}</p>}
      <p className={styles.bio}>{channel.bio}</p>
      <Topics channel={channel} />
    </div>
  </>;
}

function SubstackProfile({ channel }: { channel: ResearchChannel }) {
  return <div className={styles.publication}>
    <Avatar />
    <h3 className={styles.publicationName}>{channel.name}</h3>
    <p className={styles.bio}>{channel.bio}</p>
    <ChannelAction channel={channel} />
    <Topics channel={channel} />
  </div>;
}

function GitHubProfile({ channel }: { channel: ResearchChannel }) {
  return <div className={styles.githubBody}>
    <div className={styles.githubIdentity}>
      <Avatar />
      <div>
        <h3 className={styles.profileName}>{channel.name}</h3>
        {channel.handle && <p className={styles.handle}>{channel.handle}</p>}
      </div>
    </div>
    <p className={styles.bio}>{channel.bio}</p>
    <div className={styles.projectArea}>
      <span className={styles.projectMark} aria-hidden="true">〈/〉</span>
      <div>
        <p className={styles.projectTitle}>Open-source projects</p>
        <p className={styles.projectCopy}>Tools, experiments and shared ideas.</p>
      </div>
    </div>
    <div className={styles.githubFooter}>
      <Topics channel={channel} />
      <ChannelAction channel={channel} />
    </div>
  </div>;
}

const profiles = { x: XProfile, substack: SubstackProfile, github: GitHubProfile };

export function ResearchChannels() {
  return <div className={styles.channels}>
    {researchChannels.map(channel => {
      const Profile = profiles[channel.id];
      return <section key={channel.id} id={channel.id} className={styles.section}
        aria-labelledby={`${channel.id}-title`}>
        <div className={styles.introduction}>
          <h2 id={`${channel.id}-title`}>{channel.platform}</h2>
          <p className={styles.summary}>{channel.description}</p>
          <p>{channel.detail}</p>
        </div>
        <div className={styles.profile} data-platform={channel.id} aria-label={`${channel.platform} profile preview`}>
          <ProfileHeader channel={channel} />
          <Profile channel={channel} />
        </div>
      </section>;
    })}
  </div>;
}
