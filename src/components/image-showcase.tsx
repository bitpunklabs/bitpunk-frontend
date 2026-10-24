"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, RefObject } from "react";
import type { ImageShowcaseSlide, ImageShowcaseVariant } from "@/lib/image-showcase";
import { ImageViewer } from "./image-viewer";
import type { ImageViewerHandle } from "./image-viewer";
import { ImageFrame } from "./image-frame";
import styles from "./image-showcase.module.css";
import feedback from "./image-feedback.module.css";

const modulo = (value: number, count: number) => ((value % count) + count) % count;

/** A circular pose keeps the last-to-first transition identical to every other step. */
function windowPose(index: number, position: number, count: number, variant: ImageShowcaseVariant) {
  const angle = (index - position) * Math.PI * 2 / count;
  const sine = Math.sin(angle), cosine = Math.cos(angle);
  const focus = (cosine + 1) / 2;
  const poses = {
    stack: { x: sine * 7, y: -(1 - cosine) * 7, z: -(1 - cosine) * 12,
      rx: 5 + sine * 5, ry: -7 + sine * 9, rz: -1.5 + sine * 3 },
    fan: { x: sine * 27, y: -(1 - cosine) * 3.5, z: -(1 - cosine) * 15,
      rx: 4 + sine * 2, ry: -sine * 15 - 3, rz: sine * 9 - 1 },
    orbit: { x: sine * 3, y: sine * 31, z: -(1 - cosine) * 17,
      rx: -sine * 18 + 2, ry: -4 + sine * 3, rz: -sine * 2 },
  };
  const p = poses[variant];
  // CSSOM normalises long floating-point values; round before SSR/hydration too.
  const fixed = (value: number) => Number(value.toFixed(3));
  return {
    transform: `translate(-50%, -50%) translate3d(${fixed(p.x)}%, ${fixed(p.y)}%, ${fixed(p.z)}cqw) rotateX(${fixed(p.rx)}deg) rotateY(${fixed(p.ry)}deg) rotateZ(${fixed(p.rz)}deg)`,
    opacity: fixed(.68 + .32 * focus),
    zIndex: Math.round(focus * 100),
  };
}

/** The progress animation is the playback clock, so the fill and advance cannot drift. */
function useAutoAdvance(root: RefObject<HTMLDivElement | null>, progress: RefObject<HTMLSpanElement | null>, advance: () => void,
  interval: number, enabled: boolean) {
  useEffect(() => {
    const node = root.current;
    const bar = progress.current;
    if (!node || !bar || !enabled || !Number.isFinite(interval) || interval <= 0) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let hovered = window.matchMedia("(hover: hover)").matches && node.matches(":hover");
    let keyboardFocus = !!document.activeElement && node.contains(document.activeElement) &&
      document.activeElement.matches(":focus-visible");
    let inView = false;
    let playback: Animation | undefined;
    const clear = () => { playback?.cancel(); playback = undefined; };
    const canAdvance = () => inView && !document.hidden && !motion.matches && !hovered && !keyboardFocus;
    const restart = () => {
      clear();
      if (!canAdvance()) return;
      const animation = bar.animate([{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
        { duration: interval, easing: "linear", fill: "forwards" });
      playback = animation;
      void animation.finished.then(() => {
        if (playback === animation && canAdvance()) { advance(); restart(); }
      }, () => { /* Pausing or unmounting cancels the current reading interval. */ });
    };
    const events: [string, EventListener][] = [
      ["pointerenter", event => {
        if ("pointerType" in event && event.pointerType === "mouse") { hovered = true; restart(); }
      }],
      ["pointerleave", () => { hovered = false; restart(); }],
      ["click", restart],
      ["focusin", event => {
        keyboardFocus = event.target instanceof Element && event.target.matches(":focus-visible");
        restart();
      }],
      ["focusout", event => {
        if (!node.contains((event as FocusEvent).relatedTarget as Node | null)) keyboardFocus = false;
        restart();
      }],
      ["keydown", () => { keyboardFocus = true; restart(); }],
    ];
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= .2;
      restart();
    }, { threshold: .2 });
    observer.observe(node);
    events.forEach(([name, handler]) => node.addEventListener(name, handler));
    document.addEventListener("visibilitychange", restart);
    motion.addEventListener("change", restart);
    return () => {
      clear();
      observer.disconnect();
      events.forEach(([name, handler]) => node.removeEventListener(name, handler));
      document.removeEventListener("visibilitychange", restart);
      motion.removeEventListener("change", restart);
    };
  }, [root, progress, advance, interval, enabled]);
}

export type ImageCarouselProps = {
  slides: readonly ImageShowcaseSlide[];
  label: string;
  variant?: ImageShowcaseVariant;
  selectionLabel?: string;
  /** Show market icons beside the slide-selection labels. */
  showSelectorIcons?: boolean;
  /** Milliseconds between automatic advances; use 0 to disable. */
  autoPlayInterval?: number;
};

export function ImageCarousel(props: ImageCarouselProps) {
  if (!props.slides.length) return null;
  // Reset selection and image readiness when a caller replaces the collection.
  const collection = props.slides.map(slide => `${slide.id}:${slide.src}`).join("|");
  return <ImageShowcaseGallery key={collection} {...props} />;
}

function ImageShowcaseGallery({ slides, label, variant = "stack",
  selectionLabel = "Choose an image", showSelectorIcons = true, autoPlayInterval = 6000 }: ImageCarouselProps) {
  const galleryId = useId();
  const root = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const [selected, setSelected] = useState(0);
  const [imagesReady, setImagesReady] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const windows = useRef<(HTMLElement | null)[]>([]);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const position = useRef(0);
  const target = useRef(0);
  const frame = useRef<number | null>(null);
  const reducedMotion = useRef(false);
  const viewer = useRef<ImageViewerHandle>(null);
  const current = slides[selected];
  // Accommodate portrait or mixed collections as well as landscape screenshots.
  const narrowestRatio = Math.min(...slides.map(slide => slide.width / slide.height));
  const stageRatio = Number(Math.min(variant === "stack" ? 1.45 : 1.35,
    narrowestRatio * (variant === "orbit" ? .88 : .96)).toFixed(3));

  const paint = useCallback((value: number) => {
    position.current = value;
    windows.current.forEach((node, index) => {
      if (!node) return;
      const pose = windowPose(index, value, slides.length, variant);
      node.style.transform = pose.transform;
      node.style.opacity = String(pose.opacity);
      node.style.zIndex = String(pose.zIndex);
    });
  }, [slides.length, variant]);

  const stopFrame = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }, []);

  const settle = useCallback((next: number) => {
    stopFrame();
    target.current = next;
    setSelected(modulo(next, slides.length));
    const from = position.current;
    if (reducedMotion.current) {
      target.current = modulo(next, slides.length);
      paint(target.current);
      return;
    }
    const started = performance.now();
    const duration = Math.min(760, 430 + Math.abs(next - from) * 140);
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      paint(from + (next - from) * (1 - Math.pow(1 - progress, 4)));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
      else {
        frame.current = null;
        target.current = modulo(next, slides.length);
        paint(target.current);
      }
    };
    frame.current = requestAnimationFrame(tick);
  }, [paint, slides.length, stopFrame]);

  const advance = useCallback(() => settle(target.current + 1), [settle]);
  useAutoAdvance(root, progress, advance, autoPlayInterval, imagesReady && slides.length > 1 && !dialogOpen);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      reducedMotion.current = preference.matches;
      if (preference.matches) {
        stopFrame();
        paint(target.current);
      }
    };
    update();
    paint(position.current);
    preference.addEventListener("change", update);
    return () => { preference.removeEventListener("change", update); stopFrame(); };
  }, [paint, stopFrame]);

  useEffect(() => {
    let mounted = true;
    // Decode the rear images before revealing their windows; asynchronous image
    // painting can otherwise briefly leave empty frames in a transformed stack.
    Promise.allSettled(images.current.map(image => image?.decode())).then(() => {
      if (mounted) setImagesReady(true);
    });
    return () => { mounted = false; };
  }, [slides]);

  function choose(index: number) {
    const active = modulo(target.current, slides.length);
    let distance = modulo(index - active, slides.length);
    if (distance > slides.length / 2) distance -= slides.length;
    settle(target.current + distance);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (slides.length < 2 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "ArrowRight") {
      event.preventDefault(); settle(target.current + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault(); settle(target.current - 1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault(); choose(event.key === "Home" ? 0 : slides.length - 1);
    }
  }

  return (
    <div ref={root} className={styles.showcase} data-variant={variant} data-active={current.id} data-single={slides.length === 1 || undefined}>
      <div className={styles.viewport}>
        <div id={galleryId} className={styles.stage} style={{ aspectRatio: stageRatio }} role="group" aria-roledescription="carousel"
          aria-label={label}
          aria-keyshortcuts="ArrowLeft ArrowRight Home End"
          aria-busy={!imagesReady}
          onKeyDown={onKeyDown}>
          {slides.map((slide, index) => (
            <figure key={slide.id} className={styles.window} aria-hidden={index !== selected}
              ref={node => { windows.current[index] = node; }}
              style={windowPose(index, 0, slides.length, variant)}>
              <button className={`${styles.imageTrigger} ${feedback.trigger}`} type="button" disabled={index !== selected}
                tabIndex={index === selected ? 0 : -1} aria-label={`Enlarge ${slide.label}`} aria-haspopup="dialog"
                onClick={() => viewer.current?.open()}>
                <ImageFrame slide={slide} imageRef={node => { images.current[index] = node; }} eager />
              </button>
            </figure>
          ))}
        </div>
      </div>
      {slides.length > 1 && <>
        <button className={`${styles.arrow} ${styles.previous}`} type="button"
          aria-label="Previous image" aria-controls={galleryId} onClick={() => settle(target.current - 1)}>
          <svg width="20" height="24" viewBox="0 0 20 24" aria-hidden="true"><path d="M15.5 3.5 4.5 12l11 8.5Z" /></svg>
        </button>
        <button className={`${styles.arrow} ${styles.next}`} type="button"
          aria-label="Next image" aria-controls={galleryId} onClick={() => settle(target.current + 1)}>
          <svg width="20" height="24" viewBox="0 0 20 24" aria-hidden="true"><path d="M4.5 3.5 15.5 12l-11 8.5Z" /></svg>
        </button>
      </>}
      <div className={styles.controls}>
        {slides.length > 1 && <div className={styles.selectorGroup}>
          {autoPlayInterval > 0 && <div className={styles.progress} aria-hidden="true"><span ref={progress} /></div>}
          <div className={styles.selectors} role="group" aria-label={selectionLabel}>
          {slides.map((slide, index) => (
            <button key={slide.id} className={styles.selector} type="button"
              aria-label={`Show ${slide.label}`} aria-pressed={selected === index} aria-controls={galleryId}
              onClick={() => choose(index)}>
              {showSelectorIcons && slide.iconSrc && <Image src={slide.iconSrc} alt="" width={20} height={20} unoptimized />}
              {slide.label}
            </button>
          ))}
          </div>
        </div>}
      </div>
      <ImageViewer ref={viewer} slide={current} getSource={() => images.current[selected] ?? null} onOpenChange={setDialogOpen} />
    </div>
  );
}
