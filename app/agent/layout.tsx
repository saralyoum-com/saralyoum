import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مساحة عمل الوكلاء | سعر الذهب",
  robots: { index: false, follow: false },
};

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
