import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/gold/", "/_next/static/media/"],
      },
    ],
    sitemap: "https://sardhahab.com/sitemap.xml",
    host: "https://sardhahab.com",
  };
}
