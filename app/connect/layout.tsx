import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SARD Connect — Social Platforms",
  robots: { index: false, follow: false },
};

export default function ConnectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
