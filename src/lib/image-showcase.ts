export type ImageShowcaseVariant = "stack" | "fan" | "orbit";

/** Content belongs to the caller; the gallery has no product or market assumptions. */
export type ImageShowcaseSlide = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
  title?: string;
  subtitle?: string;
  iconSrc?: string;
  meta?: string;
  badge?: string;
};
