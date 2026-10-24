"use client";

import { useRef } from "react";
import type { ImageShowcaseSlide } from "@/lib/image-showcase";
import { ImageFrame } from "./image-frame";
import { ImageViewer } from "./image-viewer";
import type { ImageViewerHandle } from "./image-viewer";
import styles from "./image-single.module.css";
import feedback from "./image-feedback.module.css";

/** One chart, one independent viewer. No carousel state or navigation is involved. */
export function ImageSingle({ slide, tilt = "left" }: {
  slide: ImageShowcaseSlide;
  tilt?: "left" | "right";
}) {
  const image = useRef<HTMLImageElement>(null);
  const viewer = useRef<ImageViewerHandle>(null);
  return (
    <figure className={styles.single} data-tilt={tilt}>
      <button className={`${styles.preview} ${feedback.trigger}`} type="button"
        aria-label={`Enlarge ${slide.label}`} aria-haspopup="dialog" onClick={() => viewer.current?.open()}>
        <span className={styles.mount}><ImageFrame slide={slide} imageRef={image} /></span>
      </button>
      <ImageViewer ref={viewer} slide={slide} getSource={() => image.current} />
    </figure>
  );
}
