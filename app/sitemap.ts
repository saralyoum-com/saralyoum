import { MetadataRoute } from "next";

const BASE_URL = "https://sardhahab.com";

// URLs must be percent-encoded for Google to fetch the sitemap correctly
const pages = [
  { path: "",             changeFrequency: "hourly"  as const, priority: 1.0 },
  { path: "/%D8%A7%D8%B3%D8%B9%D8%A7%D8%B1",               changeFrequency: "hourly"  as const, priority: 0.9 }, // /اسعار
  { path: "/%D8%AD%D8%A7%D8%B3%D8%A8%D8%A9-%D8%A7%D9%84%D8%B0%D9%87%D8%A8", changeFrequency: "daily" as const, priority: 0.9 }, // /حاسبة-الذهب
  { path: "/%D8%A7%D8%AE%D8%A8%D8%A7%D8%B1",               changeFrequency: "hourly"  as const, priority: 0.8 }, // /اخبار
  { path: "/%D8%AA%D9%86%D8%A8%D9%8A%D9%87%D8%A7%D8%AA",   changeFrequency: "monthly" as const, priority: 0.7 }, // /تنبيهات
  { path: "/%D9%85%D9%86-%D9%86%D8%AD%D9%86",              changeFrequency: "monthly" as const, priority: 0.5 }, // /من-نحن
  { path: "/%D8%A5%D8%AE%D9%84%D8%A7%D8%A1-%D9%85%D8%B3%D8%A4%D9%88%D9%84%D9%8A%D8%A9", changeFrequency: "yearly" as const, priority: 0.3 }, // /إخلاء-مسؤولية
  { path: "/%D8%B4%D8%B1%D9%88%D8%B7-%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%AE%D8%AF%D8%A7%D9%85", changeFrequency: "yearly" as const, priority: 0.3 }, // /شروط-الاستخدام
  { path: "/%D8%B3%D9%8A%D8%A7%D8%B3%D8%A9-%D8%A7%D9%84%D8%AE%D8%B5%D9%88%D8%B5%D9%8A%D8%A9", changeFrequency: "yearly" as const, priority: 0.3 }, // /سياسة-الخصوصية
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
