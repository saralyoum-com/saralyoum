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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: "https://sardhahab.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `سعر الذهب في ${country.nameAr}`,
        item: `https://sardhahab.com/${country.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
