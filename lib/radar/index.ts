import {
  COMPARABLE_SINCE,
  ga4Channels,
  ga4LandingPages,
  ga4Totals,
  googleConfigured,
  gscQueries,
  gscTotals,
  type Ga4Row,
  type Ga4Totals,
  type GscRow,
  type GscTotals,
} from "./google";
import { safeDecode } from "./decode";
import { EMPTY_META, metaConfigured, metaSnapshot, type MetaSnapshot } from "./meta";
import { ownedConfigured, ownedSnapshot, type OwnedSnapshot } from "./owned";

/**
 * The radar agent: pull every source we actually own, then reduce the numbers
 * to a short list of findings a human can act on.
 *
 * Design rule — a finding must name the evidence that produced it. A dashboard
 * that says "engagement is down" is noise; "7 keywords sit at position 5-15 with
 * zero clicks" is a task. Every rule below therefore carries its own numbers.
 *
 * Sources degrade independently: a dead Meta token must not blank the search
 * findings, so each block is wrapped and its failure recorded in `errors`.
 */

export type Severity = "critical" | "warning" | "opportunity" | "info";

export type Finding = {
  severity: Severity;
  title: string;
  detail: string;
  /** Stable id so the same finding can be de-duplicated across daily runs. */
  code: string;
};

export type RadarReport = {
  generatedAt: string;
  windowDays: number;
  sources: { google: boolean; meta: boolean; owned: boolean };
  errors: string[];
  site: { current: Ga4Totals; previous: Ga4Totals; comparable: boolean } | null;
  channels: Ga4Row[];
  landingPages: Ga4Row[];
  search: { totals: GscTotals; queries: GscRow[] } | null;
  owned: OwnedSnapshot;
  meta: MetaSnapshot;
  findings: Finding[];
};

/** Keywords ranking just off the money — close enough that a nudge pays. */
const STRIKING_MIN = 4;
const STRIKING_MAX = 15;

/** Below this, a landing page's bounce rate is noise rather than signal. */
const MIN_SESSIONS_FOR_PAGE_FINDING = 10;

const pct = (v: number) => `${Math.round(v * 100)}%`;

function buildFindings(r: Omit<RadarReport, "findings">): Finding[] {
  const out: Finding[] = [];

  // ---- search visibility -------------------------------------------------
  if (r.search) {
    const { clicks, impressions, ctr, position } = r.search.totals;
    if (impressions >= 500 && position > 15) {
      out.push({
        code: "search-invisible",
        severity: "critical",
        title: "الموقع يظهر في البحث لكن لا أحد يصل إليه",
        detail: `${impressions.toLocaleString("en")} ظهور مقابل ${clicks} نقرة فقط · نسبة النقر ${(ctr * 100).toFixed(2)}% · متوسط الترتيب ${position.toFixed(1)} أي الصفحة الثانية أو أبعد. الظهور موجود والفهرسة تعمل — الترتيب هو الجدار.`,
      });
    }

    const striking = r.search.queries
      .filter((q) => q.position >= STRIKING_MIN && q.position <= STRIKING_MAX && q.clicks === 0 && q.impressions >= 3)
      .sort((a, b) => b.impressions - a.impressions);

    if (striking.length) {
      const top = striking.slice(0, 3).map((q) => `«${q.key}» (ترتيب ${q.position.toFixed(1)})`).join(" · ");
      out.push({
        code: "striking-distance",
        severity: "opportunity",
        title: `${striking.length} كلمة على بعد خطوة من الصفحة الأولى`,
        detail: `كلمات ترتيبها بين ${STRIKING_MIN} و ${STRIKING_MAX} وبصفر نقرات — أقرب مكسب متاح لأن الترتيب شبه جاهز. أعلاها: ${top}`,
      });
    }
  }

  // ---- is GA4 even telling the truth? ------------------------------------
  // /api/collect drops self-declared automation, so a big gap between GA4 and
  // our own store is the automated share GA4 is still counting as visitors.
  if (r.site && r.owned.configured && r.owned.sessions > 0) {
    const ga = r.site.current.sessions;
    const ours = r.owned.sessions;
    if (ga > 0 && ours / ga < 0.7) {
      out.push({
        code: "ga4-inflated",
        severity: "warning",
        title: "أرقام GA4 أعلى من الواقع",
        detail: `GA4 يسجل ${ga} جلسة بينما مخزوننا الخاص — الذي يرفض الترافيك الآلي المعلن عن نفسه — يسجل ${ours} فقط. الفارق ${ga - ours} جلسة على الأرجح آلية. اعتمد رقمنا لا رقم GA4 عند قياس النمو.`,
      });
    }
  }

  if (r.site && !r.site.comparable) {
    out.push({
      code: "baseline-unreliable",
      severity: "info",
      title: "المقارنة مع الفترة السابقة غير موثوقة",
      detail: `الفترة المرجعية تسبق ${COMPARABLE_SINCE}، وهو تاريخ إصلاح حجب CSP الذي كان يمنع أحداث GA4 من الوصول. أي نمو ظاهر عبر هذا التاريخ قد يكون أثر الإصلاح لا نموا حقيقيا.`,
    });
  }

  // ---- data quality in our own store -------------------------------------
  if (r.owned.configured && r.owned.events > 50 && r.owned.geoCoverage === 0) {
    out.push({
      code: "geo-missing",
      severity: "warning",
      title: "حقل الدولة فارغ في كل أحداثنا",
      detail: `${r.owned.events} حدث ولا واحد منها يحمل رمز دولة. المسار /api/collect يقرأ ترويسة x-vercel-ip-country ويبدو أنها لا تصل إليه، فتحليل الدول من مخزوننا معطل بالكامل حتى يُصلح.`,
    });
  }

  // ---- landing pages that lose people ------------------------------------
  const siteBounce = r.site?.current.bounceRate ?? 0;
  const leaking = r.landingPages
    .filter((p) => p.sessions >= MIN_SESSIONS_FOR_PAGE_FINDING && p.bounceRate > siteBounce + 0.2)
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 3);

  for (const page of leaking) {
    out.push({
      code: `page-bounce:${page.key}`,
      severity: "warning",
      title: `ارتداد مرتفع في ${safeDecode(page.key)}`,
      detail: `${pct(page.bounceRate)} ارتداد مقابل ${pct(siteBounce)} لبقية الموقع · ${page.sessions} جلسة · متوسط المدة ${Math.round(page.avgDuration)} ثانية.`,
    });
  }

  // ---- social ------------------------------------------------------------
  if (!r.sources.meta) {
    out.push({
      code: "meta-unconfigured",
      severity: "info",
      title: "ميتا غير موصولة بهذا التشغيل",
      detail:
        "متغيرات FB_PAGE_ID و FB_PAGE_TOKEN و INSTAGRAM_ACCOUNT_ID و IG_USER_TOKEN غير متاحة هنا، فقسم السوشيال فارغ. بقية التقرير غير متأثر.",
    });
  } else {
    // A page we post to daily that nobody engages with is wasted production
    // time, not a small dip — so it is a finding, not a stat.
    const fb = r.meta.facebook;
    if (fb.followers && fb.engagements30d === 0) {
      out.push({
        code: "facebook-dead",
        severity: "warning",
        title: "صفحة فيسبوك لا تصل لأحد",
        detail: `${fb.followers} متابع · صفر تفاعل وصفر زيارة للصفحة خلال ${r.windowDays} يوم، رغم النشر اليومي. ملاحظة: ميتا ألغت مقاييس الوصول للصفحات في الإصدار v25 فلا يمكن قياس الظهور — لكن التفاعل الصفري وحده كافٍ.`,
      });
    }

    // Reach differs by format far more than by topic on this account; if one
    // format is carrying the page, the schedule should follow it.
    const igPosts = r.meta.posts.filter((p) => p.platform === "instagram" && p.reach !== null);
    const avg = (type: string) => {
      const set = igPosts.filter((p) => p.mediaType === type);
      return set.length ? set.reduce((a, p) => a + (p.reach ?? 0), 0) / set.length : null;
    };
    const video = avg("VIDEO");
    const image = avg("IMAGE");
    if (video !== null && image !== null && image > 0 && video / image >= 3) {
      out.push({
        code: "ig-format-gap",
        severity: "opportunity",
        title: "الفيديو على إنستغرام يصل أضعاف الصورة",
        detail: `متوسط وصول الفيديو ${Math.round(video)} مقابل ${Math.round(image)} للصورة — أي ${(video / image).toFixed(1)} ضعف. نفس الجهد، نتيجة مختلفة تماما: حوّل المنشورات الثابتة إلى فيديو قصير.`,
      });
    }

    // The 60-day Instagram token has no expiry endpoint we can read, so the
    // report answers the only question that matters: does it still work.
    if (!r.meta.instagram.tokenValid) {
      out.push({
        code: "ig-token-dead",
        severity: "critical",
        title: "توكن إنستغرام لا يعمل — النشر متوقف",
        detail: `فشلت قراءة الحساب${r.meta.instagram.error ? `: ${r.meta.instagram.error}` : ""}. توكن إنستغرام عمره ٦٠ يوما ولا يمكن تجديده بعد انتهائه — يحتاج إعادة تفويض يدوية منك. راجع سجل ig_token.log.`,
      });
    }
  }

  const order: Severity[] = ["critical", "warning", "opportunity", "info"];
  return out.sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity));
}

export async function buildRadarReport(windowDays = 30): Promise<RadarReport> {
  const errors: string[] = [];

  const guard = async <T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> => {
    try {
      return await fn();
    } catch (e) {
      errors.push(`${label}: ${e instanceof Error ? e.message : String(e)}`);
      return fallback;
    }
  };

  const hasGoogle = googleConfigured();

  const [totals, channels, landingPages, searchTotals, queries, owned, meta] = await Promise.all([
    hasGoogle ? guard("ga4Totals", () => ga4Totals(windowDays), null) : Promise.resolve(null),
    hasGoogle ? guard("ga4Channels", () => ga4Channels(windowDays), [] as Ga4Row[]) : Promise.resolve([]),
    hasGoogle ? guard("ga4LandingPages", () => ga4LandingPages(windowDays), [] as Ga4Row[]) : Promise.resolve([]),
    hasGoogle ? guard("gscTotals", () => gscTotals(windowDays), null) : Promise.resolve(null),
    hasGoogle ? guard("gscQueries", () => gscQueries(windowDays), [] as GscRow[]) : Promise.resolve([]),
    guard("owned", () => ownedSnapshot(windowDays), {
      configured: false,
      events: 0,
      sessions: 0,
      eventsPerSession: 0,
      topEvents: [],
      topPages: [],
      devices: [],
      geoCoverage: 0,
    } as OwnedSnapshot),
    guard("meta", () => metaSnapshot(windowDays), EMPTY_META),
  ]);

  // The baseline window is only trustworthy if it starts after the CSP fix.
  const baselineStart = new Date(Date.now() - windowDays * 2 * 86_400_000);
  const comparable = baselineStart >= new Date(COMPARABLE_SINCE);

  const base: Omit<RadarReport, "findings"> = {
    generatedAt: new Date().toISOString(),
    windowDays,
    sources: { google: hasGoogle, meta: metaConfigured(), owned: ownedConfigured() },
    errors,
    site: totals ? { ...totals, comparable } : null,
    channels,
    landingPages,
    search: searchTotals ? { totals: searchTotals, queries } : null,
    owned,
    meta,
  };

  return { ...base, findings: buildFindings(base) };
}
