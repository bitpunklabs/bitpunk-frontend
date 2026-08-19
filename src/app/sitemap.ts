import type { MetadataRoute } from "next";
import { getPublicPosts } from "@/lib/content-repository";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const posts = await getPublicPosts();
  return ["", "/learning", "/blog", "/pricing", "/about"]
    .map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date() }))
    .concat(posts.map((post) => ({ url: `${baseUrl}/${post.kind}/${post.slug}`, lastModified: new Date(post.publishedAt) })));
}
