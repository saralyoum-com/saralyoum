import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { AdSenseScript } from "@/components/AdSense";
import { LocationProvider } from "@/components/LocalCurrency";
import { LanguageProvider } from "@/components/LanguageContext";
import { OneSignalInit } from "@/components/PushNotifications";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sardhahab.com"),
  title: {
    default: "سعر الذهب | أسعار الذهب والفضة والعملات الرقمية لحظياً",
    template: "%s | سعر الذهب",
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
  authors: [{ name: "سعر الذهب" }],
  creator: "سعر الذهب",
  publisher: "سعر الذهب",
  openGraph: {
    title: "سعر الذهب | أسعار لحظية للذهب والعملات",
    description: "تابع أسعار الذهب والفضة والعملات الرقمية لحظياً مع أخبار اقتصادية وتنبيهات ذكية",
    url: "https://sardhahab.com",
    siteName: "سعر الذهب",
    locale: "ar_SA",
    type: "website",
    images: [{ url: "/api/og?asset=gold&price=4%2C787&change=%2B0.85%25", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "سعر الذهب | أسعار لحظية للذهب والعملات",
    description: "تابع أسعار الذهب والفضة والعملات الرقمية لحظياً",
  },
  alternates: {
    canonical: "https://sardhahab.com",
    languages: {
      "ar-SA": "https://sardhahab.com",
      "ar": "https://sardhahab.com",
      "x-default": "https://sardhahab.com",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "سعر الذهب",
  },
  verification: {
    google: "6Za0nJ0t9J4Ft04y3xF3fPS7Nx9-kzXEm43Oftq10qo",
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
              name: "سعر الذهب",
              alternateName: "sardhahab",
              url: "https://sardhahab.com",
              description: "أسعار لحظية للذهب والفضة والعملات الرقمية والاقتصادية",
              inLanguage: ["ar", "en"],
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://sardhahab.com/اخبار?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "سعر الذهب",
              url: "https://sardhahab.com",
              logo: "https://sardhahab.com/favicon.ico",
              sameAs: ["https://t.me/sardhahab"],
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
      <OneSignalInit />
      <GoogleAnalytics gaId="G-2EFBVGR83R" />
      <AdSenseScript />
    </html>
  );
}
