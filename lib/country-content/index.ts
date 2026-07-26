import type { ContentSection, CountryFAQ } from "@/components/CountryContent";
import { saudiContent } from "./saudi";
import { uaeContent } from "./uae";
import { egyptContent } from "./egypt";
import { kuwaitContent } from "./kuwait";
import { lebanonContent } from "./lebanon";
import { libyaContent } from "./libya";
import { moroccoContent } from "./morocco";
import { omanContent } from "./oman";
import { palestineContent } from "./palestine";

export interface CountryContentData {
  intro: ContentSection;
  market: ContentSection;
  culture: ContentSection;
  dealers: ContentSection;
  history: ContentSection;
  buyingGuide: ContentSection;
  faq: CountryFAQ[];
}

/**
 * Long-form, country-specific editorial content keyed by the ASCII country code
 * used in /gold/[code].
 *
 * This registry exists because the Arabic-slug pages (app/سعر-الذهب-السعودية/…)
 * are never actually served: middleware rewrites every Arabic country slug to
 * /gold/[code], so only app/gold/[code]/page.tsx renders. That route did not
 * import this content, which left every country page as a bare price table —
 * ~570 visible words with nothing unique per country. Wiring the content in
 * here is what makes the Arabic canonical URLs actually serve it.
 *
 * Countries without an entry simply render prices only (no empty sections).
 */
export const COUNTRY_CONTENT: Record<string, CountryContentData> = {
  sa: saudiContent,
  ae: uaeContent,
  eg: egyptContent,
  kw: kuwaitContent,
  lb: lebanonContent,
  ly: libyaContent,
  ma: moroccoContent,
  om: omanContent,
  ps: palestineContent,
};

export function getCountryContent(code: string): CountryContentData | undefined {
  return COUNTRY_CONTENT[code.toLowerCase()];
}
