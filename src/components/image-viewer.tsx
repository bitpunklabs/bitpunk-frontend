"use client";

import Image from "next/image";
import { useEffect, useImperativeHandle, useRef } from "react";
import type { CSSProperties, Ref } from "react";
import type { ImageShowcaseSlide } from "@/lib/image-showcase";
import styles from "./image-showcase.module.css";

export type ImageViewerHandle = { open: () => void };

/** One image, sized to fit the viewport. Click or tap again to return to its source. */
export function ImageViewer({ ref, slide, getSource, onOpenChange }: {
  ref: Ref<ImageViewerHandle>;
  slide: ImageShowcaseSlide;
  getSource: () => HTMLElement | null;
  onOpenChange?: (open: boolean) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const animation = useRef<Animation | null>(null);
  const closing = useRef(false);
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

  return (
    <dialog className={styles.dialog} ref={dialog} aria-label={slide.alt} data-image-viewer
      style={{ "--image-ratio": slide.width / slide.height } as CSSProperties}
      onCancel={event => { event.preventDefault(); close(); }}
      onClick={event => { if (event.target === event.currentTarget) close(); }}
      onClose={() => { closing.current = false; onOpenChange?.(false); }}>
      <button className={styles.zoomSurface} type="button" onClick={close}
        aria-label={`Close enlarged image: ${slide.label}`}>
        <Image src={slide.src} alt={slide.alt} width={slide.width} height={slide.height} unoptimized draggable={false} />
      </button>
    </dialog>
  );
}
