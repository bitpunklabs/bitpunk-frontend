import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

const paths = [
  "",
  "/indicators",
  "/agentics",
  "/pricing",
  "/blog",
  "/open-source",
  "/docs",
  "/about",
  "/refund-policy",
  "/disclaimer",
  "/terms",
  "/privacy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  return paths.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() }));
}
