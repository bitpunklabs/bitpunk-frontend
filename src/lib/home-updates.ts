import { destinations } from "./showcase";
import type { PlatformName } from "@/components/platform-icon";
import { substackPostEmbed, tradingViewIdeaEmbed, xPostEmbed, type PostEmbed } from "./post-embeds";

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
  posts: readonly HomePost[];
  timeline?: Extract<PostEmbed, { provider: "x-timeline" }>;
  emptyMessage?: string;
};

/** Launch previews only. Replace with published entries when the channels are ready. */
export const homeUpdates: readonly HomeUpdate[] = [
  {
    id: "x", platform: "X", category: "Market notes",
    title: "Notes from the market.",
    summary: "Charts, ideas and observations as markets unfold.",
    href: destinations.x, action: "Follow on X",
    posts: [
      {
        id: "x-context", category: "Chart note", artwork: "context",
        embed: xPostEmbed(process.env.NEXT_PUBLIC_X_POST_URL),
        title: "The move is only part of the picture.",
        summary: "Read the trend, nearby price levels and what could change your view.",
        body: ["Look at the whole chart before forming a view. Note what supports the idea and what would make you reconsider.", "Sample market note."],
      },
      {
        id: "x-question", category: "Field note",
        title: "Keep the question open.",
        summary: "Write down what you see and what could change your mind.",
        body: ["Keep observations separate from assumptions. A clear note makes an idea easier to revisit.", "Sample market note."],
      },
    ],
  },
  {
    id: "substack", platform: "Substack", category: "Research",
    title: "Room for another view.",
    summary: "Deeper reads on markets and the ideas behind a view.",
    href: destinations.substack, action: "Read on Substack",
    posts: [
      {
        id: "substack-context", category: "Research", artwork: "essay",
        embed: substackPostEmbed(process.env.NEXT_PUBLIC_SUBSTACK_POST_URL),
        title: "Context before conviction.",
        summary: "A closer look at price, trends and the reasons behind a market view.",
        body: ["Begin with the chart. Explain your view, consider other possibilities and describe what would change your mind.", "Sample research essay."],
      },
      {
        id: "substack-method", category: "Methods",
        title: "From chart to research note.",
        summary: "Turn a chart observation into a clear, testable idea.",
        body: ["Describe what you see, why it matters and what you still need to learn.", "Sample research essay."],
      },
    ],
  },
  {
    id: "tradingview", platform: "TradingView", category: "Chart studies",
    title: "Ideas, on the chart.",
    summary: "Indicators and open studies to explore on your charts.",
    href: destinations.tradingview, action: "View on TradingView",
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
        id: "tradingview-studies", category: "Open studies", artwork: "structure",
        embed: tradingViewIdeaEmbed(process.env.NEXT_PUBLIC_TRADINGVIEW_IDEA_URL, process.env.NEXT_PUBLIC_TRADINGVIEW_IDEA_EMBED_URL),
        title: "Ideas, made open.",
        summary: "Open tools for exploring trends, pullbacks and price behaviour.",
        body: ["Chart studies you can inspect, test and adapt. Explore the collection on TradingView.", "Collection preview."],
      },
    ],
  },
];
