import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

// Article URLs left with the content. What remains is a short, static site.
const paths = ["", "/pricing", "/about", "/refund-policy", "/disclaimer", "/terms", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  return paths.map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() }));
}
