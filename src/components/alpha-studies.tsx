import type { ImageShowcaseSlide } from "@/lib/image-showcase";
import { ImageSingle } from "./image-single";
import styles from "./indicator-catalog.module.css";

export function AlphaStudies({ slides, topics }: {
  slides: ImageShowcaseSlide[];
  topics: { id: string; title: string; copy: string }[];
}) {
  return (
    <div id="alpha-studies" className={styles.topics} role="group" aria-label="Alpha reading dimensions">
      {topics.map((topic, index) => {
        const slide = slides.find(slide => slide.id === topic.id);
        if (!slide) throw new Error(`Alpha study is missing: ${topic.id}`);
        return (
          <section className={styles.topic} key={topic.id}>
            <h3>{topic.title}</h3>
            <p>{topic.copy}</p>
            <ImageSingle slide={slide} tilt={index === 1 ? "right" : "left"} />
          </section>
        );
      })}
    </div>
  );
}
