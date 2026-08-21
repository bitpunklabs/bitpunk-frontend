import type { Metadata } from "next";
import type { ContentPost } from "@/lib/content";

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function buildArticleMetadata(post: ContentPost): Metadata {
  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const canonical = `/${post.kind}/${post.slug}`;
  const images = post.coverImagePath?.startsWith("http") ? [post.coverImagePath] : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonical,
      publishedTime: post.publishedAt || undefined,
      images,
    },
  };
}

export function buildArticleJsonLd(post: ContentPost) {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    datePublished: post.publishedAt || undefined,
    author: post.author ? { "@type": "Person", name: post.author } : undefined,
    keywords: post.tags?.map(({ name }) => name).join(", ") || undefined,
    mainEntityOfPage: new URL(`/${post.kind}/${post.slug}`, siteUrl).toString(),
    publisher: {
      "@type": "Organization",
      name: "Bitpunk",
      url: siteUrl,
    },
  };
}
