import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "أسعار الذهب والفضة والعملات الرقمية",
  description:
    "أسعار لحظية للذهب عيار 24/22/21/18 والفضة والبيتكوين والإيثيريوم وأكثر من 27 عملة عربية وعالمية محدّثة باستمرار من مصادر موثوقة.",
  keywords: [
    "سعر الذهب اليوم",
    "سعر عيار 21",
    "سعر عيار 24",
    "سعر عيار 22",
    "سعر عيار 18",
    "سعر الفضة",
    "سعر البيتكوين",
    "الريال السعودي",
    "الدرهم الإماراتي",
    "سعر الدولار",
    "أسعار العملات العربية",
  ],
  openGraph: {
    title: "أسعار الذهب والفضة والعملات — سعر اليوم",
    description: "أسعار لحظية للذهب والفضة وأكثر من 27 عملة محدّثة باستمرار",
    type: "website",
  },
  alternates: {
    canonical: "https://sardhahab.com/اسعار",
  },
};

export default function PricesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
