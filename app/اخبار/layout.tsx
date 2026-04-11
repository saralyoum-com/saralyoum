import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الأخبار الاقتصادية",
  description:
    "آخر أخبار الأسواق المالية والذهب والعملات الرقمية والاقتصاد العربي والعالمي من مصادر موثوقة مثل BBC عربي والجزيرة ورويترز.",
  keywords: [
    "أخبار الذهب",
    "أخبار البيتكوين",
    "أخبار الأسواق المالية",
    "أخبار اقتصادية",
    "أخبار العملات",
    "الاقتصاد العربي",
    "gold news",
    "bitcoin news",
    "financial news",
  ],
  openGraph: {
    title: "الأخبار الاقتصادية — سعر اليوم",
    description: "آخر أخبار الأسواق والذهب والعملات من BBC عربي والجزيرة ورويترز",
    type: "website",
  },
  alternates: {
    canonical: "https://sardhahab.com/اخبار",
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
