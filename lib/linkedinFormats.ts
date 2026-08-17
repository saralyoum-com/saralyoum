/**
 * LinkedIn article formats — every figure computed here, never by the model.
 *
 * The old generator asked the model to write 150-200 words on an evergreen
 * topic ("why does gold rise in a crisis?"), which produced text anyone could
 * have written without the site. These formats instead publish data we already
 * hold and nobody else has in one place: per-market VAT and مصنعية from
 * MARKETS, the bullion premium ladder, the karat ladder, and the live nisab.
 *
 * Contract with the model: it writes the connective prose only. Every number
 * that appears in the finished post comes from `opening` / `table` / `closing`,
 * which are assembled here from live spot + live FX. That is the same split
 * used by the technical-analysis posts, and it is what keeps the facts correct
 * even when the wording drifts.
 */
import {
  OZ, KARATS, BULLION_SIZES, MARKETS, getMarket,
} from "@/lib/goldDetails";
import { COUNTRIES } from "@/lib/countries";

export interface FormatCtx {
  goldOz: number;
  changePct: number;
  gram24: number;
  rates: Record<string, number>;   // code -> units per USD
  todayAr: string;
}

export interface BuiltFormat {
  key: string;
  /** Headline carrying the story's key number. */
  headline: string;
  /** Opening lines — the punch, with the numbers. */
  opening: string;
  /** Deterministic data block (table or ladder). Empty string if none. */
  table: string;
  /** What the model should explain, in Arabic. Never asks it for figures. */
  angle: string;
  /** Closing practical note, computed. */
  closing: string;
  /** One-line snippet for the short follow-up posts. */
  snippet: string;
  /** Accuracy note naming only what THIS format actually asserts. A shared
   *  caveat ended up claiming "the taxes mentioned" in an article about bar
   *  premiums, which mentions no taxes — sloppy in a piece whose whole value
   *  is that its numbers can be trusted. */
  caveat: string;
}

const n0 = (v: number) => v.toLocaleString("en-US", { maximumFractionDigits: 0 });
// Always two decimals: figures sit in aligned columns, and "535.6" next to
// "142.83" reads as a typo in a table whose whole point is precision.
const n2 = (v: number) =>
  v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (v: number) => `${v.toFixed(1)}%`;

/* ── 1. The retail wedge: same metal, different final bill ─────────────────── */
function countryWedge(ctx: FormatCtx): BuiltFormat {
  const gram21USD = ctx.gram24 * (21 / 24);
  // Only markets with a hand-tuned config — DEFAULT_MARKET would make the
  // comparison meaningless by giving every country identical assumptions.
  const codes = Object.keys(MARKETS);
  const rows = codes
    .map((code) => {
      const c = COUNTRIES.find((x) => x.code === code);
      const rate = c ? ctx.rates[c.currency] : undefined;
      if (!c || !rate) return null;
      const m = getMarket(code);
      const spotLocal = gram21USD * rate;
      const masn = m.masnaeyaMid[21] ?? 0;
      const vat = (spotLocal + masn) * m.vat;
      const total = spotLocal + masn + vat;
      return {
        code, nameAr: c.nameAr, cur: c.currencyAr,
        spotLocal, masn, vat, total,
        usd: total / rate,
        wedge: (total / spotLocal - 1) * 100,
        vatPct: Math.round(m.vat * 100),
      };
    })
    .filter(Boolean) as Array<{
      code: string; nameAr: string; cur: string; spotLocal: number; masn: number;
      vat: number; total: number; usd: number; wedge: number; vatPct: number;
    }>;

  rows.sort((a, b) => b.usd - a.usd);
  const hi = rows[0];
  const lo = rows[rows.length - 1];
  const gap = (hi.usd / lo.usd - 1) * 100;

  const table = [
    "الدولة | سعر المعدن | المصنعية | الضريبة | الإجمالي",
    ...rows.map((r) =>
      `${r.nameAr} | ${n2(r.spotLocal)} | ${n0(r.masn)} | ${n2(r.vat)} | ${n2(r.total)} ${r.cur}`),
    "",
    "وبتحويل الإجمالي إلى الدولار بسعر الصرف الرسمي:",
    ...rows.map((r) => `${r.nameAr} ${n2(r.usd)} دولار (+${pct(r.wedge)} فوق سعر المعدن)`),
  ].join("\n");

  return {
    key: "country_wedge",
    table,
    caveat:
      "أسعار المعدن وأسعار الصرف في هذا المقال لحظية وفعلية. أما أرقام المصنعية فهي متوسطات تقديرية لكل سوق وليست تسعيرة محل بعينه — تختلف بين محل وآخر وبين التصميم البسيط والمصمم. الضرائب المذكورة هي النسب الرسمية المطبقة.",
    headline: `لماذا يدفع مشتري الذهب في ${hi.nameAr} ${pct(gap)} أكثر من ${lo.nameAr}؟`,
    opening:
      `اليوم، في نفس اللحظة، سعر جرام الذهب عيار 21 عالميا هو ${n2(gram21USD)} دولار. ` +
      `المعدن واحد، والبورصة واحدة، والثانية واحدة.\n\n` +
      `لكن من يشتريه في ${hi.nameAr} يدفع ما يعادل ${n2(hi.usd)} دولار. ` +
      `ومن يشتريه في ${lo.nameAr} يدفع ${n2(lo.usd)} دولار.\n\n` +
      `فارق ${pct(gap)} على معدن متطابق تماما. والفارق ليس في الذهب.`,
    angle:
      `اشرح أن الفارق يأتي من عنصرين فقط لا علاقة لهما بجودة الذهب: الضريبة ` +
      `(${hi.vatPct}% في ${hi.nameAr} مقابل ${lo.vatPct}% في ${lo.nameAr}) والمصنعية ` +
      `(أجرة تشكيل الجرام، وتختلف بحدة حسب المنافسة في كل سوق). ` +
      `ثم اشرح المغزى: المستهلك يظن أنه يقارن أسعار المعدن بين الدول، بينما هو يقارن ` +
      `أنظمة ضريبية وهوامش تجزئة.`,
    closing:
      `المحصلة أن "سعر الذهب اليوم" رقم ناقص بحد ذاته. الرقم الذي يهم المشتري هو ` +
      `سعر المعدن زائد المصنعية زائد الضريبة في سوقه هو.`,
    snippet:
      `جرام الذهب عيار 21 اليوم: ${n2(hi.usd)} دولار في ${hi.nameAr} مقابل ` +
      `${n2(lo.usd)} دولار في ${lo.nameAr}. نفس المعدن، فارق ${pct(gap)}.`,
  };
}

/* ── 2. Bar size: the smaller the bar, the worse the price ─────────────────── */
function bullionSize(ctx: FormatCtx): BuiltFormat {
  const pick = ["1g", "10g", "100g", "kilo"];
  const bars = BULLION_SIZES.filter((b) => pick.includes(b.key));
  const oneG = BULLION_SIZES.find((b) => b.key === "1g")!;
  const kilo = BULLION_SIZES.find((b) => b.key === "kilo")!;

  const kiloAsOne = 1000 * ctx.gram24 * (1 + kilo.premium);
  const kiloAsGrams = 1000 * ctx.gram24 * (1 + oneG.premium);
  const diff = kiloAsGrams - kiloAsOne;

  const table = [
    "الحجم | العلاوة فوق السعر الفوري",
    ...bars
      .sort((a, b) => b.grams - a.grams)
      .map((b) => `${b.ar} | ${pct(b.premium * 100)}`),
  ].join("\n");

  return {
    key: "bullion_size",
    table,
    caveat:
      "أسعار المعدن وأسعار الصرف في هذا المقال لحظية وفعلية. أما علاوات السبائك فهي متوسطات تقديرية للسوق وتختلف بين مصفاة وأخرى وبين تاجر وآخر.",
    headline: `نفس الكيلو من الذهب: فارق ${n0(diff)} دولار حسب حجم السبيكة`,
    opening:
      `سعر الجرام الفوري عيار 24 اليوم ${n2(ctx.gram24)} دولار. الرقم واحد للجميع.\n\n` +
      `لكن من يشتري كيلو ذهب في سبيكة واحدة يدفع نحو ${n0(kiloAsOne)} دولار. ` +
      `ومن يشتري نفس الكيلو على شكل ألف سبيكة وزن جرام يدفع نحو ${n0(kiloAsGrams)} دولار.\n\n` +
      `فارق ${n0(diff)} دولار. نفس الوزن، ونفس النقاء، ونفس اليوم.`,
    angle:
      `اشرح لماذا ترتفع علاوة التجزئة كلما صغرت السبيكة: تكلفة السبك والتغليف ` +
      `والشهادة ثابتة تقريبا لكل قطعة، فتتوزع على وزن أقل. ` +
      `ثم اشرح المفاضلة الحقيقية: السبائك الصغيرة أسهل في البيع الجزئي لاحقا، ` +
      `والكبيرة أوفر عند الشراء. لا ترجح أحدهما — اعرض الاعتبارين.`,
    closing:
      `العلاوة ليست رسما خفيا، لكنها نادرا ما تظهر في المقارنات التي يراها المشتري.`,
    snippet:
      `علاوة التجزئة على سبيكة الجرام الواحد ${pct(oneG.premium * 100)}، ` +
      `وعلى سبيكة الكيلو ${pct(kilo.premium * 100)}. نفس المعدن.`,
  };
}

/* ── 3. The karat ladder ───────────────────────────────────────────────────── */
function karatSpread(ctx: FormatCtx): BuiltFormat {
  const sar = ctx.rates["SAR"] ?? 3.75;
  const rows = KARATS.map((k) => ({
    karat: k.karat,
    usd: ctx.gram24 * k.factor,
    sar: ctx.gram24 * k.factor * sar,
    purity: Math.round(k.factor * 1000) / 10,
  }));
  const k24 = rows.find((r) => r.karat === 24)!;
  const k18 = rows.find((r) => r.karat === 18)!;
  const dropPct = (1 - k18.usd / k24.usd) * 100;

  const table = [
    "العيار | نسبة الذهب | سعر الجرام (دولار) | بالريال السعودي",
    ...rows.map((r) => `عيار ${r.karat} | ${r.purity}% | ${n2(r.usd)} | ${n2(r.sar)}`),
  ].join("\n");

  return {
    key: "karat_spread",
    table,
    caveat:
      "أسعار المعدن وأسعار الصرف في هذا المقال لحظية وفعلية. الأسعار المعروضة هي سعر المعدن الخام قبل المصنعية والضريبة، وهما يضافان في المحل.",
    headline: `عيار 18 أرخص بـ ${pct(dropPct)} من عيار 24 — وهذا ليس خصما`,
    opening:
      `جرام عيار 24 اليوم ${n2(k24.usd)} دولار. جرام عيار 18 بـ ${n2(k18.usd)} دولار.\n\n` +
      `الفارق ${pct(dropPct)}، وهو بالضبط فارق نسبة الذهب في السبيكة: ` +
      `عيار 24 ذهب بنسبة 100%، وعيار 18 بنسبة ${k18.purity}%. الباقي معادن أخرى.`,
    angle:
      `وضح أن العيار ليس مقياس جودة بل مقياس نسبة. اشرح أن العيار الأقل أصلب ` +
      `وأنسب للاستعمال اليومي، والأعلى أنقى وأنسب للادخار. ` +
      `ونبه إلى أن المصنعية تحسب على وزن القطعة كاملة لا على الذهب الصافي فيها، ` +
      `ولهذا قد تكون قطعة عيار 18 أغلى مما توحي به نسبتها.`,
    closing:
      `القاعدة العملية: قارن دائما سعر الجرام داخل نفس العيار. مقارنة عيار بعيار آخر ` +
      `مقارنة بين شيئين مختلفين.`,
    snippet:
      `عيار 24: ${n2(k24.usd)} دولار للجرام. عيار 18: ${n2(k18.usd)} دولار. ` +
      `الفارق ${pct(dropPct)} هو فارق نسبة الذهب، لا خصم.`,
  };
}

/* ── 4. Live nisab ─────────────────────────────────────────────────────────── */
function zakatNisab(ctx: FormatCtx): BuiltFormat {
  const NISAB_G = 85;                       // 85 g of pure gold
  const usd = NISAB_G * ctx.gram24;
  const show = ["sa", "ae", "eg", "kw", "qa", "jo"];
  const rows = show
    .map((code) => {
      const c = COUNTRIES.find((x) => x.code === code);
      const rate = c ? ctx.rates[c.currency] : undefined;
      return c && rate ? { nameAr: c.nameAr, cur: c.currencyAr, val: usd * rate } : null;
    })
    .filter(Boolean) as Array<{ nameAr: string; cur: string; val: number }>;

  const table = [
    "الدولة | نصاب الزكاة اليوم",
    ...rows.map((r) => `${r.nameAr} | ${n0(r.val)} ${r.cur}`),
  ].join("\n");

  return {
    key: "zakat_nisab",
    table,
    caveat:
      "أسعار المعدن وأسعار الصرف في هذا المقال لحظية وفعلية. قيمة النصاب محسوبة بسعر الذهب لحظة النشر وتتغير يوميا. المسائل الفقهية التفصيلية يرجع فيها إلى أهل العلم.",
    headline: `نصاب زكاة المال اليوم: ${n0(usd)} دولار`,
    opening:
      `النصاب مربوط بـ 85 جرام ذهب خالص. وبسعر اليوم (${n2(ctx.gram24)} دولار للجرام ` +
      `عيار 24) فإن النصاب يساوي ${n0(usd)} دولار.\n\n` +
      `الرقم يتحرك يوميا مع سعر الذهب، ومعظم الحاسبات على الإنترنت تستخدم سعرا قديما.`,
    angle:
      `اشرح أن النصاب ليس رقما ثابتا بل مشتق من سعر الذهب لحظة الحساب، وأن ` +
      `الفارق بين سعر اليوم وسعر قبل شهور قد يغير ما إذا كان المال بالغا للنصاب أصلا. ` +
      `اذكر شرط حولان الحول. لا تفت في مسائل فقهية خلافية ولا ترجح بين المذاهب.`,
    closing:
      `من بلغ ماله النصاب وحال عليه الحول، فالمقدار المعروف ربع العشر (2.5%). ` +
      `للمسائل التفصيلية يرجع إلى أهل العلم.`,
    snippet:
      `نصاب الزكاة اليوم ${n0(usd)} دولار — 85 جرام ذهب بسعر ` +
      `${n2(ctx.gram24)} دولار للجرام. الرقم يتغير يوميا.`,
  };
}

/* ── 5. Where the ounce sits ───────────────────────────────────────────────── */
function marketLevel(ctx: FormatCtx): BuiltFormat {
  const gram21 = ctx.gram24 * (21 / 24);
  const sar = ctx.rates["SAR"] ?? 3.75;
  const egp = ctx.rates["EGP"];

  const table = [
    "الوحدة | بالدولار",
    `أونصة (${n2(OZ)} جرام) | ${n2(ctx.goldOz)}`,
    `جرام عيار 24 | ${n2(ctx.gram24)}`,
    `جرام عيار 21 | ${n2(gram21)}`,
    "",
    "بالعملات المحلية (جرام عيار 21):",
    `السعودية | ${n2(gram21 * sar)} ريال`,
    ...(egp ? [`مصر | ${n2(gram21 * egp)} جنيه`] : []),
  ].join("\n");

  return {
    key: "market_level",
    table,
    caveat:
      "أسعار المعدن وأسعار الصرف في هذا المقال لحظية وفعلية. سعر الأونصة يتحرك خلال جلسة التداول، وقد يختلف الرقم بعد دقائق من النشر.",
    headline: `الأونصة عند ${n0(ctx.goldOz)} دولار — ماذا يعني الرقم للمشتري العادي؟`,
    opening:
      `أغلق الذهب عند ${n2(ctx.goldOz)} دولار للأونصة بنسبة تغير ` +
      `${ctx.changePct >= 0 ? "+" : ""}${ctx.changePct.toFixed(2)}%.\n\n` +
      `الأونصة وحدة تداول عالمية لا يشتري بها أحد في السوق المحلي. ` +
      `ما يهم المشتري هو أنها تعني ${n2(gram21)} دولار لجرام عيار 21.`,
    angle:
      `اشرح كيف يتحول سعر الأونصة العالمي إلى سعر الجرام المحلي: القسمة على ` +
      `${n2(OZ)} جرام، ثم تعديل العيار، ثم ضربه في سعر الصرف. ` +
      `ونبه إلى أن حركة العملة المحلية قد تحرك السعر المحلي حتى لو لم يتحرك الذهب عالميا. ` +
      `لا تتوقع اتجاه السعر ولا تعطِ أي توصية.`,
    closing:
      `تحويل الأونصة إلى الجرام المحلي هو الخطوة التي تسقط من معظم النشرات، ` +
      `وهي الخطوة الوحيدة التي تهم من يقف أمام المحل.`,
    snippet:
      `الأونصة عند ${n0(ctx.goldOz)} دولار = ${n2(gram21)} دولار لجرام عيار 21 ` +
      `(${n2(gram21 * sar)} ريال سعودي).`,
  };
}

/** Rotation order. One article per week, so each resurfaces every 5 weeks. */
export const FORMATS = [countryWedge, bullionSize, karatSpread, zakatNisab, marketLevel];

/** Monday-anchored week index, so Mon/Wed/Fri of one week share a theme. */
const EPOCH_MONDAY = Date.UTC(2026, 0, 5);

export function weekIndex(d: Date): number {
  const utcMidnight = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.floor((utcMidnight - EPOCH_MONDAY) / (7 * 86_400_000));
}

export function pickFormat(d: Date, ctx: FormatCtx): BuiltFormat {
  const i = ((weekIndex(d) % FORMATS.length) + FORMATS.length) % FORMATS.length;
  return FORMATS[i](ctx);
}
