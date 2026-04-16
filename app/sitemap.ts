import { MetadataRoute } from "next";

const BASE_URL = "https://sardhahab.com";

const pages = [
  // Core pages
  { path: "",                                                                           cf: "hourly"  as const, p: 1.0 },
  { path: "/%D8%A7%D8%B3%D8%B9%D8%A7%D8%B1",                                          cf: "hourly"  as const, p: 0.9 },
  { path: "/%D8%AD%D8%A7%D8%B3%D8%A8%D8%A9-%D8%A7%D9%84%D8%B0%D9%87%D8%A8",          cf: "daily"   as const, p: 0.9 },
  { path: "/%D8%A7%D8%AE%D8%A8%D8%A7%D8%B1",                                          cf: "hourly"  as const, p: 0.8 },
  { path: "/%D8%AA%D9%86%D8%A8%D9%8A%D9%87%D8%A7%D8%AA",                              cf: "monthly" as const, p: 0.7 },
  // Articles
  { path: "/%D9%85%D9%82%D8%A7%D9%84%D8%A7%D8%AA",                                    cf: "weekly"  as const, p: 0.8 },
  { path: "/%D9%85%D9%82%D8%A7%D9%84%D8%A7%D8%AA/%D9%85%D8%A7-%D9%8A%D8%A4%D8%AB%D8%B1-%D8%B9%D9%84%D9%89-%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B0%D9%87%D8%A8", cf: "monthly" as const, p: 0.7 },
  { path: "/%D9%85%D9%82%D8%A7%D9%84%D8%A7%D8%AA/%D8%B9%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D8%B0%D9%87%D8%A8",                                        cf: "monthly" as const, p: 0.7 },
  { path: "/%D9%85%D9%82%D8%A7%D9%84%D8%A7%D8%AA/%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%AB%D9%85%D8%A7%D8%B1-%D9%81%D9%8A-%D8%A7%D9%84%D8%B0%D9%87%D8%A8",       cf: "monthly" as const, p: 0.7 },
  { path: "/%D9%85%D9%82%D8%A7%D9%84%D8%A7%D8%AA/%D8%B2%D9%83%D8%A7%D8%A9-%D8%A7%D9%84%D8%B0%D9%87%D8%A8",                                                    cf: "monthly" as const, p: 0.7 },
  // Country pages
  { path: "/%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B0%D9%87%D8%A8-%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9",  cf: "hourly"  as const, p: 0.9 },
  { path: "/%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B0%D9%87%D8%A8-%D8%A7%D9%84%D8%A7%D9%85%D8%A7%D8%B1%D8%A7%D8%AA",  cf: "hourly"  as const, p: 0.9 },
  { path: "/%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B0%D9%87%D8%A8-%D8%A7%D9%84%D9%83%D9%88%D9%8A%D8%AA",              cf: "hourly"  as const, p: 0.8 },
  { path: "/%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B0%D9%87%D8%A8-%D9%85%D8%B5%D8%B1",                                cf: "hourly"  as const, p: 0.8 },
  { path: "/%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B0%D9%87%D8%A8-%D9%82%D8%B7%D8%B1",                                cf: "hourly"  as const, p: 0.8 },
  { path: "/%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B0%D9%87%D8%A8-%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%D9%8A%D9%86",       cf: "hourly"  as const, p: 0.8 },
  // سعر الذهب بالعملات العربية الإضافية
  { path: "/%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B0%D9%87%D8%A8-%D8%A7%D9%84%D8%A7%D8%B1%D8%AF%D9%86",             cf: "hourly"  as const, p: 0.8 },
  { path: "/%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B0%D9%87%D8%A8-%D8%A7%D9%84%D9%85%D8%BA%D8%B1%D8%A8",             cf: "hourly"  as const, p: 0.8 },
  { path: "/%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B0%D9%87%D8%A8-%D8%A7%D9%84%D8%B9%D8%B1%D8%A7%D9%82",             cf: "hourly"  as const, p: 0.8 },
  { path: "/%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B0%D9%87%D8%A8-%D8%B9%D9%85%D8%A7%D9%86",                         cf: "hourly"  as const, p: 0.8 },
  { path: "/%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B0%D9%87%D8%A8-%D9%84%D9%8A%D8%A8%D9%8A%D8%A7",                   cf: "hourly"  as const, p: 0.8 },
  { path: "/%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B0%D9%87%D8%A8-%D8%AA%D9%88%D9%86%D8%B3",                         cf: "hourly"  as const, p: 0.8 },
  { path: "/%D8%B3%D8%B9%D8%B1-%D8%A7%D9%84%D8%B0%D9%87%D8%A8-%D8%A7%D9%84%D8%AC%D8%B2%D8%A7%D8%A6%D8%B1",      cf: "hourly"  as const, p: 0.8 },
  // Static pages
  { path: "/%D9%85%D9%86-%D9%86%D8%AD%D9%86",                                          cf: "monthly" as const, p: 0.5 },
  { path: "/%D8%A5%D8%AE%D9%84%D8%A7%D8%A1-%D9%85%D8%B3%D8%A4%D9%88%D9%84%D9%8A%D8%A9", cf: "yearly" as const, p: 0.3 },
  { path: "/%D8%B4%D8%B1%D9%88%D8%B7-%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%AE%D8%AF%D8%A7%D9%85", cf: "yearly" as const, p: 0.3 },
  { path: "/%D8%B3%D9%8A%D8%A7%D8%B3%D8%A9-%D8%A7%D9%84%D8%AE%D8%B5%D9%88%D8%B5%D9%8A%D8%A9", cf: "yearly" as const, p: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, cf, p }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: cf,
    priority: p,
  }));
}
