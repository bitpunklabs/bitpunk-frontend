import "server-only";
import { unstable_cache } from "next/cache";
import { homeUpdates, type HomeUpdate } from "./home-updates";
import { destinations } from "./showcase";
import { xProfileEmbed } from "./post-embeds";
import { fetchSubstackPosts, substackFeedUrl } from "./substack-rss";
import { getOpenSourceScreenshots } from "./scene-assets";

// Cache the validated result, not the raw XML. Revalidation failures leave the
// previous successful value intact; no local files, polling process or database.
const cachedSubstackPosts = unstable_cache(fetchSubstackPosts, ["home-substack-rss-v1"], { revalidate: 1800 });

export async function getHomeUpdates(): Promise<readonly HomeUpdate[]> {
  const timeline = xProfileEmbed(destinations.x ?? undefined);
  const pullbackReclaim = getOpenSourceScreenshots().find(slide => slide.id === "pullback-reclaim");
  return Promise.all(homeUpdates.map(async channel => {
    if (channel.id === "x" && timeline && !channel.posts.length) return { ...channel, timeline, posts: [] };
    if (channel.id === "tradingview" && pullbackReclaim) return {
      ...channel,
      posts: channel.posts.map(post => post.id === "tradingview-studies"
        ? { ...post, chart: {
          src: pullbackReclaim.src, alt: pullbackReclaim.alt,
          width: pullbackReclaim.width, height: pullbackReclaim.height,
          ticker: "BTC", timeframe: pullbackReclaim.meta || "4H",
        } }
        : post),
    };
    if (channel.id !== "substack") return channel;
    try {
      const feedUrl = substackFeedUrl(destinations.substackPublication, process.env.SUBSTACK_RSS_URL);
      const posts = await cachedSubstackPosts(feedUrl);
      return { ...channel, posts: posts.length ? posts : channel.posts, emptyMessage: "New essays will appear here." };
    } catch {
      // On first deployment there may be no previous cache. Keep the rest of
      // the site available and offer the real publication link instead.
      return { ...channel, emptyMessage: "Explore the publication on Substack." };
    }
  }));
}
