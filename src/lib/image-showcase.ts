export type ImageShowcaseVariant = "stack" | "fan" | "orbit";

/** Content belongs to the caller; the gallery has no product or market assumptions. */
export type ImageShowcaseSlide = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
  /** Left side of the frame: ticker and market name. */
  title?: string;
  subtitle?: string;
  iconSrc?: string;
  /** Right side of the frame: timeframe and displayed script name. */
  meta?: string;
  badge?: string;
};
