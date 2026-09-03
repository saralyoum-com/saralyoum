import { MetadataRoute } from "next";

// Block internal ASCII routes — only Arabic-slug canonicals should be indexed
// /gold/ = country pages, /zakat-crypto|bitcoin-price|ethereum-price = ASCII routes
// /اخبار? blocks query-param variants (?q=...) of the news page — only /اخبار (clean) is indexed
// /_next/static/media/ blocks font files (crawl budget) — CSS/JS must NOT be blocked
// per Google: "Don't block CSS and JavaScript files from crawlers"
const DISALLOW = [
  "/api/",
  "/gold/",
  "/zakat-crypto",
  "/bitcoin-price",
  "/ethereum-price",
  "/prices",
  "/gold-analysis",
  "/radar",
  "/اخبار?",
  "/_next/static/media/",
];

const SOCIAL_BOTS = [
  "Twitterbot", "facebookexternalhit", "WhatsApp", "TelegramBot",
  "LinkedInBot", "Slackbot-LinkExpanding", "Discordbot",
];

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "PerplexityBot",
  "Claude-Web",
  "anthropic-ai",
  "Google-Extended",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "cohere-ai",
  "CCBot",
  "Amazonbot",
  "Applebot",
  "Applebot-Extended",
  "Bytespider",
];

// AdSense + Ad quality crawlers — MUST have full access for ads.txt verification
// and ad serving. Otherwise AdSense shows "Ads.txt: Not found" or "Site needs review"
const AD_BOTS = [
  "Mediapartners-Google", // AdSense crawler (reads ads.txt + page content)
  "AdsBot-Google",         // Ad quality crawler
  "AdsBot-Google-Mobile",  // Mobile ad quality crawler
  "Googlebot",             // Main Google crawler (also reads ads.txt)
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule for all crawlers
      // /api/og is allowed here for Google, which applies longest-match. Do not
      // rely on this for social crawlers — they use simpler parsers and honour
      // the broad `Disallow: /api/`. Share images are served from /og.png,
      // which no Disallow touches, and the crawlers are also allowed below.
      {
        userAgent: "*",
        allow: ["/", "/api/og", "/ads.txt"],
        disallow: DISALLOW,
      },
      // Explicitly allow AdSense + Ad quality bots full access to everything
      // (overrides the broad disallows for these specific crawlers)
      ...AD_BOTS.map((bot) => ({
        userAgent: bot,
        allow: "/",
      })),
      // Explicitly welcome all major AI crawlers with no restrictions
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        allow: "/",
      })),
      // Social link-preview crawlers. Without these the share card renders
      // with no image at all, which is what happened on X.
      ...SOCIAL_BOTS.map((bot) => ({
        userAgent: bot,
        allow: "/",
      })),
    ],
    sitemap: "https://sardhahab.com/sitemap.xml",
    host: "https://sardhahab.com",
  };
}
