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
import RscHeaderFix from "@/components/RscHeaderFix";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sardhahab.com"),
  title: {
    default: "سعر الذهب اليوم — عيار 24 و21 و18 بالريال والدرهم والدينار",
    template: "%s | سعر الذهب",
  },
  description:
    "سعر جرام الذهب عيار 24 و21 و18 لحظياً بالريال السعودي والدرهم الإماراتي والدينار الكويتي والجنيه المصري — محدّث كل دقيقة. حاسبة ذهب مجانية وتنبيهات فورية.",
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
    title: "سعر الذهب اليوم — عيار 24 و21 و18 بالريال والدرهم والدينار",
    description: "سعر جرام الذهب عيار 24 و21 و18 لحظياً بالريال السعودي والدرهم الإماراتي والدينار الكويتي والجنيه المصري — محدّث كل دقيقة.",
    url: "https://sardhahab.com",
    siteName: "سعر الذهب",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        // /og.png renders the card from /api/og so the branding stays in one
        // place. It deliberately carries no price: the number it used to show
        // froze, because X and the other crawlers cache a link's card for days
        // and a stale price on a price site is worse than none (see CLAUDE.md:
        // "never reference static image files in /public").
        url: "https://sardhahab.com/og.png?asset=gold",
        width: 1200,
        height: 630,
        alt: "سعر الذهب اليوم — sardhahab.com",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sardhahab",
    creator: "@sardhahab",
    title: "سعر الذهب اليوم — عيار 24 و21 و18 بالريال والدرهم والدينار",
    description: "سعر جرام الذهب عيار 24 و21 و18 لحظياً بالريال السعودي والدرهم الإماراتي والدينار الكويتي — محدّث كل دقيقة.",
    images: [
      {
        // /og.png renders the card from /api/og so the branding stays in one
        // place. It deliberately carries no price: the number it used to show
        // froze, because X and the other crawlers cache a link's card for days
        // and a stale price on a price site is worse than none (see CLAUDE.md:
        // "never reference static image files in /public").
        url: "https://sardhahab.com/og.png?asset=gold",
        width: 1200,
        height: 630,
        alt: "سعر الذهب اليوم — sardhahab.com",
      },
    ],
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
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
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
  other: {
    "google-adsense-account": "ca-pub-4178023712321047",
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
                "SA", "AE", "KW", "QA", "BH", "OM", "EG", "JO", "MA", "IQ", "LY", "TN", "DZ", "YE", "SD", "LB", "SY", "PS",
              ],
              inLanguage: ["ar", "en"],
              sameAs: ["https://t.me/sardhahab", "https://x.com/sardhahab"],
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
      <RscHeaderFix />
      <OneSignalInit />
      <GoogleAnalytics gaId="G-2EFBVGR83R" />
      <AdSenseScript />
    </html>
  );
}
