import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حاسبة الذهب والزكاة",
  description:
    "احسب قيمة ذهبك بجميع العيارات (24/22/21/18) وزكاة الذهب والمدخرات بدقة — أسعار لحظية محدّثة. حاسبة مجانية عربية.",
  keywords: [
    "حاسبة الذهب",
    "حاسبة زكاة الذهب",
    "سعر جرام الذهب",
    "عيار 24",
    "عيار 21",
    "عيار 22",
    "عيار 18",
    "زكاة الذهب",
    "نصاب الذهب",
    "gold calculator",
    "zakat calculator",
    "gold gram price",
  ],
  openGraph: {
    title: "حاسبة الذهب والزكاة — سعر اليوم",
    description: "احسب قيمة ذهبك وزكاتك بأسعار لحظية لجميع العيارات",
    type: "website",
  },
  alternates: {
    canonical: "https://saralyoum.vercel.app/حاسبة-الذهب",
  },
};

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
