import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AdSenseScript } from "@/components/AdSense";
import { LocationProvider } from "@/components/LocalCurrency";
import { LanguageProvider } from "@/components/LanguageContext";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sardhahab.com"),
  title: {
    default: "سعر اليوم | أسعار الذهب والفضة والعملات الرقمية لحظياً",
    template: "%s | سعر اليوم",
  },
  description:
    "تابع أسعار الذهب والفضة والبيتكوين والإيثيريوم لحظياً مع أكثر من 27 عملة عربية وعالمية وأخبار اقتصادية يومية وتنبيهات ذكية للأسواق.",
  keywords: [
    "سعر الذهب اليوم",
    "سعر الذهب",
    "سعر الفضة",
    "سعر البيتكوين",
    "سعر الإيثيريوم",
    "أسعار العملات",
    "الريال السعودي",
    "الدرهم الإماراتي",
    "سعر الصرف",
    "عيار 21",
    "عيار 24",
    "حاسبة الذهب",
    "زكاة الذهب",
    "أسعار الأسواق",
    "gold price",
    "bitcoin price",
  ],
  authors: [{ name: "سعر اليوم" }],
  creator: "سعر اليوم",
  publisher: "سعر اليوم",
  openGraph: {
    title: "سعر اليوم | أسعار لحظية للذهب والعملات",
    description: "تابع أسعار الذهب والفضة والعملات الرقمية لحظياً مع أخبار اقتصادية وتنبيهات ذكية",
    url: "https://sardhahab.com",
    siteName: "سعر اليوم",
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "سعر اليوم | أسعار لحظية للذهب والعملات",
    description: "تابع أسعار الذهب والفضة والعملات الرقمية لحظياً",
  },
  alternates: {
    canonical: "https://sardhahab.com",
    languages: {
      "ar-SA": "https://sardhahab.com",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: { icon: "/favicon.ico" },
  verification: {
    google: "",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "سعر اليوم",
              url: "https://sardhahab.com",
              description: "أسعار لحظية للذهب والفضة والعملات الرقمية",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://sardhahab.com/اخبار",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${tajawal.variable} font-tajawal bg-background text-text-primary antialiased min-h-screen`}
      >
        <LanguageProvider>
          <Navigation />
          <LocationProvider>
            <main>{children}</main>
          </LocationProvider>
          <Footer />
        </LanguageProvider>
      </body>
      <GoogleAnalytics gaId="G-YCCGFZPHE7" />
      <AdSenseScript />
    </html>
  );
}
