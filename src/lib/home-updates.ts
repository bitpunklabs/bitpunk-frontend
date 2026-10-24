import { destinations } from "./showcase";
import type { PlatformName } from "@/components/platform-icon";
import { substackPostEmbed, tradingViewIdeaEmbed, xPostEmbed, type PostEmbed } from "./post-embeds";
import { platformProfiles } from "./research";

export type HomeChartImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  ticker: string;
  timeframe: string;
};

export type HomePost = {
  id: string;
  category: string;
  title: string;
  summary: string;
  body: readonly string[];
  artwork?: "context" | "essay" | "alpha" | "structure";
  href?: string;
  published?: boolean;
  embed?: PostEmbed;
  imageUrl?: string;
  imageAlt?: string;
  chart?: HomeChartImage;
  author?: string;
  publishedAt?: string;
};

export type HomeUpdate = {
  id: string;
  platform: PlatformName;
  category: string;
  title: string;
  summary: string;
  href: string | null;
  action: string;
  profile: { name: string; handle: string; bio: string };
  posts: readonly HomePost[];
  timeline?: Extract<PostEmbed, { provider: "x-timeline" }>;
  emptyMessage?: string;
};

function selectedPost(platform: string, embed: PostEmbed | undefined): HomePost[] {
  return embed ? [{
    id: `${platform}-selected`, category: "Selected post", title: `On ${platform}`,
    summary: "", body: [], published: true, href: embed.url, embed,
  }] : [];
}

/** Confirmed profiles, automatic feeds and curated TradingView studies. */
export const homeUpdates: readonly HomeUpdate[] = [
  {
    id: "x", platform: "X", category: "Market notes",
    title: "Notes from the market.",
    summary: "Charts, ideas and observations as markets unfold.",
    href: destinations.x, action: "Follow on X", profile: platformProfiles.x,
    posts: selectedPost("X", xPostEmbed(process.env.NEXT_PUBLIC_X_POST_URL)),
  },
  {
    id: "substack", platform: "Substack", category: "Research",
    title: "Room for another view.",
    summary: "Deeper reads on markets and the ideas behind a view.",
    href: destinations.substack, action: "Follow on Substack", profile: platformProfiles.substack,
    posts: selectedPost("Substack", substackPostEmbed(process.env.NEXT_PUBLIC_SUBSTACK_POST_URL)),
  },
  {
    id: "tradingview", platform: "TradingView", category: "Chart studies",
    title: "Ideas, on the chart.",
    summary: "Indicators and open studies to explore on your charts.",
    href: destinations.tradingview, action: "View on TradingView", profile: platformProfiles.tradingview,
    posts: [
      {
        id: "tradingview-alpha", category: "Indicator", artwork: "alpha",
        published: true,
        title: "The bitpunk.alpha indicator",
        summary: "Momentum, Trend and Market Structure, in one view.",
        body: ["Read a move's strength, follow its direction and see nearby support and resistance. Explore Alpha's three dimensions in Indicators."],
        href: "https://www.tradingview.com/script/SGxnp5Zk/",
      },
      {
        id: "tradingview-studies", category: "Open-source collection", artwork: "structure",
        published: true,
        href: new URL("#published-scripts", destinations.tradingview).href,
        embed: tradingViewIdeaEmbed(process.env.NEXT_PUBLIC_TRADINGVIEW_IDEA_URL, process.env.NEXT_PUBLIC_TRADINGVIEW_IDEA_EMBED_URL),
        title: "Open-source chart studies.",
        summary: "Open-source technical analysis across price-action, momentum, volume and volatility.",
        body: ["Chart studies you can inspect, test and adapt. Explore the collection on TradingView."],
      },
    ],
  },
];
