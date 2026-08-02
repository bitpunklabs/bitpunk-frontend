import type { Metadata } from "next";
import { ContentIndex } from "@/components/content-index";
import { getPublicPosts } from "@/lib/content-repository";

export const metadata: Metadata = { title: "Blog", description: "Public Bitpunk product notes and research articles." };
export const revalidate = 300;

export default async function BlogPage() {
  return <ContentIndex eyebrow="Blog" title="Public notes from Bitpunk." lead="Product thinking, research notes, and updates for systematic traders." posts={await getPublicPosts("blog")} />;
}
