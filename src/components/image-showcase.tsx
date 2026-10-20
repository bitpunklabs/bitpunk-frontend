"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { ImageShowcaseSlide, ImageShowcaseVariant } from "@/lib/image-showcase";
import styles from "./image-showcase.module.css";

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

type Gesture = {
  id: number;
  startX: number;
  startPosition: number;
  lastX: number;
  lastAt: number;
  velocity: number;
  travel: number;
};

export type ImageShowcaseProps = {
  slides: readonly ImageShowcaseSlide[];
  label: string;
  variant?: ImageShowcaseVariant;
  selectionLabel?: string;
  fullViewLabel?: string;
};

export function ImageShowcase(props: ImageShowcaseProps) {
  if (!props.slides.length) return null;
  // Reset selection and image readiness when a caller replaces the collection.
  const collection = props.slides.map(slide => `${slide.id}:${slide.src}`).join("|");
  return <ImageShowcaseGallery key={collection} {...props} />;
}

function ImageShowcaseGallery({ slides, label, variant = "stack",
  selectionLabel = "Choose an image", fullViewLabel = "View full image" }: ImageShowcaseProps) {
  const galleryId = useId();
  const [selected, setSelected] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const windows = useRef<(HTMLElement | null)[]>([]);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const position = useRef(0);
  const target = useRef(0);
  const frame = useRef<number | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const reducedMotion = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
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

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (slides.length < 2 || !event.isPrimary || event.button !== 0) return;
    stopFrame();
    gesture.current = {
      id: event.pointerId, startX: event.clientX, startPosition: position.current,
      lastX: event.clientX, lastAt: event.timeStamp, velocity: 0,
      travel: Math.max(100, event.currentTarget.clientWidth * .28),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const drag = gesture.current;
    if (!drag || drag.id !== event.pointerId) return;
    drag.velocity = (event.clientX - drag.lastX) / Math.max(8, event.timeStamp - drag.lastAt);
    drag.lastX = event.clientX;
    drag.lastAt = event.timeStamp;
    const delta = Math.max(-.96, Math.min(.96, (drag.startX - event.clientX) / drag.travel));
    position.current = drag.startPosition + delta;
    if (frame.current === null) {
      frame.current = requestAnimationFrame(() => { frame.current = null; paint(position.current); });
    }
  }

  function endDrag(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const drag = gesture.current;
    if (!drag || drag.id !== event.pointerId) return;
    gesture.current = null;
    setDragging(false);
    const distance = position.current - drag.startPosition;
    const speed = event.timeStamp - drag.lastAt < 90 ? drag.velocity : 0;
    const moved = Math.abs(event.clientX - drag.startX) > 10;
    const step = !cancelled && moved && (Math.abs(distance) > .16 || Math.abs(speed) > .4)
      ? Math.sign(distance || -speed) : 0;
    settle(Math.round(drag.startPosition) + step);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function choose(index: number) {
    const active = modulo(target.current, slides.length);
    let distance = modulo(index - active, slides.length);
    if (distance > slides.length / 2) distance -= slides.length;
    settle(target.current + distance);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (slides.length < 2) return;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault(); settle(target.current + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault(); settle(target.current - 1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault(); choose(event.key === "Home" ? 0 : slides.length - 1);
    }
  }

  return (
    <div className={styles.showcase} data-variant={variant} data-active={current.id} data-single={slides.length === 1 || undefined}>
      <div className={styles.viewport}>
        <div id={galleryId} className={styles.stage} style={{ aspectRatio: stageRatio }} role="group" aria-roledescription="carousel"
          aria-label={label}
          aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Home End"
          aria-busy={!imagesReady}
          tabIndex={0} data-dragging={dragging || undefined}
          onPointerDown={startDrag} onPointerMove={moveDrag}
          onPointerUp={event => endDrag(event)} onPointerCancel={event => endDrag(event, true)}
          onLostPointerCapture={event => endDrag(event, true)} onKeyDown={onKeyDown}>
          {slides.map((slide, index) => (
            <figure key={slide.id} className={styles.window} aria-hidden={index !== selected}
              ref={node => { windows.current[index] = node; }}
              style={windowPose(index, 0, slides.length, variant)}>
              <div className={styles.windowBar}>
                {slide.iconSrc && <Image src={slide.iconSrc} alt="" width={24} height={24} unoptimized draggable={false} />}
                <span className={styles.title}>{slide.title ?? slide.label}</span>
                {slide.subtitle && <span className={styles.subtitle}>{slide.subtitle}</span>}
                {(slide.meta || slide.badge) && <span className={styles.windowMeta}>{slide.meta}{slide.badge && <i>{slide.badge}</i>}</span>}
              </div>
              <Image className={styles.image} src={slide.src}
                ref={node => { images.current[index] = node; }}
                alt={slide.alt}
                width={slide.width} height={slide.height} unoptimized loading="eager" draggable={false} />
            </figure>
          ))}
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
      </div>
      <div className={styles.controls}>
        {slides.length > 1 && <div className={styles.selectors} role="group" aria-label={selectionLabel}>
          {slides.map((slide, index) => (
            <button key={slide.id} className={styles.selector} type="button"
              aria-label={`Show ${slide.label}`} aria-pressed={selected === index} aria-controls={galleryId}
              onClick={() => choose(index)}>
              {slide.iconSrc && <Image src={slide.iconSrc} alt="" width={20} height={20} unoptimized />}
              {slide.label}
            </button>
          ))}
        </div>}
        <button className={styles.fullView} type="button" onClick={() => dialog.current?.showModal()}>{fullViewLabel}</button>
      </div>
      {slides.length > 1 && <div className={styles.caption}>
        <p className={styles.count} aria-live="polite" aria-atomic="true">{String(selected + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</p>
      </div>}
      <dialog className={styles.dialog} ref={dialog} aria-label={current.alt}>
        <div className={styles.dialogBar}>
          <span>{current.title ?? current.label} <i>{[current.meta, current.badge].filter(Boolean).join(" / ")}</i></span>
          <button type="button" onClick={() => dialog.current?.close()}>Close</button>
        </div>
        <div className={styles.dialogImage}>
          <Image src={current.src} alt={current.alt}
            width={current.width} height={current.height} unoptimized />
        </div>
        <a className={styles.original} href={current.src} target="_blank" rel="noopener noreferrer">Open original size</a>
      </dialog>
    </div>
  );
}
