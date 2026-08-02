import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التحليل التقني للفضة اليوم — مؤشرات RSI وMACD | سرد الذهب",
  description:
    "تحليل تقني لحظي لسعر الفضة مع شارت الشمعدانات ومؤشرات RSI وMACD ومستويات الدعم والمقاومة على أطر زمنية متعددة.",
  keywords: [
    "تحليل تقني الفضة",
    "سعر الفضة اليوم",
    "مؤشر RSI الفضة",
    "مستويات الدعم والمقاومة الفضة",
    "silver technical analysis",
    "silver price chart",
  ],
  alternates: {
    canonical: "https://sardhahab.com/تحليل-تقني-الفضة",
  },
  openGraph: {
    title: "التحليل التقني للفضة — مؤشرات لحظية",
    description: "شارت الفضة مع RSI وMACD ومستويات الدعم والمقاومة، محدّث كل 60 ثانية.",
    url: "https://sardhahab.com/تحليل-تقني-الفضة",
    images: [{ url: "https://sardhahab.com/api/og?asset=gold" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
