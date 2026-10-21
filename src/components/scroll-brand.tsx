"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import type { WordmarkArtwork } from "@/lib/scene-assets";
import { Wordmark } from "./wordmark";
import { foldOpeningPath } from "@/lib/home-transitions";
import styles from "./scroll-brand.module.css";

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => { const p = clamp(value); return p * p * (3 - 2 * p); };
const mix = (from: number, to: number, progress: number) => from + (to - from) * progress;

/** One persistent lockup: the animated asterisk is never swapped or remounted on scroll. */
export function ScrollBrand({ artwork, onNavigate }: { artwork: WordmarkArtwork; onNavigate: () => void }) {
  const pathname = usePathname();
  const dock = useRef<HTMLSpanElement>(null);
  const logo = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const target = dock.current;
    const mark = logo.current;
    if (!target || !mark) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let resizeFrame = 0;
    let disposed = false;
    let stage: HTMLElement | null = null;
    let pin: HTMLElement | null = null;
    let surface: HTMLElement | null = null;
    let source: HTMLElement | null = null;
    let incoming: HTMLElement | null = null;
    let foldPath: SVGPathElement | null = null;
    let geometry = { start: 0, travel: 1, stageY: 0, pinTop: 0, localY: 0,
      sourceX: 0, sourceWidth: 0, targetX: 0, targetY: 0, targetWidth: 1, portrait: false };
    let previousProgress = -1;
    let previousTransform = "";

    function draw() {
      frame = 0;
      if (!mark || !target) return;
      const g = geometry;
      const home = pathname === "/" && stage && source;
      if (pathname === "/" && !home) {
        mark.style.visibility = "hidden";
        return;
      }
      const progress = home ? clamp((window.scrollY - g.start) / g.travel) : 1;
      const reduced = reducedMotion.matches;
      const brandProgress = home
        ? (reduced ? (window.scrollY > 100 ? 1 : 0) : smooth((progress - .015) / .55))
        : 1;
      const sourceY = reduced || window.scrollY < g.start
        ? g.stageY - window.scrollY + g.localY
        : g.pinTop + g.localY;
      // Rise through the quiet centre before moving left, clear of the sculptures.
      const x = mix(g.sourceX, g.targetX, brandProgress ** 1.6);
      const y = mix(sourceY, g.targetY, 1 - (1 - brandProgress) ** 2.4);
      const scale = mix(g.sourceWidth / g.targetWidth, 1, 1 - (1 - brandProgress) ** 1.4);
      const transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(5)})`;
      if (previousTransform !== transform) {
        mark.style.transform = transform;
        previousTransform = transform;
      }
      const position = brandProgress === 1 ? "docked" : "hero";
      if (mark.dataset.position !== position) mark.dataset.position = position;
      if (mark.style.visibility !== "visible") mark.style.visibility = "visible";
      // Leave the server-rendered mark visible until its persistent counterpart
      // is positioned. The source box remains measurable for responsive FLIP.
      if (home && source && source.style.visibility !== "hidden") source.style.visibility = "hidden";
      if (!home || !surface || !stage || reduced || progress === previousProgress) return;
      previousProgress = progress;
      const p = smooth(progress);
      stage.style.setProperty("--cue-opacity", String(1 - clamp(progress / .12)));
      stage.style.setProperty("--home-copy-opacity", String(1 - smooth((progress - .025) / .23)));
      stage.style.setProperty("--edge-opacity", String(Math.sin(Math.PI * p) * .8));
      // Reuse the existing composite. No duplicated artwork, live blur or WebGL scene.
      if (stage.dataset.transition === "folio") {
        surface.style.transformOrigin = "0% 48%";
        surface.style.transform = `translate3d(${-p * 7}%, ${-p * 3}%, 0) rotateY(${p * 55}deg) scale(${1 - p * .07})`;
        surface.style.opacity = String(1 - smooth((progress - .35) / .65));
      } else if (stage.dataset.transition?.startsWith("curtain")) {
        if (stage.dataset.transition === "curtain-fold" && foldPath) {
          surface.style.maskImage = `url("#${stage.dataset.foldMask}")`;
          foldPath.setAttribute("d", foldOpeningPath(progress, g.portrait ? 1.26 : 1));
          surface.style.transform = "none";
        } else if (stage.dataset.transition === "curtain-observe") {
          const reveal = g.portrait ? clamp(progress * 1.18) : progress;
          const left = 42 - smooth(reveal ** .80) * 57;
          const right = 42 + smooth(reveal ** 1.20) * 73;
          const feather = Math.min((right - left) / 2, 1.1);
          surface.style.maskImage = `linear-gradient(102deg, #000 ${left - feather}%, transparent ${left + feather}%, transparent ${right - feather}%, #000 ${right + feather}%)`;
          surface.style.transform = "none";
        } else {
          const gap = smooth((progress - .02) / .96) * 50;
          const feather = Math.min(gap, 1.2);
          surface.style.maskImage = progress >= 1 ? "linear-gradient(transparent, transparent)"
            : `linear-gradient(to right, #000 ${50 - gap - feather}%, transparent ${50 - gap + feather}%, transparent ${50 + gap - feather}%, #000 ${50 + gap + feather}%)`;
          surface.style.transform = `scale(${1 + p * .035})`;
        }
        surface.style.opacity = "1";
        if (incoming) {
          // Hold the reading surface behind the opening, then release at its
          // natural document position. Only the transition needs a transform.
          incoming.style.transform = progress < 1
            ? `translate3d(0, ${-(1 - progress) * g.travel}px, 0)` : "";
          incoming.inert = progress < .85;
        }
      } else if (stage.dataset.transition === "gallery-depth") {
        surface.style.transform = `translate3d(0, ${-p * 3.5}%, 0) rotateX(${p * 4}deg) scale(${1 - p * .15})`;
        surface.style.opacity = String(1 - p * .34);
      } else if (stage.dataset.transition === "gallery-offset") {
        surface.style.transform = `translate3d(${-p * 2.2}%, ${-p * 5}%, 0) rotate(${-p * 1.25}deg) scale(${1 - p * .09})`;
        surface.style.opacity = String(1 - p * .42);
      } else {
        surface.style.transform = `translate3d(0, ${-p * 7}%, 0) scale(${1 - p * .085})`;
        surface.style.opacity = String(1 - p * .7);
      }
      const transformMoves = stage.dataset.transition !== "curtain-fold" && stage.dataset.transition !== "curtain-observe";
      surface.style.willChange = progress > 0 && progress < 1 && transformMoves ? "transform, opacity" : "auto";
      surface.inert = progress > .22;
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function measure() {
      resizeFrame = 0;
      if (!mark || !target) return;
      stage = pathname === "/" ? document.querySelector<HTMLElement>("[data-home-presentation]") : null;
      pin = stage?.querySelector<HTMLElement>("[data-home-pin]") ?? null;
      surface = stage?.querySelector<HTMLElement>("[data-home-surface]") ?? null;
      source = stage?.querySelector<HTMLElement>("[data-home-logo-anchor]") ?? null;
      incoming = document.querySelector<HTMLElement>("[data-home-incoming]");
      foldPath = stage?.querySelector<SVGPathElement>("[data-home-fold-path]") ?? null;
      if (!stage?.dataset.transition?.startsWith("curtain")) {
        if (surface) surface.style.maskImage = "";
        if (incoming) { incoming.style.transform = ""; incoming.inert = false; }
      }
      if (surface && stage?.dataset.transition !== "folio") surface.style.transformOrigin = "";
      // All geometry reads happen on mount/resize, never in the scroll handler.
      const oldTransform = surface?.style.transform ?? "";
      if (surface) surface.style.transform = "none";
      const targetRect = target.getBoundingClientRect();
      const sourceRect = source?.getBoundingClientRect();
      const pinRect = pin?.getBoundingClientRect();
      const stageRect = stage?.getBoundingClientRect();
      const pinTop = pin ? Number.parseFloat(getComputedStyle(pin).top) || 0 : 0;
      const stageY = stageRect ? stageRect.top + window.scrollY : 0;
      const travel = stageRect && pinRect ? Math.max(1, stageRect.height - pinRect.height) : 1;
      geometry = {
        stageY, pinTop, travel,
        start: stageY - pinTop,
        localY: sourceRect && pinRect ? sourceRect.top - pinRect.top : 0,
        sourceX: sourceRect?.left ?? targetRect.left,
        sourceWidth: sourceRect?.width ?? targetRect.width,
        targetX: targetRect.left,
        // The header stays at the viewport top, including after SPA navigation.
        targetY: (targetRect.top - (target.closest("header")?.getBoundingClientRect().top ?? 0))
          + (targetRect.height - targetRect.width * artwork.height / artwork.width) / 2,
        targetWidth: targetRect.width,
        portrait: pinRect ? pinRect.width / pinRect.height < 1.2 : false,
      };
      if (surface) {
        surface.style.transform = oldTransform;
        if (reducedMotion.matches) {
          surface.style.transform = "";
          surface.style.maskImage = "";
          surface.style.opacity = "";
          surface.style.willChange = "auto";
          surface.inert = false;
          stage?.style.removeProperty("--home-copy-opacity");
          if (incoming) { incoming.style.transform = ""; incoming.inert = false; }
        }
      }
      mark.style.width = `${targetRect.width}px`;
      if (stage) {
        stage.dataset.scrollStart = String(geometry.start);
        stage.dataset.scrollTravel = String(travel);
      }
      previousProgress = -1;
      draw();
    }

    function scheduleMeasure() {
      if (!resizeFrame) resizeFrame = requestAnimationFrame(measure);
    }
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(target);
    const scene = document.querySelector("[data-home-scene]");
    if (pathname === "/" && scene) observer.observe(scene);
    measure();
    // Next may stream the page after the persistent layout has mounted.
    const mutation = new MutationObserver(() => {
      if (pathname === "/" && !stage && document.querySelector("[data-home-presentation]")) {
        const nextScene = document.querySelector("[data-home-scene]");
        if (nextScene) observer.observe(nextScene);
        measure();
        mutation.disconnect();
      }
    });
    if (pathname === "/" && !stage) mutation.observe(document.querySelector("main") ?? document.body, { childList: true, subtree: true });
    document.fonts.ready.then(() => { if (!disposed) scheduleMeasure(); });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("bitpunk:home-layout", scheduleMeasure);
    reducedMotion.addEventListener("change", scheduleMeasure);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(resizeFrame);
      observer.disconnect();
      mutation.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("bitpunk:home-layout", scheduleMeasure);
      reducedMotion.removeEventListener("change", scheduleMeasure);
    };
  }, [pathname, artwork.height, artwork.width]);

  return (
    <>
      <span ref={dock} className={styles.dock} aria-hidden="true" />
      <Link ref={logo} className={styles.logo} href="/" aria-label="Bitpunk home" onClick={onNavigate}>
        <Wordmark artwork={artwork} />
      </Link>
    </>
  );
}
