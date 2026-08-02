import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التحليل التقني للذهب اليوم — توقعات بالذكاء الاصطناعي | سرد الذهب",
  description:
    "تحليل تقني يومي وأسبوعي وشهري لسعر الذهب مع مؤشرات RSI وMACD ومستويات الدعم والمقاومة وتوقعات مدعومة بالذكاء الاصطناعي.",
  keywords: [
    "تحليل تقني الذهب",
    "توقعات سعر الذهب",
    "إشارات الذهب",
    "الذكاء الاصطناعي الذهب",
    "gold technical analysis",
    "gold price prediction",
    "سعر الذهب الأسبوع القادم",
    "توقعات الذهب 2026",
  ],
  alternates: {
    canonical: "https://sardhahab.com/تحليل-تقني-الذهب",
  },
  openGraph: {
    title: "التحليل التقني للذهب — توقعات بالذكاء الاصطناعي",
    description:
      "تحليل تقني يومي وأسبوعي وشهري لسعر الذهب مدعوم بالذكاء الاصطناعي.",
    url: "https://sardhahab.com/تحليل-تقني-الذهب",
    images: [{ url: "https://sardhahab.com/api/og?asset=gold" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
