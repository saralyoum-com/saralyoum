import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شروط الاستخدام",
  description: "شروط وأحكام استخدام موقع سعر اليوم — sardhahab.com",
  alternates: { canonical: "https://sardhahab.com/شروط-الاستخدام" },
  robots: { index: true, follow: false },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
