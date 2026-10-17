"use client";

import { type DetailedHTMLProps, type HTMLAttributes, useCallback, useRef, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import styles from "./market-ticker.module.css";

const marketSymbols = [
  // US: supported CFD references; local labels do not change the data source.
  "FOREXCOM:SPXUSD", "FOREXCOM:NSXUSD", "FOREXCOM:DJI",
  // Japan, Korea, UK and continental Europe.
  "INDEX:NKY", "INDEX:KSIC", "FOREXCOM:UKXGBP", "FOREXCOM:EU50", "INDEX:DEU40",
  // Mainland China and Hong Kong. The free embed may use end-of-day data.
  "SSE:000001", "SSE:000300", "SZSE:399001", "SZSE:399006", "HSI:HSI", "HSI:HSTECH",
  // India, Australia and Canada.
  "BSE:SENSEX", "OANDA:AU200AUD", "TSX:TSX",
  "TVC:GOLD", "TVC:USOIL", "BITSTAMP:BTCUSD", "BITSTAMP:ETHUSD",
];
// The global basket is long enough to loop without duplicate quote widgets.
const symbols = marketSymbols.join(",");

type TickerElement = HTMLElement & {
  _itemWidth?: number;
  _contextOverrides?: Record<string, { timeFrame: string; interval: string }>;
  updateComplete?: Promise<boolean>;
  requestUpdate?: () => void;
  lx?: (symbol: string) => NativeTemplate;
  hideChart?: boolean;
};
type NativeTemplate = { strings: readonly string[]; values: unknown[] };
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "tv-ticker-tape": DetailedHTMLProps<HTMLAttributes<TickerElement>, TickerElement> & {
        symbols: string;
        "symbol-titles": string;
        theme: string;
        transparent: string;
        "line-chart-type": string;
        "hide-logo": string;
        "item-size": string;
        "disable-scroll"?: string;
      };
    }
  }
}
type Tone = "up" | "down" | "flat";
type DataRequest = {
  dataType: string;
  context?: { symbol?: string | { value?: string } };
  callback: (value: unknown) => void;
};
const lineColors: Record<Tone, string> = { up: "#496d5c", down: "#a35b49", flat: "#756e63" };
type ChartPalette = {
  tones: Map<string, Tone>;
  subscribers: Map<string, Set<() => void>>;
};
type CssVariables = Map<string, string | undefined>;
type CssSubscription = {
  props: string[];
  callback: (values: CssVariables, changed: string[]) => void;
  registerRemoveSignal: (remove: () => void) => void;
};
const palettes = new WeakMap<TickerElement, ChartPalette>();
const adaptedWidgets = new WeakSet<TickerElement>();
const lineColorProps = ["--tv-widget-positive-line-color", "--tv-widget-negative-line-color"];

function requestSymbol(detail: DataRequest) {
  const symbol = detail.context?.symbol;
  return (typeof symbol === "string" ? symbol : symbol?.value ?? "").replace("_EOD:", ":");
}

function observeQuoteTone(widget: TickerElement) {
  const palette: ChartPalette = palettes.get(widget) ?? { tones: new Map(), subscribers: new Map() };
  palettes.set(widget, palette);
  function alignColor(event: Event) {
    const detail = (event as CustomEvent<DataRequest>).detail;
    if (detail?.dataType !== "quote/ch" || typeof detail.callback !== "function") return;
    const receive = detail.callback;
    detail.callback = (value) => {
      const symbol = requestSymbol(detail);
      receive(value);
      void Promise.resolve(value).then(change => {
        if (marketNames[symbol] && typeof change === "number" && Number.isFinite(change)) {
          const tone: Tone = change > 0 ? "up" : change < 0 ? "down" : "flat";
          if (palette.tones.get(symbol) !== tone) {
            palette.tones.set(symbol, tone);
            palette.subscribers.get(symbol)?.forEach(notify => notify());
          }
        }
      }, () => { /* Native widget already handles unavailable quotes. */ });
    };
  }
  widget.addEventListener("data-request", alignColor, { capture: true });
  return () => widget.removeEventListener("data-request", alignColor, { capture: true });
}

// Only chart paint changes. Native quotes, history, chart geometry, links and
// attribution stay with TradingView. Its 1M lines otherwise color by 1M return.
// The provider observes CSS tokens at the widget root, so each native row
// adapts its own line-color subscription to the daily change shown beside it.
function alignChartColors(widget: TickerElement, palette: ChartPalette) {
  const renderItem = widget.lx;
  const sample = renderItem?.(marketSymbols[0]);
  if (!renderItem || !sample?.strings?.join("").includes("<tv-ticker-chart-item ") ||
      sample.strings.length !== sample.values.length + 1) return false;
  const parts = [...sample.strings.slice(0, -1), " hide-currency @css-vars-observer-register=", sample.strings.at(-1)!];
  const strings = Object.assign(parts, { raw: [...parts] });
  widget.lx = (symbol) => {
    const template = renderItem(symbol);
    function chartPalette(event: Event) {
      const detail = (event as CustomEvent<CssSubscription>).detail;
      if (!detail?.props?.some(prop => lineColorProps.includes(prop))) return;
      const receive = detail.callback;
      let latest: CssVariables | undefined;
      function publish(changed = lineColorProps) {
        if (!latest) return;
        const color = lineColors[palette.tones.get(symbol) ?? "flat"];
        const values = new Map(latest);
        lineColorProps.forEach(prop => values.set(prop, color));
        receive(values, changed);
      }
      detail.callback = (values, changed) => { latest = values; publish(changed); };
      const subscribers: Set<() => void> = palette.subscribers.get(symbol) ?? new Set();
      palette.subscribers.set(symbol, subscribers);
      subscribers.add(publish);
      const register = detail.registerRemoveSignal;
      detail.registerRemoveSignal = remove => register(() => {
        subscribers.delete(publish);
        remove();
      });
    }
    return { ...template, strings, values: [...template.values, chartPalette] };
  };
  widget.requestUpdate?.();
  return true;
}

const marketNames: Record<string, string> = {
  "FOREXCOM:SPXUSD": "S&P 500", "FOREXCOM:NSXUSD": "Nasdaq 100", "FOREXCOM:DJI": "Dow 30",
  "INDEX:NKY": "Nikkei 225", "INDEX:KSIC": "KOSPI",
  "FOREXCOM:UKXGBP": "FTSE 100", "FOREXCOM:EU50": "Euro Stoxx 50", "INDEX:DEU40": "DAX 40",
  "SSE:000001": "Shanghai", "SSE:000300": "CSI 300",
  "SZSE:399001": "Shenzhen", "SZSE:399006": "ChiNext",
  "HSI:HSI": "Hang Seng", "HSI:HSTECH": "Hang Seng Tech", "BSE:SENSEX": "Sensex",
  "OANDA:AU200AUD": "ASX 200", "TSX:TSX": "TSX Composite",
  "TVC:GOLD": "Gold", "TVC:USOIL": "WTI Oil", "BITSTAMP:BTCUSD": "Bitcoin", "BITSTAMP:ETHUSD": "Ethereum",
};

function subscribeToMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function MarketTicker() {
  const widgetRef = useRef<TickerElement>(null);
  const captureWidget = useCallback((widget: TickerElement | null) => {
    widgetRef.current = widget;
    if (!widget) return;
    return observeQuoteTone(widget);
  }, []);
  const [failed, setFailed] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  async function compactChartWidth() {
    await customElements.whenDefined("tv-ticker-tape");
    const widget = widgetRef.current;
    if (!widget) return;
    await widget.updateComplete;
    // The current compact widget has no chart-width attribute. This optional
    // native layout hint leaves fonts and height unchanged and reduces only
    // the spare horizontal space available to its chart. If the provider
    // changes this field, keep its default layout instead of patching internals.
    if (typeof widget._itemWidth === "number" && widget._itemWidth === 376) {
      widget._itemWidth = 350;
    }
    if (widget._contextOverrides && typeof widget._contextOverrides === "object") {
      widget._contextOverrides = Object.fromEntries(marketSymbols.map(symbol => [symbol, { timeFrame: "1M", interval: "1D" }]));
    }
    if (!adaptedWidgets.has(widget)) {
      const palette = palettes.get(widget);
      // A changed provider template falls back to quotes without misleading colors.
      if (!palette || !alignChartColors(widget, palette)) widget.hideChart = true;
      adaptedWidgets.add(widget);
    }
  }

  return (
    <section className={styles.ticker} aria-label="World markets — CFD references and spot prices" data-market-ticker>
      <div className={styles.quotes}>
        {!failed && <tv-ticker-tape ref={captureWidget} className={styles.widget}
          symbols={symbols} symbol-titles={JSON.stringify(marketNames)} theme="light" transparent=""
          line-chart-type="Line" hide-logo="" item-size="compact"
          disable-scroll={reducedMotion ? "" : undefined} />}
        <p className={styles.fallback} data-failed={failed || undefined}>
          {failed ? "Market data unavailable." : "Loading market data…"}{" "}
          <a href="https://www.tradingview.com/markets/" target="_blank" rel="noopener noreferrer">View markets</a>
        </p>
      </div>
      <Script src="https://widgets.tradingview-widget.com/w/en/tv-ticker-tape.js"
        type="module" strategy="afterInteractive" onReady={() => { void compactChartWidth(); }}
        onError={() => setFailed(true)} />
    </section>
  );
}
