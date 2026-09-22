import type { Metadata } from "next";
import { categories, isBlogConfigured, listPosts } from "@/lib/blog";
import { BLOG_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Market structure, trading systems, indicator design, agentic trading and engineering notes.",
};

export default async function BlogPage() {
  const posts = await listPosts();
  const configured = isBlogConfigured();

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Blog</p>
        <h1>Notes on market structure.</h1>
        <p className="hero-copy">
          Trading systems, indicator design, agentic trading and the
          engineering behind them.
        </p>
      </section>

      <section className="block">
        {posts.length > 0 ? (
          <>
            <div className="filter-row">
              <span className="is-current">All</span>
              {categories.map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
            <div className="post-list">
              {posts.map((post) => (
                <article key={post.slug}>
                  <h2>
                    <a
                      href={post.url}
                      {...(post.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {post.title}
                      {post.external ? <span aria-hidden="true"> ↗</span> : null}
                    </a>
                  </h2>
                  {post.dek ? <p>{post.dek}</p> : null}
                  <p className="post-meta">
                    {post.category ? `${post.category} · ` : ""}
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">Published on Substack</p>
            {configured ? (
              <>
                <p>
                  Posts are written and distributed on Substack. This page will
                  list them here once the feed is connected — until then, read
                  them at the source.
                </p>
                <a
                  className="button button-primary"
                  href={BLOG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the Blog on Substack <span aria-hidden="true">↗</span>
                </a>
              </>
            ) : (
              <p>
                The publication is being set up. Nothing is published yet, so
                there is nothing to link to.
              </p>
            )}
          </div>
        )}
      </section>
    </>
  );
}
