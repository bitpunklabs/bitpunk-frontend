import assert from "node:assert/strict";
import { parseSubstackFeed, fetchSubstackPosts, substackFeedUrl } from "../src/lib/substack-rss.ts";
import { xProfileEmbed } from "../src/lib/post-embeds.ts";

// A small offline contract check for external content. No real account or posts.
const item = (slug, date, extra = "") => `<item><title>${slug} &amp; context</title><link>https://publication.example/p/${slug}</link><pubDate>${date}</pubDate><description><![CDATA[<p>A public <b>excerpt</b> &amp; context.</p>]]></description>${extra}</item>`;
const xml = `<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>Fixture publication</title>
${item("older", "19 Oct 2026 12:00:00 GMT")}
${item("newest", "20 Oct 2026 12:00:00 GMT", '<dc:creator>Fixture author</dc:creator><enclosure url="https://images.example/cover.jpg" type="image/jpeg"/>')}
${item("newest", "20 Oct 2026 12:00:00 GMT")}
${item("oldest", "18 Oct 2026 12:00:00 GMT")}
${item("fourth", "17 Oct 2026 12:00:00 GMT")}
<item><title>Unsafe link</title><link>javascript:alert(1)</link></item>
</channel></rss>`;
const posts = await parseSubstackFeed(xml);
assert.deepEqual(posts.map(post => post.title), ["newest & context", "older & context", "oldest & context"]);
assert.equal(posts[0].summary, "A public excerpt & context.");
assert.equal(posts[0].author, "Fixture author");
assert.equal(posts[0].imageUrl, "https://images.example/cover.jpg");
assert.equal(posts[0].publishedAt, "2026-10-20T12:00:00.000Z");
assert.deepEqual(posts[0].body, []);
assert.equal(await substackFeedUrl("https://publication.example/"), "https://publication.example/feed");
assert.equal(substackFeedUrl("https://publication.example/", "https://feed.example/articles.xml"), "https://feed.example/articles.xml");
assert.deepEqual(await parseSubstackFeed('<rss version="2.0"><channel><title>Empty</title></channel></rss>'), []);
await assert.rejects(parseSubstackFeed("<html>Not an RSS feed</html>"));
await assert.rejects(parseSubstackFeed('<!DOCTYPE rss [<!ENTITY x "x">]><rss/>'));
await assert.rejects(fetchSubstackPosts("https://publication.example/feed", async () => new Response("Unavailable", { status: 503 })));
await assert.rejects(fetchSubstackPosts("https://publication.example/feed", async () => { throw new Error("Offline"); }));
assert.equal((await fetchSubstackPosts("https://publication.example/feed", async (_url, options) => {
  assert.equal(options.cache, "no-store");
  assert.ok(options.signal);
  return new Response(xml);
})).length, 3);
assert.deepEqual(xProfileEmbed("https://twitter.com/fixture_user"), { provider: "x-timeline", screenName: "fixture_user", url: "https://x.com/fixture_user" });
assert.equal(xProfileEmbed("https://x.com/home"), undefined);
assert.equal(xProfileEmbed("https://x.com/fixture/status/123"), undefined);
assert.equal(xProfileEmbed(undefined), undefined);
console.log("PASS: RSS metadata, ordering, deduplication, safe links, empty/error recovery and X profile configuration.");
