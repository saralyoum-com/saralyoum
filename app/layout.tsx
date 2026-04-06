import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AdSenseScript } from "@/components/AdSense";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "سعر اليوم | أسعار الذهب والفضة والعملات الرقمية",
  description:
    "متابعة أسعار الذهب والفضة والبيتكوين والإيثيريوم لحظياً مع أخبار اقتصادية وتنبيهات ذكية للأسواق",
  keywords: "سعر الذهب, سعر الفضة, بيتكوين, إيثيريوم, أسعار العملات, الأسواق المالية",
  openGraph: {
    title: "سعر اليوم | أسعار لحظية للذهب والعملات",
    description: "تابع أسعار الذهب والفضة والعملات الرقمية لحظياً",
    locale: "ar_SA",
    type: "website",
  },
  robots: "index, follow",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${tajawal.variable} font-tajawal bg-background text-text-primary antialiased min-h-screen`}
      >
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
      <GoogleAnalytics gaId="G-YCCGFZPHE7" />
      <AdSenseScript />
    </html>
  );
}
