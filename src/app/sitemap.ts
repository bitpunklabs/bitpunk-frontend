import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
const paths = [
  "",
  "/indicators",
  "/open-source",
  "/open-source/tradingview",
  "/open-source/github",
  "/blog",
  "/about",
  "/privacy",
  "/disclaimer",
  "/terms",
];
export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({ url: `${getSiteUrl()}${path}` }));
}
