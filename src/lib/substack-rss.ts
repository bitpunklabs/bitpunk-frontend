import Parser from "rss-parser";
import type { HomePost } from "./home-updates";

type RssExtras = {
  subtitle?: string;
  "content:encoded"?: string;
  "content:encodedSnippet"?: string;
};
const parser = new Parser<Record<string, never>, RssExtras>({ customFields: { item: ["subtitle"] } });

function httpsLink(value: string | undefined) {
  try {
    const url = new URL(value ?? "");
    if (url.protocol !== "https:" || url.username || url.password) return;
    url.hash = "";
    return url.href;
  } catch { return; }
}

/** Public article metadata only. No feed HTML is rendered or sent to the client. */
export async function parseSubstackFeed(xml: string): Promise<HomePost[]> {
  if (xml.length > 5_000_000 || /<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error("Unsupported RSS document");
  const feed = await parser.parseString(xml);
  const seen = new Set<string>();
  return feed.items.flatMap(item => {
    const href = httpsLink(item.link);
    const title = item.title?.trim();
    if (!href || !title || seen.has(href)) return [];
    seen.add(href);
    const rawSummary = item.subtitle || item.contentSnippet || item["content:encodedSnippet"] || "";
    const summary = rawSummary.replace(/\s+/g, " ").trim();
    const markup = item["content:encoded"] || item.content || "";
    const inlineImage = markup.match(/<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/i)?.[1]?.replaceAll("&amp;", "&");
    const enclosure = item.enclosure?.type?.startsWith("image/") ? item.enclosure.url : undefined;
    const timestamp = Date.parse(item.isoDate || item.pubDate || "");
    return [{
      id: `substack-${href}`, category: "Research", title: title.slice(0, 240),
      summary: summary.length > 240 ? `${summary.slice(0, 237).trimEnd()}…` : summary,
      href, published: true, body: [],
      imageUrl: httpsLink(enclosure) || httpsLink(inlineImage),
      author: item.creator?.trim().slice(0, 80),
      publishedAt: Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : undefined,
    } satisfies HomePost];
  }).sort((a, b) => (Date.parse(b.publishedAt || "") || 0) - (Date.parse(a.publishedAt || "") || 0)).slice(0, 3);
}

export function substackFeedUrl(publication: string, override?: string) {
  const url = httpsLink(override || new URL("/feed", publication).href);
  if (!url) throw new Error("Substack RSS needs an HTTPS publication URL");
  return url;
}

export async function fetchSubstackPosts(feedUrl: string, request: typeof fetch = fetch) {
  const response = await request(feedUrl, {
    cache: "no-store", signal: AbortSignal.timeout(6000),
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
  });
  if (!response.ok) throw new Error(`RSS returned ${response.status}`);
  return parseSubstackFeed(await response.text());
}
