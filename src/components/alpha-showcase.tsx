"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { AlphaShowcaseVariant, MarketScreenshot } from "@/lib/alpha-showcase";
import styles from "./alpha-showcase.module.css";

const modulo = (value: number, count: number) => ((value % count) + count) % count;

/** A circular pose keeps the last-to-first transition identical to every other step. */
function windowPose(index: number, position: number, count: number, variant: AlphaShowcaseVariant) {
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

export function AlphaShowcase({ slides, variant = "stack" }: {
  slides: MarketScreenshot[];
  variant?: AlphaShowcaseVariant;
}) {
  const [selected, setSelected] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const windows = useRef<(HTMLElement | null)[]>([]);
  const chartImages = useRef<(HTMLImageElement | null)[]>([]);
  const position = useRef(0);
  const target = useRef(0);
  const frame = useRef<number | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const reducedMotion = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = slides[selected];

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
    // Decode the rear charts before revealing their windows; asynchronous image
    // painting can otherwise briefly leave empty frames in a transformed stack.
    Promise.allSettled(chartImages.current.map(image => image?.decode())).then(() => {
      if (mounted) setImagesReady(true);
    });
    return () => { mounted = false; };
  }, [slides]);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
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
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault(); settle(target.current + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault(); settle(target.current - 1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault(); choose(event.key === "Home" ? 0 : slides.length - 1);
    }
  }

  return (
    <div className={styles.showcase} data-variant={variant} data-active={current.id}>
      <div className={styles.viewport}>
        <div className={styles.stage} role="group" aria-roledescription="carousel"
          aria-label="Alpha chart gallery" aria-describedby="alpha-gesture-hint"
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
                <Image src={slide.logoSrc} alt="" width={24} height={24} unoptimized draggable={false} />
                <span className={styles.ticker}>{slide.ticker}</span>
                <span className={styles.marketName}>{slide.name}</span>
                <span className={styles.windowMeta}>{slide.timeframe}<i>Alpha</i></span>
              </div>
              <Image className={styles.chart} src={slide.src}
                ref={node => { chartImages.current[index] = node; }}
                alt={`${slide.name} ${slide.timeframe} chart with Alpha`}
                width={slide.width} height={slide.height} unoptimized loading="eager" draggable={false} />
            </figure>
          ))}
        </div>
      </div>
      <div className={styles.controls}>
        <div className={styles.markets} role="group" aria-label="Choose a market">
          {slides.map((slide, index) => (
            <button key={slide.id} className={styles.market} type="button"
              aria-label={`Show ${slide.name} chart`} aria-pressed={selected === index}
              onClick={() => choose(index)}>
              <Image src={slide.logoSrc} alt="" width={20} height={20} unoptimized />
              {slide.label}
            </button>
          ))}
        </div>
        <button className={styles.fullView} type="button" onClick={() => dialog.current?.showModal()}>View full chart</button>
      </div>
      <div className={styles.caption}>
        <p id="alpha-gesture-hint">Hold &amp; drag left or right</p>
        <p className={styles.count} aria-live="polite" aria-atomic="true">{String(selected + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</p>
      </div>
      <dialog className={styles.dialog} ref={dialog} aria-label={`${current.name} Alpha chart`}>
        <div className={styles.dialogBar}>
          <span>{current.name} <i>{current.timeframe} / Alpha</i></span>
          <button type="button" onClick={() => dialog.current?.close()}>Close</button>
        </div>
        <div className={styles.dialogImage}>
          <Image src={current.src} alt={`${current.name} ${current.timeframe} chart with Alpha`}
            width={current.width} height={current.height} unoptimized />
        </div>
        <a className={styles.original} href={current.src} target="_blank" rel="noopener noreferrer">Open original size</a>
      </dialog>
    </div>
  );
}
