"use client";

import { useEffect, useRef, useState } from "react";
import type { PostEmbed } from "@/lib/post-embeds";
import { PlatformIcon, type PlatformName } from "./platform-icon";
import styles from "./official-post-embed.module.css";

type XWidgets = {
  widgets: {
    createTweet(id: string, host: HTMLElement, options: Record<string, string | number | boolean>): Promise<HTMLElement | undefined>;
    createTimeline(source: { sourceType: "profile"; screenName: string }, host: HTMLElement,
      options: Record<string, string | number | boolean>): Promise<HTMLElement | undefined>;
  };
};
declare global { interface Window { twttr?: XWidgets } }
let xScript: Promise<XWidgets> | undefined;

function loadXWidgets() {
  if (window.twttr?.widgets) return Promise.resolve(window.twttr);
  if (xScript) return xScript;
  xScript = new Promise<XWidgets>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[src='https://platform.twitter.com/widgets.js']");
    const script = existing ?? document.createElement("script");
    const timer = window.setTimeout(() => { finish(); reject(new Error("X embed timed out")); }, 15000);
    function finish() {
      window.clearTimeout(timer);
      script.removeEventListener("load", loaded);
      script.removeEventListener("error", failed);
    }
    function loaded() {
      finish();
      if (window.twttr?.widgets) resolve(window.twttr);
      else reject(new Error("X widgets unavailable"));
    }
    function failed() {
      finish();
      if (!existing) script.remove();
      reject(new Error("X embed unavailable"));
    }
    script.addEventListener("load", loaded);
    script.addEventListener("error", failed);
    if (!existing) {
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      document.head.append(script);
    }
  }).catch(error => { xScript = undefined; throw error; });
  return xScript;
}

/** Official vendor UI. One responsive instance per post; load only near the viewport. */
export function OfficialPostEmbed({ embed, platform, theme = "light", compact = false }: { embed: PostEmbed; platform: PlatformName; theme?: "light" | "dark"; compact?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [height, setHeight] = useState(470);
  const [frameUrl, setFrameUrl] = useState<string>();

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    function activate() {
      if (embed.provider !== "x" && embed.provider !== "x-timeline") {
        const url = new URL(embed.frameUrl);
        if (embed.provider === "substack") {
          url.searchParams.set("origin", window.location.origin);
          url.searchParams.set("fullURL", window.location.href);
        }
        setFrameUrl(url.href);
      }
      setActive(true);
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { activate(); observer.disconnect(); }
    }, { rootMargin: "200px 0px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [embed]);

  useEffect(() => {
    const element = host.current;
    if (!active || (embed.provider !== "x" && embed.provider !== "x-timeline") || !element) return;
    let cancelled = false;
    const timeout = window.setTimeout(() => { if (!cancelled) setStatus("failed"); }, 20000);
    loadXWidgets().then(api => {
      if (cancelled) return;
      if (embed.provider === "x-timeline") return api.widgets.createTimeline({
        sourceType: "profile", screenName: embed.screenName,
      }, element, { theme, dnt: true, height: 440, chrome: "noheader nofooter noborders" });
      return api.widgets.createTweet(embed.postId, element, {
        theme, conversation: "none", dnt: true, align: "center",
      });
    }).then(widget => {
      if (!cancelled) { window.clearTimeout(timeout); setStatus(widget ? "ready" : "failed"); }
    }).catch(() => { if (!cancelled) { window.clearTimeout(timeout); setStatus("failed"); } });
    return () => { cancelled = true; window.clearTimeout(timeout); element.replaceChildren(); };
  }, [active, embed, theme]);

  useEffect(() => {
    if (!active || embed.provider !== "substack") return;
    const origin = new URL(embed.frameUrl).origin;
    function resize(event: MessageEvent) {
      if (event.origin !== origin || event.source !== frame.current?.contentWindow
        || typeof event.data !== "object" || event.data === null) return;
      const next = Number.parseFloat(String(event.data.iframeHeight));
      if (Number.isFinite(next) && next >= 100 && next <= 3000) {
        setHeight(Math.ceil(next));
        setStatus("ready");
      }
    }
    window.addEventListener("message", resize);
    return () => window.removeEventListener("message", resize);
  }, [active, embed]);

  const timeline = embed.provider === "x-timeline";
  return <div className={styles.embed} ref={root} hidden={compact && status === "failed"}
    data-official-embed={embed.provider} data-status={status} data-theme={theme} data-compact={compact || undefined}>
    <div className={styles.mount}>
      {status !== "ready" && <div className={styles.placeholder} role="status">
        <PlatformIcon name={platform} />
        <span>{status === "failed" ? (timeline ? "See the latest updates on X." : "This post couldn’t be loaded.") : `${platform} ${timeline ? "updates" : "post"}`}</span>
      </div>}
      {active && (embed.provider === "x" || embed.provider === "x-timeline") && <div ref={host} className={styles.xHost} />}
      {active && frameUrl && <iframe ref={frame} src={frameUrl} title={`${platform} post`}
        className={styles.frame} style={embed.provider === "substack" ? { height } : undefined}
        loading="lazy" referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        onLoad={() => setStatus("ready")} onError={() => setStatus("failed")} />}
    </div>
    <a className={styles.source} href={embed.url} target="_blank" rel="noopener noreferrer">View {timeline ? "profile" : "post"} on {platform}</a>
  </div>;
}
