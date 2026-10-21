import Image from "next/image";
import type { ReactNode, Ref } from "react";
import type { ImageShowcaseSlide } from "@/lib/image-showcase";
import styles from "./image-frame.module.css";

/** The same market identity and script metadata surround every chart. */
export function ImageFrameHeader({ slide, children }: {
  slide: ImageShowcaseSlide;
  children?: ReactNode;
}) {
  return (
    <span className={styles.bar}>
      <span className={styles.identity}>
        {slide.iconSrc && <Image src={slide.iconSrc} alt="" width={24} height={24} unoptimized draggable={false} />}
        <span className={styles.ticker}>{slide.title ?? slide.label}</span>
        {slide.subtitle && <span className={styles.name}>{slide.subtitle}</span>}
      </span>
      <span className={styles.metadata}>
        {slide.meta && <span>{slide.meta}</span>}
        {slide.badge && <i>{slide.badge}</i>}
      </span>
      {children}
    </span>
  );
}

export function ImageFrame({ slide, ref, imageRef, eager = false }: {
  slide: ImageShowcaseSlide;
  ref?: Ref<HTMLSpanElement>;
  imageRef?: Ref<HTMLImageElement>;
  eager?: boolean;
}) {
  return (
    <span className={styles.frame} ref={ref}>
      <ImageFrameHeader slide={slide} />
      <Image className={styles.image} src={slide.src} ref={imageRef} alt={slide.alt}
        width={slide.width} height={slide.height} unoptimized
        loading={eager ? "eager" : "lazy"} draggable={false} />
    </span>
  );
}
