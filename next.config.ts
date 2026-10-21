import type { NextConfig } from "next";

// Retired content paths from the Playbook era.
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
        source: "/blog",
        destination: "/research",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.bitpunk.io" }],
        destination: "https://bitpunk.io/:path*",
        permanent: true,
      },
      // Temporary redirects while Bitpunk is a public showcase. Legacy code
      // lives outside app/ and cannot run as an account or auth endpoint.
      ...[
        "/login",
        "/register",
        "/account/:path*",
        "/pricing",
        "/refund-policy",
        "/agentics",
        "/docs",
      ].map((source) => ({
        source,
        destination: "/",
        permanent: false,
      })),
      ...retiredContentPaths.map((source) => ({
        source,
        destination: "/",
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
