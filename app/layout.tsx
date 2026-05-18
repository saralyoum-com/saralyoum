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
              alternateName: ["sardhahab", "Gold Price Arabic", "Sard Dhahab"],
              url: "https://sardhahab.com",
              description:
                "أسعار لحظية للذهب والفضة والبيتكوين والإيثيريوم وأكثر من 27 عملة عربية وعالمية — محدّثة كل دقيقة.",
              inLanguage: ["ar", "en"],
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
              alternateName: "sardhahab.com",
              url: "https://sardhahab.com",
              logo: {
                "@type": "ImageObject",
                url: "https://sardhahab.com/icons/icon-512.png",
                width: 512,
                height: 512,
              },
              description:
                "موقع متخصص في أسعار الذهب والفضة والعملات الرقمية والعملات الأجنبية لحظياً باللغة العربية.",
              foundingDate: "2023",
              areaServed: [
                "SA", "AE", "KW", "QA", "BH", "OM", "EG", "JO", "MA", "IQ", "LY", "TN", "DZ", "YE", "SD", "LB",
              ],
              inLanguage: ["ar", "en"],
              sameAs: ["https://t.me/sardhahab"],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                availableLanguage: ["Arabic", "English"],
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "DataCatalog",
              name: "أسعار الذهب والعملات لحظياً",
              description:
                "بيانات لحظية لأسعار الذهب عيار 24 و21 و18، والفضة، والبيتكوين، والإيثيريوم، وأكثر من 27 عملة عربية وعالمية.",
              url: "https://sardhahab.com/اسعار",
              provider: {
                "@type": "Organization",
                name: "سعر الذهب",
                url: "https://sardhahab.com",
              },
              dataset: [
                {
                  "@type": "Dataset",
                  name: "سعر الذهب اليوم",
                  description:
                    "سعر الذهب الفوري بالدولار وبعملات الدول العربية — عيار 24 و22 و21 و18 و14 بالجرام والأوقية والكيلوجرام.",
                  url: "https://sardhahab.com/اسعار",
                  temporalCoverage: "لحظي — يتحدث كل دقيقة",
                  creator: { "@type": "Organization", name: "سعر الذهب", url: "https://sardhahab.com" },
                  license: "https://creativecommons.org/licenses/by/4.0/",
                  variableMeasured: [
                    { "@type": "PropertyValue", name: "عيار 24", unitText: "جرام" },
                    { "@type": "PropertyValue", name: "عيار 21", unitText: "جرام" },
                    { "@type": "PropertyValue", name: "عيار 18", unitText: "جرام" },
                  ],
                },
                {
                  "@type": "Dataset",
                  name: "سعر البيتكوين اليوم",
                  description:
                    "سعر البيتكوين (BTC) لحظياً بالريال السعودي والدرهم الإماراتي والدينار الكويتي وجميع العملات العربية.",
                  url: "https://sardhahab.com/سعر-البيتكوين",
                  temporalCoverage: "لحظي — يتحدث كل 5 دقائق",
                  creator: { "@type": "Organization", name: "سعر الذهب", url: "https://sardhahab.com" },
                  license: "https://creativecommons.org/licenses/by/4.0/",
                },
                {
                  "@type": "Dataset",
                  name: "أسعار العملات الأجنبية",
                  description:
                    "أسعار صرف أكثر من 27 عملة عربية وعالمية مقابل الدولار الأمريكي، محدّثة يومياً.",
                  url: "https://sardhahab.com/اسعار",
                  temporalCoverage: "يومي",
                  creator: { "@type": "Organization", name: "سعر الذهب", url: "https://sardhahab.com" },
                  license: "https://creativecommons.org/licenses/by/4.0/",
                },
              ],
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
