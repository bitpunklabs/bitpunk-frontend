import type { NextConfig } from "next";

// Retired content paths from the Playbook era. `/blog` is a real in-app route
// again (see `src/lib/blog.ts`), so it is deliberately NOT in this list.
const retiredContentPaths = [
  "/playbook",
  "/playbook/:slug",
  "/learning",
  "/learning/:slug",
  "/membership",
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
        destination: "/",
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
