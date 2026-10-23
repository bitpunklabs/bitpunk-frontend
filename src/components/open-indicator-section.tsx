import { openIndicatorCollection } from "@/lib/indicators";
import { getOpenSourceScreenshots } from "@/lib/scene-assets";
import type { ImageShowcaseVariant } from "@/lib/image-showcase";
import { ImageCarousel } from "./image-showcase";
import { PageAction } from "./marble-page";
import { ResearchDirections } from "./research-directions";
import styles from "./indicator-catalog.module.css";

/** The same open studies appear in the indicator catalogue and open-source room. */
export function OpenIndicatorSection({ variant = "stack", title = openIndicatorCollection.name, id = "open-indicators" }: {
  variant?: ImageShowcaseVariant; title?: string; id?: string;
}) {
  return <article id={id} className={styles.product} aria-labelledby={id + "-title"}>
    <div className={styles.withGallery}>
      <div className={styles.introduction}>
        <h2 className={styles.name} id={id + "-title"}>
          {title.split(" ").map(word => <span key={word}>{word}{" "}</span>)}
        </h2>
        <div className={styles.description}>
          <p>{openIndicatorCollection.description}</p><p>{openIndicatorCollection.researchPurpose}</p>
        </div>
        <div className={styles.resources}>
          <PageAction href={openIndicatorCollection.tradingViewUrl} external quiet>Explore Open-source on TradingView</PageAction>
        </div>
      </div>
      <ImageCarousel slides={getOpenSourceScreenshots()} variant={variant} label="Open-source script demos"
        selectionLabel="Choose a study" showSelectorIcons={false} />
    </div>
    <ResearchDirections label="Open-source research directions" topics={openIndicatorCollection.topics} />
  </article>;
}
