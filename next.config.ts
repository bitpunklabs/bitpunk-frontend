import type { NextConfig } from "next";

// Retired content paths from the Playbook era. `/blog` is a real in-app route
// again, so it is deliberately NOT in this list.
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
      // Temporary redirects while Bitpunk is a public showcase. Legacy code
      // lives outside app/ and cannot run as an account or auth endpoint.
      ...[
        "/login",
        "/register",
        "/account/:path*",
        "/pricing",
        "/refund-policy",
        "/indicators",
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
