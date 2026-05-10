import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "ما الذي يؤثر على سعر الذهب؟ — 7 عوامل رئيسية",
  description: "تعرّف على أهم العوامل التي تحرّك سعر الذهب عالمياً: الفائدة الأمريكية، الدولار، التضخم، التوترات الجيوسياسية وغيرها.",
  keywords: ["عوامل سعر الذهب", "لماذا يرتفع الذهب", "محركات سعر الذهب", "الذهب والدولار", "تحليل سعر الذهب"],
  openGraph: { title: "ما يؤثر على سعر الذهب — 7 عوامل | سعر الذهب", description: "أهم العوامل التي تحرك سعر الذهب عالمياً.", type: "article" },
  alternates: { canonical: "https://sardhahab.com/مقالات/ما-يؤثر-على-سعر-الذهب" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
