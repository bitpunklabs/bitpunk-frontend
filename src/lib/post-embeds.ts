export type PostEmbed =
  | { provider: "x"; url: string; postId: string }
  | { provider: "x-timeline"; url: string; screenName: string }
  | { provider: "substack"; url: string; frameUrl: string }
  | { provider: "tradingview"; url: string; frameUrl: string };

function httpsUrl(value: string | undefined) {
  try {
    const url = new URL(value ?? "");
    return url.protocol === "https:" && !url.username && !url.password ? url : null;
  } catch { return null; }
}

export function xProfileEmbed(value: string | undefined): Extract<PostEmbed, { provider: "x-timeline" }> | undefined {
  const url = httpsUrl(value);
  if (!url || !["x.com", "www.x.com", "twitter.com", "www.twitter.com"].includes(url.hostname)) return;
  const screenName = url.pathname.match(/^\/([A-Za-z0-9_]{1,15})\/?$/)?.[1];
  if (!screenName || /^(home|explore|search|notifications|messages|settings|intent|share|i)$/i.test(screenName)) return;
  return { provider: "x-timeline", url: `https://x.com/${screenName}`, screenName };
}

export function xPostEmbed(value: string | undefined): PostEmbed | undefined {
  const url = httpsUrl(value);
  if (!url || !["x.com", "www.x.com", "twitter.com", "www.twitter.com"].includes(url.hostname)) return;
  const match = url.pathname.match(/^\/([A-Za-z0-9_]+)\/status\/(\d+)\/?$/);
  if (!match) return;
  return { provider: "x", url: `https://x.com/${match[1]}/status/${match[2]}`, postId: match[2] };
}

/** The iframe endpoint is the one produced by Substack's official embed.js. */
export function substackPostEmbed(value: string | undefined): PostEmbed | undefined {
  const url = httpsUrl(value);
  const slug = url?.pathname.match(/^\/p\/([A-Za-z0-9_-]+)\/?$/)?.[1];
  if (!url || !slug) return;
  return { provider: "substack", url: `${url.origin}/p/${slug}`, frameUrl: `${url.origin}/embed/p/${slug}` };
}

/** Keep the exact iframe URL from the Idea's official embed code. Not a script URL. */
export function tradingViewIdeaEmbed(postUrl: string | undefined, iframeUrl: string | undefined): PostEmbed | undefined {
  const url = httpsUrl(postUrl), frame = httpsUrl(iframeUrl);
  if (!url || !frame || !["www.tradingview.com", "tradingview.com"].includes(url.hostname)
    || !["www.tradingview.com", "tradingview.com"].includes(frame.hostname)
    || !/^\/chart\/[^/]+\/[^/]+\/?$/.test(url.pathname)
    || !/^\/embed\/[A-Za-z0-9]{8}\/?$/.test(frame.pathname)) return;
  return { provider: "tradingview", url: url.href, frameUrl: frame.href };
}
