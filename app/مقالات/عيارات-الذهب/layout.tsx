import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "دليل عيارات الذهب — الفرق بين عيار 24 و22 و21 و18",
  description: "شرح مبسط لعيارات الذهب المختلفة وكيف تؤثر على السعر والجودة والاستخدام — مع جدول مقارنة شامل.",
  keywords: ["عيارات الذهب", "الفرق بين عيار 21 و18", "ذهب عيار 24", "نقاء الذهب", "عيار الذهب"],
  openGraph: { title: "دليل عيارات الذهب — 24K و21K و18K | سعر الذهب", description: "الفرق بين عيارات الذهب بشكل مبسط مع جدول مقارنة.", type: "article" },
  alternates: { canonical: "https://sardhahab.com/مقالات/عيارات-الذهب" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
