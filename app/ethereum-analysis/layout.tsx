import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التحليل التقني للإيثيريوم اليوم — مؤشرات RSI وMACD | سرد الذهب",
  description:
    "تحليل تقني لحظي لسعر الإيثيريوم مع شارت الشمعدانات ومؤشرات RSI وMACD ومستويات الدعم والمقاومة على أطر زمنية متعددة.",
  keywords: [
    "تحليل تقني الإيثيريوم",
    "سعر الإيثيريوم اليوم",
    "مؤشر RSI الإيثيريوم",
    "تحليل فني ايثيريوم",
    "ethereum technical analysis",
    "ETH chart RSI MACD",
  ],
  alternates: {
    canonical: "https://sardhahab.com/تحليل-تقني-الايثيريوم",
  },
  openGraph: {
    title: "التحليل التقني للإيثيريوم — مؤشرات لحظية",
    description: "شارت الإيثيريوم مع RSI وMACD ومستويات الدعم والمقاومة، محدّث كل 60 ثانية.",
    url: "https://sardhahab.com/تحليل-تقني-الايثيريوم",
    images: [{ url: "https://sardhahab.com/api/og?asset=ethereum" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
