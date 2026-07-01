import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SARD Control — Content Approval",
  robots: { index: false, follow: false },
};

export default function SardControlLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
