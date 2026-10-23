import { PageAction } from "./marble-page";
import styles from "./indicator-catalog.module.css";

export function ResearchDirections({ label, topics }: {
  label: string;
  topics: readonly { title: string; copy: string; href?: string; action?: string }[];
}) {
  return <div className={styles.topics} role="group" aria-label={label}>
    {topics.map(topic => <section className={styles.topic} key={topic.title}>
      <h3>{topic.title}</h3><p>{topic.copy}</p>
      {topic.href && <PageAction href={topic.href} external quiet>{topic.action ?? "Explore"}</PageAction>}
    </section>)}
  </div>;
}
