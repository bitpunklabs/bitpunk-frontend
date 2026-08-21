import type { Metadata } from "next";
import { BlogFeatured } from "@/components/blog/blog-featured";
import { BlogStreamItem } from "@/components/blog/blog-stream-item";
import { NewsletterForm } from "@/components/blog/newsletter-form";
import { TagFilter } from "@/components/blog/tag-filter";
import { getBlogStream, getBlogTags } from "@/lib/content-repository";

export const metadata: Metadata = {
  title: "Blog",
  description: "Public Bitpunk product notes and research articles.",
  alternates: { canonical: "/blog", types: { "application/rss+xml": "/blog/rss.xml" } },
};

// The tag and the keyset cursor live in the query string, so this page is
// rendered per request. Article pages keep their ISR window.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

function nextPageHref(cursor: string, tag?: string) {
  const params = new URLSearchParams(tag ? { tag, cursor } : { cursor });
  return `/blog?${params.toString()}`;
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ tag?: string; cursor?: string }> }) {
  const { tag, cursor } = await searchParams;
  const [{ posts, nextCursor }, tags] = await Promise.all([
    getBlogStream({ tag, cursor, limit: PAGE_SIZE }),
    getBlogTags(),
  ]);

  // The featured slot only makes sense on the unfiltered first page.
  const isFirstPage = !cursor && !tag;
  const featured = isFirstPage ? posts[0] : undefined;
  const stream = featured ? posts.slice(1) : posts;

  return (
    <section className="page-section blog-home">
      <header className="blog-home-header">
        <p className="eyebrow">Blog</p>
        <h1>Public notes from Bitpunk.</h1>
        <p className="lead">Product thinking, research notes, and updates for systematic traders.</p>
        <NewsletterForm />
      </header>

      {featured ? <BlogFeatured post={featured} /> : null}

      <TagFilter tags={tags} activeTag={tag} />

      {stream.length ? (
        <div className="blog-stream">
          {stream.map((post) => (
            <BlogStreamItem key={post.slug} post={post} />
          ))}
        </div>
      ) : null}

      {posts.length ? null : (
        <p className="blog-empty">{tag ? "No posts carry this tag yet." : "No posts published yet."}</p>
      )}

      {nextCursor ? (
        <a className="button button-secondary blog-more" href={nextPageHref(nextCursor, tag)}>
          Older posts
        </a>
      ) : null}
    </section>
  );
}
