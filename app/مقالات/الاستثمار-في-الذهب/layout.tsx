import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "كيف تستثمر في الذهب؟ — دليل المبتدئين الشامل",
  description: "دليل شامل لطرق الاستثمار في الذهب: سبائك، مجوهرات، ETF، وعقود الفيوتشر — مع مقارنة بين المزايا والمخاطر.",
  keywords: ["الاستثمار في الذهب", "شراء الذهب", "سبائك الذهب", "صناديق الذهب ETF", "كيف أستثمر في الذهب"],
  openGraph: { title: "كيف تستثمر في الذهب؟ — دليل المبتدئين | سعر الذهب", description: "مقارنة شاملة بين طرق الاستثمار في الذهب للمبتدئين.", type: "article" },
  alternates: { canonical: "https://sardhahab.com/مقالات/الاستثمار-في-الذهب" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
