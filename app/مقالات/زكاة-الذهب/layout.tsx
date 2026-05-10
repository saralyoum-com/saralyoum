import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "زكاة الذهب — كيف تحسبها بالطريقة الصحيحة؟",
  description: "شرح تفصيلي لأحكام زكاة الذهب: النصاب، الحول، نسبة 2.5%، وكيفية الحساب بالأسعار الحالية.",
  keywords: ["زكاة الذهب", "حساب زكاة الذهب", "نصاب الذهب", "زكاة المجوهرات", "كيفية حساب زكاة الذهب"],
  openGraph: { title: "زكاة الذهب — كيف تحسبها؟ | سعر الذهب", description: "شرح تفصيلي لأحكام زكاة الذهب مع حاسبة تفاعلية.", type: "article" },
  alternates: { canonical: "https://sardhahab.com/مقالات/زكاة-الذهب" },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
