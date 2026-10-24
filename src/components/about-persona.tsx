"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import type { AboutArtwork } from "@/lib/scene-assets";
import { missingArtwork } from "@/lib/asset-placeholders";
import styles from "./about-persona.module.css";

export function AboutPersona({ artwork }: { artwork: AboutArtwork["persona"] }) {
  const figure = useRef<HTMLElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const reveal = useRef(0);
  const lastX = useRef<number | null>(null);
  const touch = useRef<{ id: number; x: number; y: number; axis: "pending" | "horizontal" | "vertical" } | null>(null);
  const available = !artwork.stonks.src.startsWith(missingArtwork) && !artwork.stonksUnmasked.src.startsWith(missingArtwork);

  function show(value: number) {
    const node = surface.current;
    if (!node) return;
    reveal.current = Math.max(0, Math.min(1, value));
    const percent = Math.round(reveal.current * 100);
    figure.current?.style.setProperty("--reveal", `${reveal.current * 100}%`);
    if (slider.current) {
      slider.current.value = String(percent);
      slider.current.setAttribute("aria-valuetext", percent === 0 ? "Mask on" : percent === 100 ? "Mask off" : `Mask off revealed: ${percent}%`);
    }
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

  return <figure ref={figure} className={styles.persona}>
    <div ref={surface} className={styles.reveal} data-interactive={available || undefined}
      onPointerEnter={event => { if (event.pointerType === "mouse") lastX.current = event.clientX; }}
      onPointerLeave={event => { if (event.pointerType === "mouse") lastX.current = null; }}
      onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish}
      onLostPointerCapture={finish}>
      <Image {...artwork.stonks} className={styles.image} unoptimized loading="lazy" draggable={false}
        alt="A two-panel This is fine comic: the masked Bitpunk persona sits calmly in a room on fire." />
      {available && <>
        <div className={styles.unmasked} aria-hidden="true">
          <Image {...artwork.stonksUnmasked} className={styles.image} unoptimized loading="eager" draggable={false} alt="" />
        </div>
        <span className={styles.rail} aria-hidden="true" />
      </>}
    </div>
    {available && <div className={styles.controls}>
      <input ref={slider} className={styles.slider} type="range" min="0" max="100" step="1" defaultValue="0"
        aria-label="Reveal the person behind the mask" aria-valuetext="Mask on"
        onChange={event => show(Number(event.currentTarget.value) / 100)} />
    </div>}
  </figure>;
}
