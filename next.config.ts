import type { NextConfig } from "next";

// Content images live in the Supabase Storage bucket of the configured project.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

// Learning and Blog merged into Playbook and moved to Substack. Send every old
// content path there; fall back to the home page until the URL is configured.
const playbookUrl = process.env.NEXT_PUBLIC_PLAYBOOK_URL || "/";

const retiredContentPaths = [
  "/playbook",
  "/playbook/:slug",
  "/learning",
  "/learning/:slug",
  "/blog",
  "/blog/:slug",
  "/blog/rss.xml",
  "/content",
  "/content/:slug",
  "/search",
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  async redirects() {
    return retiredContentPaths.map((source) => ({ source, destination: playbookUrl, permanent: true }));
  },
};

export default nextConfig;
