"use client";

import Image from "next/image";
import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import type { AboutArtwork } from "@/lib/scene-assets";
import { missingArtwork } from "@/lib/asset-placeholders";
import styles from "./about-persona.module.css";

export function AboutPersona({ artwork }: { artwork: AboutArtwork["persona"] }) {
  const surface = useRef<HTMLDivElement>(null);
  const reveal = useRef(0);
  const lastX = useRef<number | null>(null);
  const touch = useRef<{ id: number; x: number; y: number; axis: "pending" | "horizontal" | "vertical" } | null>(null);
  const available = !artwork.stonks.src.startsWith(missingArtwork) && !artwork.stonksUnmasked.src.startsWith(missingArtwork);

  function show(value: number) {
    const node = surface.current;
    if (!node) return;
    reveal.current = Math.max(0, Math.min(1, value));
    const percent = Math.round(reveal.current * 100);
    node.style.setProperty("--reveal", `${reveal.current * 100}%`);
    node.setAttribute("aria-valuenow", String(percent));
    node.setAttribute("aria-valuetext", percent === 0 ? "Mask on" : percent === 100 ? "Mask off" : `Mask off revealed: ${percent}%`);
    node.dataset.interacted = "true";
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!available) return;
    if (event.pointerType !== "mouse") {
      const gesture = touch.current;
      if (!gesture || gesture.id !== event.pointerId) return;
      if (gesture.axis === "pending") {
        const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
        gesture.axis = Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
      }
      if (gesture.axis !== "horizontal") return;
    }
    const previous = lastX.current;
    lastX.current = event.clientX;
    if (previous === null) return;
    const delta = event.clientX - previous;
    if (!delta) return;
    const rect = event.currentTarget.getBoundingClientRect();
    // Movement controls the reveal; entering from either edge never changes the image.
    let next = reveal.current + delta / rect.width;
    if (delta > 0 && event.clientX >= rect.right - 8) next = 1;
    if (delta < 0 && event.clientX <= rect.left + 8) next = 0;
    show(next);
  }

  function start(event: PointerEvent<HTMLDivElement>) {
    if (!available || event.pointerType === "mouse" || !event.isPrimary) return;
    touch.current = { id: event.pointerId, x: event.clientX, y: event.clientY, axis: "pending" };
    lastX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function finish(event: PointerEvent<HTMLDivElement>) {
    if (touch.current?.id !== event.pointerId) return;
    touch.current = null;
    lastX.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    const next = { ArrowLeft: reveal.current - .1, ArrowRight: reveal.current + .1, Home: 0, End: 1 }[event.key];
    if (next === undefined || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    show(next);
  }

  return <figure className={styles.persona}>
    <div ref={surface} className={styles.reveal} role={available ? "slider" : undefined}
      tabIndex={available ? 0 : undefined} aria-label={available ? "Reveal the person behind the mask" : undefined}
      aria-valuemin={available ? 0 : undefined} aria-valuemax={available ? 100 : undefined}
      aria-valuenow={available ? 0 : undefined} aria-valuetext={available ? "Mask on" : undefined}
      aria-orientation={available ? "horizontal" : undefined}
      onPointerEnter={event => { if (event.pointerType === "mouse") lastX.current = event.clientX; }}
      onPointerLeave={event => { if (event.pointerType === "mouse") lastX.current = null; }}
      onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish}
      onLostPointerCapture={finish} onKeyDown={available ? keyboard : undefined}>
      <Image {...artwork.stonks} className={styles.image} unoptimized loading="lazy" draggable={false}
        alt="The masked Bitpunk persona in a suit, beside a rising orange arrow and the word stonks." />
      {available && <>
        <div className={styles.unmasked} aria-hidden="true">
          <Image {...artwork.stonksUnmasked} className={styles.image} unoptimized loading="eager" draggable={false} alt="" />
        </div>
        <span className={styles.rail} aria-hidden="true" />
        <span className={styles.hint} aria-hidden="true">
          <svg width="26" height="14" viewBox="0 0 26 14" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 3-4 4 4 4m14-8 4 4-4 4M11 3v8m4-8v8" />
          </svg>
        </span>
      </>}
    </div>
  </figure>;
}
