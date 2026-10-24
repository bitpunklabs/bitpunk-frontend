"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { GameArtwork, GameSnapshot, RunController } from "@/lib/bitpunk-run/types";
import styles from "./bitpunk-run.module.css";

const initial: GameSnapshot = { mode: "loading", score: 0, best: 0, counts: { btc: 0, eth: 0, sol: 0 }, title: "", copy: "" };

export function BitpunkRun({ artwork }: { artwork: GameArtwork | null }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<RunController | null>(null);
  const [snapshot, setSnapshot] = useState(initial);
  const [mountError, setMountError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!artwork) return;
    let active = true, idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const initialize = async () => {
      try {
        const { mountBitpunkRun } = await import("@/lib/bitpunk-run/runtime");
        if (!active || !canvas.current) return;
        controller.current = mountBitpunkRun(canvas.current, artwork, state => { if (active) setSnapshot(state); });
      } catch { if (active) setMountError(true); }
    };
    if (typeof requestIdleCallback === "function") idle = requestIdleCallback(() => { void initialize(); }, { timeout: 300 });
    else timer = setTimeout(() => { void initialize(); }, 50);
    return () => {
      active = false;
      if (idle !== undefined) cancelIdleCallback(idle);
      if (timer !== undefined) clearTimeout(timer);
      controller.current?.destroy(); controller.current = null;
    };
  }, [artwork, attempt]);

  const loading = !mountError && (snapshot.mode === "loading" || snapshot.mode === "preparing");
  const jump = () => {
    if (mountError) { setMountError(false); setSnapshot(initial); setAttempt(value => value + 1); }
    else controller.current?.jump();
  };
  const pointerJump = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || !event.isPrimary) return;
    event.preventDefault(); jump();
  };
  const keyDown = (event: KeyboardEvent<HTMLElement>) => {
    if ((event.code === "Space" || event.code === "ArrowUp" || event.code === "Enter") && event.target instanceof HTMLElement && event.target.closest("button")) return;
    if (["Space", "ArrowUp", "Enter", "KeyP", "Escape"].includes(event.code)) event.preventDefault();
    if (event.repeat) return;
    if (event.code === "Space" || event.code === "ArrowUp" || event.code === "Enter") jump();
    if (event.code === "KeyP") controller.current?.togglePause();
    if (event.code === "Escape") controller.current?.pause();
  };
  const showOverlay = loading || mountError || ["paused", "over", "error"].includes(snapshot.mode);
  const continuation = mountError || snapshot.mode === "error" ? "Click to try again." : snapshot.mode === "paused" ? "Click to keep going." : "Click for another run.";
  return <section id="bitpunk-run" className={styles.section} aria-labelledby="run-title">
    <header className={styles.heading}>
      <div><h2 id="run-title">A true punk<br /><em>never stops running...</em></h2>
        <p className={styles.subtitle}>... and never makes a boring &quot;About&quot; page.</p></div>
      <p className={styles.hint}>Click to jump, again to double jump.</p>
    </header>
    {!artwork ? <div className={styles.unavailable}><p>Game artwork is not included in this source build.<br />Add the authorised asset pack to play.</p></div> : <div className={styles.shell} onKeyDown={keyDown}>
      <div className={styles.hud}>
        <div className={styles.score}><span>Score</span><output aria-live="off">{String(snapshot.score).padStart(5, "0")}</output></div>
        <div className={styles.best}><span>Best</span> {String(snapshot.best).padStart(5, "0")}</div>
      </div>
      <div className={styles.stage} onPointerDown={event => {
        if (event.target instanceof Element && event.target.closest("button")) return;
        pointerJump(event);
      }} onPointerCancel={event => { if (event.isPrimary) controller.current?.pause(); }} onContextMenu={event => event.preventDefault()}>
        <canvas ref={canvas} width={640} height={320} className={styles.canvas} tabIndex={0} role="button"
          aria-keyshortcuts="Space ArrowUp Enter P Escape"
          aria-label="Click, tap, Space or Up to jump; again for a double jump. P pauses. Collect BTC for 10 points, ETH for 5 and SOL for 1. Land on bears for 10 points or swans for 20. Chain stomps for up to three times the points. Avoid candle spikes." />
        {showOverlay && <div className={`${styles.overlay} ${loading ? styles.loading : ""}`}>
          {loading ? <div className={styles.loader} role="status">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/asterisk-solid-static-v1.svg" width="30" height="30" alt="" />
            <p>{snapshot.mode === "preparing" ? "Planning your route." : "Setting the scene."}</p>
          </div> : <div className={styles.card}>
            {(mountError || snapshot.title) && <div aria-live="polite"><h3>{mountError ? "The little world needs a moment." : snapshot.title}</h3><p>{mountError ? "Try loading it again." : snapshot.copy}</p></div>}
            <p className={styles.continuation}>{continuation}</p>
          </div>}
        </div>}
      </div>
    </div>}
  </section>;
}
