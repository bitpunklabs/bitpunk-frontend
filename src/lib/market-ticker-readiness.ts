export type MarketTickerStatus = "loading" | "ready" | "failed";

type TickerLifecycle = EventTarget & { updateComplete?: Promise<unknown> };

/** A defined custom element can still be a skeleton. Wait for provider readiness. */
export function observeTickerReadiness(widget: TickerLifecycle, onStatus: (status: MarketTickerStatus) => void, {
  prepared,
  timeoutMs = 15_000,
  afterPaint = () => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
}: {
  prepared: Promise<unknown>;
  timeoutMs?: number;
  afterPaint?: () => Promise<void>;
}) {
  let disposed = false;
  let failed = false;
  let ready = false;
  let providerReady = false;
  let preparationComplete = false;
  let checking = false;

  function fail() {
    if (disposed || failed) return;
    failed = true;
    clearTimeout(timeout);
    onStatus("failed");
  }

  async function reveal() {
    if (disposed || failed || ready || checking || !providerReady || !preparationComplete) return;
    checking = true;
    try {
      await widget.updateComplete;
      await afterPaint();
      if (disposed || failed) return;
      ready = true;
      clearTimeout(timeout);
      onStatus("ready");
    } catch { fail(); }
    finally { checking = false; }
  }

  function onReady() { providerReady = true; void reveal(); }
  function onLoadingError(event: Event) {
    // A partially loaded basket can leave empty cards even when the root reports
    // ready. Optional requests do not affect the visible ticker content.
    if ((event as CustomEvent<{ priority?: string }>).detail?.priority !== "optional") fail();
  }

  const timeout = setTimeout(fail, timeoutMs);
  widget.addEventListener("tv-widget-ready", onReady);
  widget.addEventListener("tv-widget-error", fail);
  widget.addEventListener("loading-error", onLoadingError, { capture: true });
  void prepared.then(() => { preparationComplete = true; void reveal(); }, fail);

  return {
    fail,
    dispose() {
      disposed = true;
      clearTimeout(timeout);
      widget.removeEventListener("tv-widget-ready", onReady);
      widget.removeEventListener("tv-widget-error", fail);
      widget.removeEventListener("loading-error", onLoadingError, { capture: true });
    },
  };
}
