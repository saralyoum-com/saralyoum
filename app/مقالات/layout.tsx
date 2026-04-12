import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "مقالات الذهب والأسواق المالية",
  description: "مقالات ومحتوى متخصص عن أسعار الذهب والفضة والعملات الرقمية والأسواق المالية — تحليلات وشروحات بالعربية.",
  keywords: ["مقالات الذهب", "تحليل سعر الذهب", "الاستثمار في الذهب", "أخبار الذهب", "توقعات الذهب"],
  openGraph: { title: "مقالات — سعر الذهب", description: "مقالات ومحتوى متخصص عن أسعار الذهب والأسواق", type: "website" },
  alternates: { canonical: "https://sardhahab.com/مقالات" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
