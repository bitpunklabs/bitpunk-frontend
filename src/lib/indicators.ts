// Curated public summaries only. Product sources and internal docs stay in
// bitpunk-lab; this website does not import or distribute those files.
export type IndicatorProduct = {
  id: string;
  name: string;
  role: string;
  description: string;
  documentationUrl: string | null;
  tradingViewUrl: string | null;
};

export const indicators: readonly IndicatorProduct[] = [
  {
    id: "alpha",
    name: "Alpha",
    role: "Chart analysis",
    description: "Read momentum signals alongside trend, structure and volume context.",
    documentationUrl: null,
    tradingViewUrl: null,
  },
  {
    id: "screener",
    name: "Screener",
    role: "Watchlist screening",
    description: "Shortlist possible momentum turns across your watchlist in TradingView’s Pine Screener.",
    documentationUrl: null,
    tradingViewUrl: null,
  },
];
