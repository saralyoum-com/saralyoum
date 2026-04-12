import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إخلاء المسؤولية",
  description: "إخلاء مسؤولية موقع سعر الذهب — الأسعار المعروضة لأغراض إعلامية فقط وليست نصيحة استثمارية.",
  alternates: { canonical: "https://sardhahab.com/إخلاء-مسؤولية" },
  robots: { index: true, follow: false },
};

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
