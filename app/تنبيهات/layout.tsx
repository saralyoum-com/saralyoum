import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "التنبيهات الذكية",
  description:
    "اشترك مجاناً في تنبيهات أسعار الذهب والعملات الرقمية — تنبيه يومي الساعة 8 صباحاً وتنبيه سعري عند بلوغ السعر المستهدف.",
  keywords: [
    "تنبيهات سعر الذهب",
    "تنبيه بيتكوين",
    "تنبيهات الأسواق",
    "سعر الذهب تنبيه",
    "gold price alert",
    "bitcoin alert",
  ],
  openGraph: {
    title: "التنبيهات الذكية — سعر اليوم",
    description: "تنبيهات يومية وسعرية مجانية على بريدك الإلكتروني",
    type: "website",
  },
  alternates: {
    canonical: "https://saralyoum.vercel.app/تنبيهات",
  },
};

export default function AlertsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
