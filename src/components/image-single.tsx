"use client";

import { useRef } from "react";
import type { ImageShowcaseSlide } from "@/lib/image-showcase";
import { ActionLabel, actionStyles } from "./action-label";
import { ImageFrame } from "./image-frame";
import { ImageViewer } from "./image-viewer";
import type { ImageViewerHandle } from "./image-viewer";
import styles from "./image-single.module.css";

/** One chart, one independent viewer. No carousel state or navigation is involved. */
export function ImageSingle({ slide, tilt = "left" }: {
  slide: ImageShowcaseSlide;
  tilt?: "left" | "right";
}) {
  const frame = useRef<HTMLSpanElement>(null);
  const viewer = useRef<ImageViewerHandle>(null);
  return (
    <figure className={styles.single} data-tilt={tilt}>
      <button className={`${styles.preview} ${actionStyles.interactive}`} type="button"
        aria-label={`View full: ${slide.label}`} aria-haspopup="dialog" onClick={() => viewer.current?.open()}>
        <span className={styles.mount}><ImageFrame slide={slide} ref={frame} /></span>
        <span className={styles.action}><ActionLabel icon="expand">View full</ActionLabel></span>
      </button>
      <ImageViewer ref={viewer} slide={slide} getSource={() => frame.current} />
    </figure>
  );
}
