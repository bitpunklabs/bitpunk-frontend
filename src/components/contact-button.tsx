"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ActionLabel, actionStyles } from "./action-label";
import { destinations } from "@/lib/showcase";
import styles from "./contact-button.module.css";

type Turnstile = {
  ready(callback: () => void): void;
  render(element: HTMLElement, options: {
    sitekey: string; action: string; theme: "light"; size: "flexible" | "compact";
    callback(token: string): void; "error-callback"(): void; "expired-callback"(): void;
  }): string;
  remove(widget: string): void;
};
declare global { interface Window { turnstile?: Turnstile } }
let widgetScript: Promise<Turnstile> | undefined;
const scriptUrl = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
class ContactRequestError extends Error {}

function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return new Promise(resolve => window.turnstile!.ready(() => resolve(window.turnstile!)));
  if (widgetScript) return widgetScript;
  widgetScript = new Promise<Turnstile>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${scriptUrl}"]`);
    const script = existing ?? document.createElement("script");
    const timer = window.setTimeout(failed, 15000);
    function finish() {
      window.clearTimeout(timer);
      script.removeEventListener("load", loaded);
      script.removeEventListener("error", failed);
    }
    function failed() {
      finish();
      if (!existing) script.remove();
      reject(new Error("Verification unavailable"));
    }
    function loaded() {
      finish();
      if (window.turnstile) window.turnstile.ready(() => resolve(window.turnstile!));
      else failed();
    }
    script.addEventListener("load", loaded);
    script.addEventListener("error", failed);
    if (!existing) { script.src = scriptUrl; script.async = true; document.head.append(script); }
  }).catch(error => { widgetScript = undefined; throw error; });
  return widgetScript;
}

export function ContactButton({ label = "Contact", icon = false }: { label?: string; icon?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [opened, setOpened] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"loading" | "challenge" | "checking" | "ready" | "error">("loading");
  const [email, setEmail] = useState<string>();
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const id = useId();
  const mailto = email ? `mailto:${encodeURIComponent(email.split("@")[0])}@${email.split("@")[1]}` : undefined;

  function reset() {
    setStatus("loading"); setEmail(undefined); setMessage(""); setCopied(false);
  }
  function open() { reset(); setOpened(true); dialog.current?.showModal(); }

  useEffect(() => { dialog.current?.close(); }, [pathname]);

  useEffect(() => {
    const element = host.current;
    if (!opened || !element) return;
    const controller = new AbortController();
    let cancelled = false, revealed = false, widget: string | undefined, api: Turnstile | undefined;

    async function request(init?: RequestInit) {
      const timer = window.setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch("/api/contact", { ...init, cache: "no-store", signal: controller.signal });
        const body = await response.json();
        if (!response.ok) throw new ContactRequestError(body.error || "Verification is unavailable. Please try again.");
        return body;
      } finally { window.clearTimeout(timer); }
    }
    function fail(text = "Verification couldn’t be loaded. Please try again.") {
      if (!cancelled && !revealed) { setStatus("error"); setMessage(text); }
    }

    request().then(async config => {
      if (cancelled) return;
      api = await loadTurnstile();
      if (cancelled) return;
      widget = api.render(element, {
        sitekey: config.siteKey, action: "reveal-email", theme: "light",
        size: element.clientWidth < 300 ? "compact" : "flexible",
        callback: async token => {
          if (cancelled || revealed) return;
          setStatus("checking");
          try {
            const result = await request({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
            if (!cancelled) { revealed = true; setEmail(result.email); setStatus("ready"); }
          } catch (error) { fail(error instanceof ContactRequestError ? error.message : undefined); }
        },
        "error-callback": () => fail(),
        "expired-callback": () => fail("Verification expired. Please try again."),
      });
      if (!revealed) setStatus("challenge");
    }).catch(error => fail(error instanceof ContactRequestError ? error.message : undefined));

    return () => {
      cancelled = true; controller.abort();
      if (widget !== undefined) api?.remove(widget);
    };
  }, [opened, attempt]);

  async function copy() {
    try { await navigator.clipboard.writeText(email!); setCopied(true); setMessage(""); }
    catch { setMessage("Select the address above to copy it."); }
  }

  return <>
    <button ref={trigger} className={`${styles.trigger} ${actionStyles.interactive}`} type="button" onClick={open}
      aria-haspopup="dialog" aria-controls={id}>
      {icon && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></svg>}
      <span>{label}</span>
    </button>
    <dialog ref={dialog} id={id} className={styles.dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}
      data-contact-dialog onClose={() => { setOpened(false); reset(); trigger.current?.focus(); }}
      onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className={styles.heading}>
        <h2 id={`${id}-title`}>Get in touch.</h2>
        <button className={styles.close} type="button" onClick={() => dialog.current?.close()} aria-label="Close contact">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <p id={`${id}-description`} className={styles.description}>{email ? "Ideas, questions or a conversation. Drop me a line." : "A quick human check before revealing the email address."}</p>
      <div ref={host} className={styles.challenge} hidden={status === "ready" || status === "error"} />
      <div className={styles.status} aria-live="polite" role="status">
        {status === "loading" && "Preparing verification…"}
        {status === "checking" && "Checking…"}
        {message}
      </div>
      {email && <div className={styles.address}>
        <a className={styles.email} href={mailto}>{email}</a>
        <div className={styles.actions}>
          <a href={mailto} className={actionStyles.interactive}><ActionLabel>Write an email</ActionLabel></a>
          <button type="button" onClick={copy}>{copied ? "Copied" : "Copy address"}</button>
        </div>
      </div>}
      {status === "error" && <div className={styles.actions}>
        <button type="button" onClick={() => { reset(); setAttempt(value => value + 1); }}>Try again</button>
        <a href={destinations.x!} target="_blank" rel="noopener noreferrer">Reach out on X</a>
      </div>}
    </dialog>
  </>;
}
