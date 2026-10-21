import "server-only";
import { unstable_cache } from "next/cache";
import { homeUpdates, type HomeUpdate } from "./home-updates";
import { destinations } from "./showcase";
import { xProfileEmbed } from "./post-embeds";
import { fetchSubstackPosts, substackFeedUrl } from "./substack-rss";

// Cache the validated result, not the raw XML. Revalidation failures leave the
// previous successful value intact; no local files, polling process or database.
const cachedSubstackPosts = unstable_cache(fetchSubstackPosts, ["home-substack-rss-v1"], { revalidate: 1800 });

export async function getHomeUpdates(): Promise<readonly HomeUpdate[]> {
  const timeline = xProfileEmbed(destinations.x ?? undefined);
  return Promise.all(homeUpdates.map(async channel => {
    if (channel.id === "x" && timeline) return { ...channel, timeline, posts: [] };
    if (channel.id !== "substack" || !destinations.substack) return channel;
    try {
      const feedUrl = substackFeedUrl(destinations.substack, process.env.SUBSTACK_RSS_URL);
      const posts = await cachedSubstackPosts(feedUrl);
      return { ...channel, posts, emptyMessage: "New essays will appear here." };
    } catch {
      // On first deployment there may be no previous cache. Keep the rest of
      // the site available and offer the real publication link instead.
      return { ...channel, posts: [], emptyMessage: "Read the latest essays on Substack." };
    }
  }));
}
