import Link from "next/link";
import { alphaShowcaseDirections, type AlphaShowcaseVariant } from "@/lib/alpha-showcase";
import styles from "./alpha-showcase-review.module.css";

/** Only rendered by development pages with an explicit showcase query. */
export function AlphaShowcaseReview({ variant, basePath = "/indicators" }: {
  variant: AlphaShowcaseVariant;
  basePath?: string;
}) {
  const current = alphaShowcaseDirections.find(item => item.id === variant)!;
  return (
    <aside className={styles.review} aria-label="Alpha design review">
      <p className={styles.label}>Alpha / Window studies</p>
      <nav aria-label="Showcase directions" className={styles.directions}>
        {alphaShowcaseDirections.map(item => (
          <Link key={item.id} href={`${basePath}?showcase=${item.id}#alpha`}
            aria-current={item.id === variant ? "page" : undefined}>{item.label}</Link>
        ))}
      </nav>
      <p className={styles.description}>{current.description}</p>
    </aside>
  );
}
