import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./marble-page.module.css";

export { default as marbleStyles } from "./marble-page.module.css";
type Scene = "indicators" | "research" | "opensource" | "about";

export function MarblePage({ children }: { children: React.ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}

export function MarbleHero({ scene, section, eyebrow, title, copy, parent, children }: {
  scene: Scene;
  section: string;
  eyebrow: string;
  title: React.ReactNode;
  copy: string;
  parent?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <section className={styles.hero} data-scene={scene} aria-label={`${section} introduction`}
      style={{ "--hero-scene": `url("/art/marble-pages/${scene}.webp")` } as CSSProperties}>
      <div className={styles.heroArtwork} aria-hidden="true">
        <div className={styles.heroImage}>
          <Image src={`/art/marble-pages/${scene}.webp`} alt="" fill sizes="100vw"
            unoptimized loading="eager" fetchPriority="high" />
        </div>
      </div>
      <div className={styles.heroInner}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {parent && <><span aria-hidden="true">/</span><Link href={parent.href}>{parent.label}</Link></>}
          <span aria-hidden="true">/</span>
          <span aria-current="page">{section}</span>
        </nav>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>{eyebrow}</p>
          <h1>{title}</h1>
          <p className={styles.lead}>{copy}</p>
          {children && <div className={styles.actions}>{children}</div>}
        </div>
      </div>
    </section>
  );
}

export function MarbleContent({ children }: { children: React.ReactNode }) {
  return <div className={styles.content}>{children}</div>;
}

export function PageAction({ href, external = false, quiet = false, children }: {
  href: string; external?: boolean; quiet?: boolean; children: React.ReactNode;
}) {
  const className = quiet ? styles.textLink : styles.action;
  return external
    ? <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}</a>
    : <Link className={className} href={href}>{children}</Link>;
}

export function Availability({ children = "Coming soon" }: { children?: React.ReactNode }) {
  return <span className={styles.availability}>{children}</span>;
}

export function CollectionLink({ href, label, title, copy, action }: {
  href: string; label: string; title: string; copy: string; action: string;
}) {
  return (
    <Link className={styles.collectionLink} href={href}>
      <span className={styles.kicker}>{label}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
      <span className={styles.linkCaption}>{action}</span>
    </Link>
  );
}

export function RelatedRoom({ label, title, href, action }: {
  label: string; title: React.ReactNode; href: string; action: string;
}) {
  return (
    <aside className={styles.related}>
      <div><p className={styles.kicker}>{label}</p><h2>{title}</h2></div>
      <PageAction href={href}>{action}</PageAction>
    </aside>
  );
}
