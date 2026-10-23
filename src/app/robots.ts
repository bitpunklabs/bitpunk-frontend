import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/auth", "/login", "/register", "/pricing", "/api/contact"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
