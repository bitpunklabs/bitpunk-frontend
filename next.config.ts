import type { NextConfig } from "next";

// Content images live in the Supabase Storage bucket of the configured project.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
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
