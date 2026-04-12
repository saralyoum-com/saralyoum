import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة خصوصية موقع سعر الذهب — كيف نتعامل مع بياناتك وخصوصيتك.",
  alternates: { canonical: "https://sardhahab.com/سياسة-الخصوصية" },
  robots: { index: true, follow: false },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
