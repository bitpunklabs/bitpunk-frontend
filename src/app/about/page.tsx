import type { Metadata } from "next";
import { MarblePage, MarbleHero, MarbleContent, PageAction, Availability, marbleStyles as s } from "@/components/marble-page";
import { aboutContent } from "@/lib/about";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: "Bitpunk. Independent market research, indicators and open-source tools.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <MarblePage>
      <MarbleHero scene="about" section="About" eyebrow="Bitpunk / The independent spirit"
        title={<>A mind<br /><em>of our own.</em></>}
        copy={aboutContent.introduction}>
        <PageAction href="#principles">Our approach</PageAction>
      </MarbleHero>
      <MarbleContent>
        <section className={`${s.chapter} ${styles.approach}`} id="principles" aria-labelledby="principles-title">
          <div>
            <p className={s.kicker}>What guides us</p>
            <h2 id="principles-title" className={styles.statement}>Rigor in the work.<br /><em>Rebellion in the spirit.</em></h2>
            {aboutContent.origin && <p className={styles.origin}>{aboutContent.origin}</p>}
          </div>
          <div className={s.detailList}>
            {aboutContent.principles.map(principle => (
              <article key={principle.title}><h3>{principle.title}</h3><p>{principle.copy}</p></article>
            ))}
          </div>
        </section>
        <section className={`${s.chapter} ${styles.people}`} aria-labelledby="people-title">
          <div><p className={s.kicker}>The people</p><h2 id="people-title">Behind Bitpunk.</h2></div>
          {aboutContent.people.length > 0
            ? <div className={styles.members}>{aboutContent.people.map(person => (
              <article key={person.name}>
                <h3>{person.name}</h3><p className={s.kicker}>{person.role}</p><p>{person.bio}</p>
                {person.profileUrl && <PageAction href={person.profileUrl} external quiet>Profile</PageAction>}
              </article>
            ))}</div>
            : <Availability>Introductions coming soon</Availability>}
        </section>
        {aboutContent.contact && <section className={styles.contact} aria-label="Contact Bitpunk">
          <p className={s.kicker}>Start a conversation</p>
          <PageAction href={aboutContent.contact.href} external quiet>{aboutContent.contact.label}</PageAction>
        </section>}
      </MarbleContent>
    </MarblePage>
  );
}
