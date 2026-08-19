import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Playbook was renamed to Learning. Keep the old paths resolvable so any
    // link shared before the rename still lands on the article.
    return [
      { source: "/playbook", destination: "/learning", permanent: true },
      { source: "/playbook/:slug", destination: "/learning/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
