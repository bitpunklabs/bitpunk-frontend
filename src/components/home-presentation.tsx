"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { homeTransitions, type HomeTransition } from "@/lib/home-transitions";
import styles from "./home-presentation.module.css";

/** Review tools are only rendered by the development-only query branch. */
function TransitionReview({ variant }: { variant: HomeTransition }) {
  const animation = useRef(0);
  const [playing, setPlaying] = useState(false);
  const concept = homeTransitions.find(item => item.id === variant)!;

  function stop() {
    cancelAnimationFrame(animation.current);
    animation.current = 0;
    setPlaying(false);
  }

  useEffect(() => {
    function interrupt() {
      if (animation.current) {
        cancelAnimationFrame(animation.current);
        animation.current = 0;
        setPlaying(false);
      }
    }
    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchstart", interrupt, { passive: true });
    window.addEventListener("keydown", interrupt);
    window.addEventListener("resize", interrupt);
    return () => {
      cancelAnimationFrame(animation.current);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchstart", interrupt);
      window.removeEventListener("keydown", interrupt);
      window.removeEventListener("resize", interrupt);
    };
  }, []);

  function seek(progress: number) {
    stop();
    const stage = document.querySelector<HTMLElement>("[data-home-presentation]");
    if (!stage) return;
    const start = Number(stage.dataset.scrollStart || 0);
    const travel = Number(stage.dataset.scrollTravel || 0);
    let top = progress ? Math.ceil(start + travel * progress) : 0;
    if (progress && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const incoming = document.querySelector("[data-home-incoming]");
      const chrome = document.querySelector("[data-site-chrome]");
      if (incoming) top = (incoming.getBoundingClientRect().top + window.scrollY - (chrome?.getBoundingClientRect().height ?? 108)) * progress;
    }
    window.scrollTo({ top, behavior: "instant" });
  }

  function play() {
    if (playing) { stop(); return; }
    const stage = document.querySelector<HTMLElement>("[data-home-presentation]");
    if (!stage) return;
    const end = Math.ceil(Number(stage.dataset.scrollStart || 0) + Number(stage.dataset.scrollTravel || 0));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { seek(1); return; }
    window.scrollTo({ top: 0, behavior: "instant" });
    setPlaying(true);
    const start = performance.now();
    function advance(now: number) {
      const p = Math.min(1, (now - start) / 5200);
      window.scrollTo({ top: end * p, behavior: "instant" });
      if (p < 1) animation.current = requestAnimationFrame(advance);
      else { animation.current = 0; setPlaying(false); }
    }
    animation.current = requestAnimationFrame(advance);
  }

  return (
    <aside className={styles.review} aria-label="Transition design review">
      {(["A", "C"] as const).map(family => <nav key={family} aria-label={`${family} design variants`}>
        {homeTransitions.filter(item => item.family === family).map(({ id, label }) => (
          <a key={id} href={`/?transition=${id}`} aria-current={variant === id ? "page" : undefined}>
            {label}
          </a>
        ))}
      </nav>)}
      <p className={styles.reviewDescription}>{concept.description}</p>
      <div className={styles.phases} aria-label="Preview scroll position">
        <button type="button" onClick={play} className={styles.play}>{playing ? "停止" : "演示"}</button>
        {[0, .3, .6, 1].map(progress => (
          <button key={progress} onClick={() => seek(progress)} type="button">
            {progress === 0 ? "Reset" : `${progress * 100}%`}
          </button>
        ))}
      </div>
    </aside>
  );
}

export function HomePresentation({ art, children, variant = "gallery", review = false }: {
  art: ReactNode;
  children: ReactNode;
  variant?: HomeTransition;
  review?: boolean;
}) {
  const maskId = `home-fold-${useId().replace(/:/g, "")}`;
  useLayoutEffect(() => {
    window.dispatchEvent(new Event("bitpunk:home-layout"));
  }, [variant]);

  function explore(event: MouseEvent<HTMLAnchorElement>) {
    const stage = event.currentTarget.closest("[data-home-presentation]") as HTMLElement | null;
    if (!stage?.dataset.scrollTravel) return;
    event.preventDefault();
    const top = Math.ceil(Number(stage.dataset.scrollStart) + Number(stage.dataset.scrollTravel));
    window.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return (
    <div className={styles.presentation}>
      <div className={styles.stage} data-home-presentation data-transition={variant} data-fold-mask={maskId}>
        {variant === "curtain-fold" && <svg className={styles.maskDefs} aria-hidden="true" focusable="false" width="0" height="0">
          <defs>
            <filter id={`${maskId}-soft`} filterUnits="userSpaceOnUse" x="-.1" y="-.1" width="1.2" height="1.2">
              <feGaussianBlur stdDeviation=".006" />
            </filter>
            <mask id={maskId} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox" x="0" y="0" width="1" height="1" style={{ maskType: "luminance" }}>
              <rect width="1" height="1" fill="white" />
              <path data-home-fold-path d="M.5 -.1V1.1V-.1Z" fill="black" filter={`url(#${maskId}-soft)`} />
            </mask>
          </defs>
        </svg>}
        <div className={styles.pin} data-home-pin>
          <div className={styles.surface} data-home-surface>{art}</div>
          <a className={styles.continue} href="#home-updates-title" onClick={explore} aria-label="Explore the latest from Bitpunk">
            <span aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className={styles.content} data-home-incoming>{children}</div>
      {review && <TransitionReview variant={variant} />}
    </div>
  );
}
