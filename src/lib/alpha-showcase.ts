export const alphaShowcaseDirections = [
  { id: "stack", label: "A / Perspective stack", description: "Layered windows. A quiet sense of depth." },
  { id: "fan", label: "B / Open fan", description: "Three markets, arranged on an open display." },
  { id: "orbit", label: "C / Vertical orbit", description: "A continuous exchange between the foreground and the background." },
] as const;

export type AlphaShowcaseVariant = typeof alphaShowcaseDirections[number]["id"];
export type MarketScreenshot = {
  id: string;
  ticker: string;
  label: string;
  name: string;
  timeframe: string;
  src: string;
  logoSrc: string;
  width: number;
  height: number;
};

export function alphaShowcaseVariant(value?: string): AlphaShowcaseVariant {
  return alphaShowcaseDirections.find(direction => direction.id === value)?.id ?? "stack";
}
