import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التحليل التقني للبيتكوين اليوم — مؤشرات RSI وMACD | سرد الذهب",
  description:
    "تحليل تقني لحظي لسعر البيتكوين مع شارت الشمعدانات ومؤشرات RSI وMACD ومستويات الدعم والمقاومة على أطر زمنية متعددة.",
  keywords: [
    "تحليل تقني البيتكوين",
    "سعر البيتكوين اليوم",
    "مؤشر RSI البيتكوين",
    "تحليل فني بيتكوين",
    "bitcoin technical analysis",
    "BTC chart RSI MACD",
  ],
  alternates: {
    canonical: "https://sardhahab.com/تحليل-تقني-البيتكوين",
  },
  openGraph: {
    title: "التحليل التقني للبيتكوين — مؤشرات لحظية",
    description: "شارت البيتكوين مع RSI وMACD ومستويات الدعم والمقاومة، محدّث كل 60 ثانية.",
    url: "https://sardhahab.com/تحليل-تقني-البيتكوين",
    images: [{ url: "https://sardhahab.com/api/og?asset=bitcoin" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
