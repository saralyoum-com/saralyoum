import type { Metadata } from "next";
import { getCountryByCode } from "@/lib/countries";

export function generateMetadata({
  params,
}: {
  params: { code: string };
}): Metadata {
  const country = getCountryByCode(params.code);
  if (!country) return {};

  const title = `سعر الذهب في ${country.nameAr} اليوم بالـ${country.currencyAr}`;
  const description = `سعر الذهب في ${country.nameAr} (${country.city}) اليوم بالـ${country.currencyAr} — عيار 24 و22 و21 و18 و14 بالجرام، محدّث لحظياً من المصادر العالمية.`;

  return {
    title,
    description,
    keywords: country.keywords,
    openGraph: {
      title: `سعر الذهب في ${country.nameAr} — سعر الذهب`,
      description,
      type: "website",
      images: [{ url: "https://sardhahab.com/api/og?asset=gold", width: 1200, height: 630, alt: `سعر الذهب في ${country.nameAr}` }],
    },
    alternates: {
      canonical: `https://sardhahab.com/${country.slug}`,
    },
  };
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { code: string };
}) {
  const country = getCountryByCode(params.code);
  if (!country) return <>{children}</>;

  const now = new Date().toISOString();
  const pageUrl = `https://sardhahab.com/${country.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: "https://sardhahab.com" },
      { "@type": "ListItem", position: 2, name: `سعر الذهب في ${country.nameAr}`, item: pageUrl },
    ],
  };

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `سعر الذهب اليوم في ${country.nameAr} بالـ${country.currencyAr}`,
    description: `أسعار الذهب اليومية في ${country.nameAr} لعيار 24 و22 و21 و18 بالـ${country.currencyAr} — محدّثة لحظياً.`,
    url: pageUrl,
    creator: { "@type": "Organization", name: "سعر الذهب", url: "https://sardhahab.com" },
    dateModified: now,
    temporalCoverage: now.slice(0, 10),
    inLanguage: "ar",
    license: "https://creativecommons.org/licenses/by/4.0/",
    distribution: [{
      "@type": "DataDownload",
      encodingFormat: "application/json",
      contentUrl: "https://sardhahab.com/api/prices?type=metals",
    }],
    variableMeasured: [
      { "@type": "PropertyValue", name: "عيار 24", unitText: "جرام", unitCode: "GRM" },
      { "@type": "PropertyValue", name: "عيار 21", unitText: "جرام", unitCode: "GRM" },
      { "@type": "PropertyValue", name: "عيار 18", unitText: "جرام", unitCode: "GRM" },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    name: `سعر الذهب في ${country.nameAr} اليوم`,
    dateModified: now,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".price-display", ".price-hero", "[data-speakable]"],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      {children}
    </>
  );
}
