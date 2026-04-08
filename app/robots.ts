import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://saralyoum.vercel.app/sitemap.xml",
    host: "https://saralyoum.vercel.app",
  };
}
