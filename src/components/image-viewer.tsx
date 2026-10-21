"use client";

import Image from "next/image";
import { useEffect, useId, useImperativeHandle, useRef } from "react";
import type { CSSProperties, KeyboardEvent, Ref } from "react";
import type { ImageShowcaseSlide } from "@/lib/image-showcase";
import { ActionLabel, actionStyles } from "./action-label";
import { ImageFrameHeader } from "./image-frame";
import styles from "./image-showcase.module.css";

export type ImageViewerHandle = { open: () => void };

/** Single images omit navigation; a carousel supplies its own previous/next actions. */
export function ImageViewer({ ref, slide, getSource, onPrevious, onNext, onOpenChange }: {
  ref: Ref<ImageViewerHandle>;
  slide: ImageShowcaseSlide;
  getSource: () => HTMLElement | null;
  onPrevious?: () => void;
  onNext?: () => void;
  onOpenChange?: (open: boolean) => void;
}) {
  const imageId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const animation = useRef<Animation | null>(null);
  const closing = useRef(false);
  const hasNavigation = !!onPrevious && !!onNext;
  const motionReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function thumbnailTransform(node: HTMLDialogElement) {
    const source = getSource()?.getBoundingClientRect();
    if (!source || !source.width || !source.height) return null;
    const target = node.getBoundingClientRect();
    const x = source.left + source.width / 2 - target.left - target.width / 2;
    const y = source.top + source.height / 2 - target.top - target.height / 2;
    return `translate(${x}px, ${y}px) scale(${source.width / target.width}, ${source.height / target.height})`;
  }

  useImperativeHandle(ref, () => ({
    open() {
      const node = dialog.current;
      if (!node || node.open) return;
      closing.current = false;
      node.removeAttribute("data-closing");
      node.showModal();
      onOpenChange?.(true);
      const from = thumbnailTransform(node);
      if (!from || motionReduced()) return;
      animation.current?.cancel();
      animation.current = node.animate([{ transform: from }, { transform: "none" }],
        { duration: 460, easing: "cubic-bezier(.2,.8,.2,1)" });
    },
  }));

  useEffect(() => () => animation.current?.cancel(), []);

  function close() {
    const node = dialog.current;
    if (!node?.open || closing.current) return;
    const currentTransform = getComputedStyle(node).transform;
    animation.current?.cancel();
    const to = thumbnailTransform(node);
    if (!to || motionReduced()) { node.close(); return; }
    closing.current = true;
    node.setAttribute("data-closing", "");
    const exit = node.animate([{ transform: currentTransform, opacity: 1 }, { transform: to, opacity: 0 }],
      { duration: 240, easing: "cubic-bezier(.4,0,.8,.2)", fill: "forwards" });
    animation.current = exit;
    void exit.finished.then(() => {
      if (animation.current !== exit) return;
      node.close();
      exit.cancel();
    }, () => { /* Unmounting cancels the transition. */ });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (!hasNavigation || closing.current || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      if (event.key === "ArrowLeft") onPrevious?.();
      else onNext?.();
    }
  }

  return (
    <dialog className={styles.dialog} ref={dialog} aria-label={slide.alt}
      data-single={!hasNavigation || undefined} data-portrait={slide.height > slide.width || undefined}
      style={{ "--image-ratio": slide.width / slide.height } as CSSProperties}
      aria-keyshortcuts={hasNavigation ? "ArrowLeft ArrowRight" : undefined}
      onKeyDown={onKeyDown} onCancel={event => { event.preventDefault(); close(); }}
      onClose={() => { closing.current = false; onOpenChange?.(false); }}>
      <ImageFrameHeader slide={slide}>
        <button className={`${styles.dialogClose} ${actionStyles.interactive}`} type="button" onClick={close}>
          <ActionLabel icon="close">Close</ActionLabel>
        </button>
      </ImageFrameHeader>
      <div className={styles.dialogViewer}>
        {hasNavigation && <button className={`${styles.arrow} ${styles.dialogArrow}`} type="button"
          aria-label="Previous image" aria-controls={imageId} onClick={onPrevious}>
          <svg width="20" height="24" viewBox="0 0 20 24" aria-hidden="true"><path d="M15.5 3.5 4.5 12l11 8.5Z" /></svg>
        </button>}
        <div className={styles.dialogImage} id={imageId}>
          <Image src={slide.src} alt={slide.alt} width={slide.width} height={slide.height} unoptimized />
        </div>
        {hasNavigation && <button className={`${styles.arrow} ${styles.dialogArrow}`} type="button"
          aria-label="Next image" aria-controls={imageId} onClick={onNext}>
          <svg width="20" height="24" viewBox="0 0 20 24" aria-hidden="true"><path d="M4.5 3.5 15.5 12l-11 8.5Z" /></svg>
        </button>}
      </div>
    </dialog>
  );
}
