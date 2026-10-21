import { destinations } from "./showcase";

export type ResearchChannel = {
  id: "x" | "substack" | "github";
  platform: "X" | "Substack" | "GitHub";
  description: string;
  detail: string;
  name: string;
  handle?: string;
  bio: string;
  topics: readonly string[];
  action: string;
  href: string | null;
  status: "building" | "live";
};

// Add the final profile details here, then set its status to "live".
// A configured URL alone does not publish an unfinished Research channel.
export const researchChannels: readonly ResearchChannel[] = [
  {
    id: "x",
    platform: "X",
    description: "Charts, market notes and ideas as they develop.",
    detail: "A closer look at what stands out, what could change the view and what to watch next.",
    name: "Bitpunk",
    bio: "An independent perspective on markets.",
    topics: ["Charts", "Market notes", "Ideas"],
    action: "Follow on X",
    href: destinations.x,
    status: "building",
  },
  {
    id: "substack",
    platform: "Substack",
    description: "Deeper reads to market context.",
    detail: "More room for the reasoning behind a market view, the scenarios worth considering and the evidence that could change the picture.",
    name: "Bitpunk",
    bio: "Market research, with room to go deeper.",
    topics: ["Research", "Essays", "Market context"],
    action: "Read on Substack",
    href: destinations.substack,
    status: "building",
  },
  {
    id: "github",
    platform: "GitHub",
    description: "Open-source projects and shared tools to explore and build on.",
    detail: "Explore practical tools and small experiments. Read the code, test an idea and adapt it to your own workflow.",
    name: "Bitpunk Labs",
    handle: "bitpunklabs",
    bio: "Research tools, shared openly.",
    topics: ["Open source", "Shared tools", "Experiments"],
    action: "Explore on GitHub",
    href: destinations.github,
    status: "building",
  },
];
