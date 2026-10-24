"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { AboutArtwork } from "@/lib/scene-assets";
import { missingArtwork } from "@/lib/asset-placeholders";
import styles from "./about-persona.module.css";

export function AboutPersona({ artwork }: { artwork: AboutArtwork["persona"] }) {
  const figure = useRef<HTMLElement>(null);
  const masked = useRef<HTMLImageElement>(null);
  const unmasked = useRef<HTMLImageElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const available = !artwork.stonks.src.startsWith(missingArtwork) && !artwork.stonksUnmasked.src.startsWith(missingArtwork);

  useEffect(() => {
    const node = figure.current;
    if (!node || !available) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = true, visible = false, ready = false;
    const update = () => {
      if (active) setPlaying(ready && visible && !document.hidden && !motion.matches);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= .2;
      update();
    }, { threshold: .2 });
    observer.observe(node);
    document.addEventListener("visibilitychange", update);
    motion.addEventListener("change", update);
    void Promise.all([masked.current?.decode(), unmasked.current?.decode()]).then(() => {
      ready = true;
      update();
    }).catch(() => { /* Keep the masked image if its counterpart cannot load. */ });
    return () => {
      active = false;
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      motion.removeEventListener("change", update);
    };
  }, [available, artwork.stonks.src, artwork.stonksUnmasked.src]);

  return <figure ref={figure} className={styles.persona} data-playing={playing || undefined}>
    <div className={styles.reveal}>
      <Image {...artwork.stonks} ref={masked} className={styles.image} unoptimized loading="lazy" draggable={false}
        alt="A two-panel This is fine comic: the masked Bitpunk persona sits calmly in a room on fire." />
      {available && <div className={styles.unmasked} data-revealed={revealed || undefined} aria-hidden="true">
        <Image {...artwork.stonksUnmasked} ref={unmasked} className={styles.image} unoptimized loading="eager" draggable={false} alt="" />
      </div>}
    </div>
    {available && <div className={styles.progress} aria-hidden="true">
      <span className={styles.progressFill} onAnimationIteration={() => { if (playing) setRevealed(value => !value); }} />
    </div>}
  </figure>;
}
