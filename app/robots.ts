import { MetadataRoute } from "next";

// Block internal ASCII routes — only Arabic-slug canonicals should be indexed
// /gold/ = country pages, /zakat-crypto|bitcoin-price|ethereum-price = other pages
const DISALLOW = ["/api/", "/gold/", "/zakat-crypto", "/bitcoin-price", "/ethereum-price", "/_next/static/media/", "/_next/static/chunks/", "/_next/static/css/"];

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

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule for all crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      // Explicitly welcome all major AI crawlers with no restrictions
      ...AI_BOTS.map((bot) => ({
        userAgent: bot,
        allow: "/",
      })),
    ],
    sitemap: "https://sardhahab.com/sitemap.xml",
    host: "https://sardhahab.com",
  };
}
