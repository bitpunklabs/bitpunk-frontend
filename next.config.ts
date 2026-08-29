import type { NextConfig } from "next";

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
  "/admin/content",
  "/admin/content/:path*",
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bitpunk.io" }],
        destination: "https://bitpunk.io/:path*",
        permanent: true,
      },
      ...retiredContentPaths.map((source) => ({
        source,
        destination: playbookUrl,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
