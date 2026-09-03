import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "وكيل الرصد — SARD",
  robots: { index: false, follow: false },
};

export default function RadarLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
