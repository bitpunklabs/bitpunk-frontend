import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
const paths = [
  "",
  "/indicators",
  "/indicators/alpha",
  "/open-source",
  "/open-source/tradingview",
  "/open-source/github",
  "/blog",
  "/about",
  "/privacy",
  "/disclaimer",
];
export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: `${getSiteUrl()}${path}` }));
}
