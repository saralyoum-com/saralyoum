// Shared social posting helpers — Facebook Page + Instagram Business
// Facebook uses graph.facebook.com with FB_PAGE_TOKEN (never-expiring page token)
// Instagram uses graph.instagram.com with IG_USER_TOKEN (60-day, from Instagram Login flow)

import type { ExchangeRate } from "./exchangerate";
import { COUNTRIES } from "./countries";

// ── Country rotation for social cards ──────────────────────────────────────────

const GRAM_PER_OZ = 31.1035;

const ROTATION_GROUPS: { code: string; cur: string }[][] = [
  // 0 – Sat + Fri: الخليج الكبير
  [{ code: "sa", cur: "ر.س" }, { code: "ae", cur: "د.إ" }, { code: "kw", cur: "د.ك" }],
  // 1 – Sun: شمال أفريقيا
  [{ code: "eg", cur: "ج.م" }, { code: "ma", cur: "د.م" }, { code: "dz", cur: "د.ج" }],
  // 2 – Mon: الخليج الصغير
  [{ code: "qa", cur: "ر.ق" }, { code: "bh", cur: "د.ب" }, { code: "om", cur: "ر.ع" }],
  // 3 – Tue: المشرق
  [{ code: "jo", cur: "د.أ" }, { code: "lb", cur: "ل.ل" }, { code: "iq", cur: "د.ع" }],
  // 4 – Wed: المغرب العربي
  [{ code: "tn", cur: "د.ت" }, { code: "ly", cur: "د.ل" }, { code: "sd", cur: "ج.س" }],
  // 5 – Thu: متنوع
  [{ code: "ye", cur: "ر.ي" }, { code: "ps", cur: "ش.ج" }, { code: "sa", cur: "ر.س" }],
];

// JS getDay(): 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
const DAY_TO_GROUP = [1, 2, 3, 4, 5, 0, 0];

export interface CardCountryRow {
  name: string;
  flag: string;
  price: string;
  currency: string;
  chg: string;
  up: boolean;
}

export function buildCardCountryRows(
  rates: ExchangeRate[],
  goldOzUSD: number,
  goldChangePercent: number,
): CardCountryRow[] {
  const ksa    = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Riyadh" }));
  const group  = ROTATION_GROUPS[DAY_TO_GROUP[ksa.getDay()]];
  const gUSD   = goldOzUSD / GRAM_PER_OZ;

  return group.map(({ code, cur }) => {
    const country = COUNTRIES.find(c => c.code === code);
    const rate    = rates.find(r => r.code === country?.currency);
    if (!country || !rate) return { name: code, flag: "🏳️", price: "—", currency: cur, chg: "+0.00%", up: true };

    const gramPrice = gUSD * rate.rate;
    const price     = gramPrice >= 1_000_000
      ? `${(gramPrice / 1_000_000).toFixed(2)}م`
      : gramPrice >= 1_000
        ? Math.round(gramPrice).toLocaleString("en-US")
        : gramPrice.toFixed(2);

    const localChg = goldChangePercent + (rate.changePercent ?? 0);
    const up       = localChg >= 0;

    return {
      name:     country.nameAr,
      flag:     country.flag,
      price,
      currency: cur,
      chg:      `${up ? "+" : ""}${localChg.toFixed(2)}%`,
      up,
    };
  });
}

/** Encode rows as URL-safe string: flag|name|price|cur|chg|up joined by ~ */
export function encodeCardRows(rows: CardCountryRow[]): string {
  return rows.map(r =>
    [r.flag, r.name, r.price, r.currency, r.chg, r.up ? "1" : "0"].join("|")
  ).join("~");
}

/** Decode rows from URL param */
export function decodeCardRows(raw: string): CardCountryRow[] {
  return raw.split("~").map(seg => {
    const [flag, name, price, currency, chg, upStr] = seg.split("|");
    return { flag: flag ?? "🏳️", name: name ?? "", price: price ?? "—", currency: currency ?? "", chg: chg ?? "+0.00%", up: upStr === "1" };
  });
}

// Build a dynamic social card URL with live price data embedded as params.
export function buildSocialCardUrl(params: {
  type: "morning" | "educational" | "breaking" | "engagement";
  gold: string;
  change: string;
  dir: "up" | "down";
  rows?: CardCountryRow[];
  date?: string;
  silver?: string;
  btc?: string;
  topic?: string;
}): string {
  const sp = new URLSearchParams({ type: params.type, gold: params.gold, change: params.change, dir: params.dir });
  if (params.rows)   sp.set("rows",   encodeCardRows(params.rows));
  if (params.date)   sp.set("date",   params.date);
  if (params.silver) sp.set("silver", params.silver);
  if (params.btc)    sp.set("btc",    params.btc);
  if (params.topic)  sp.set("topic",  params.topic);
  return `https://sardhahab.com/api/social-card?${sp.toString()}`;
}

const FB_PAGE_ID  = process.env.FB_PAGE_ID  ?? "1115554444982087";
const IG_USER_ID  = process.env.INSTAGRAM_ACCOUNT_ID ?? "27063991809949500";
const IG_API_BASE = "https://graph.instagram.com/v25.0";
const FB_API_BASE = "https://graph.facebook.com/v25.0";

export async function postToInstagram(caption: string, imageUrl: string): Promise<string> {
  const token = process.env.IG_USER_TOKEN;
  if (!token) throw new Error("IG_USER_TOKEN not configured");

  const containerForm = new FormData();
  containerForm.append("image_url", imageUrl);
  containerForm.append("caption", caption);
  containerForm.append("access_token", token);

  const containerRes = await fetch(`${IG_API_BASE}/${IG_USER_ID}/media`, {
    method: "POST",
    body: containerForm,
  });
  const container = await containerRes.json() as { id?: string; error?: unknown };
  if (!container.id) throw new Error(`IG container: ${JSON.stringify(container.error)}`);

  const pubForm = new FormData();
  pubForm.append("creation_id", container.id);
  pubForm.append("access_token", token);

  const pubRes = await fetch(`${IG_API_BASE}/${IG_USER_ID}/media_publish`, {
    method: "POST",
    body: pubForm,
  });
  const pub = await pubRes.json() as { id?: string; error?: unknown };
  if (!pub.id) throw new Error(`IG publish: ${JSON.stringify(pub.error)}`);

  return pub.id;
}

export async function postToFacebook(message: string, imageUrl?: string): Promise<string> {
  const token = process.env.FB_PAGE_TOKEN;
  if (!token) throw new Error("FB_PAGE_TOKEN not configured");

  if (imageUrl) {
    // 2-step: upload photo unpublished → attach to /feed
    const photoForm = new FormData();
    photoForm.append("url", imageUrl);
    photoForm.append("published", "false");
    photoForm.append("access_token", token);

    const photoRes = await fetch(`${FB_API_BASE}/${FB_PAGE_ID}/photos`, {
      method: "POST",
      body: photoForm,
    });
    const photo = await photoRes.json() as { id?: string; error?: unknown };
    if (!photo.id) throw new Error(`FB photo: ${JSON.stringify(photo.error)}`);

    const feedForm = new FormData();
    feedForm.append("message", message);
    feedForm.append("attached_media", JSON.stringify([{ media_fbid: photo.id }]));
    feedForm.append("access_token", token);

    const feedRes = await fetch(`${FB_API_BASE}/${FB_PAGE_ID}/feed`, {
      method: "POST",
      body: feedForm,
    });
    const feed = await feedRes.json() as { id?: string; error?: unknown };
    if (!feed.id) throw new Error(`FB feed: ${JSON.stringify(feed.error)}`);
    return feed.id;
  }

  // Text-only fallback
  const form = new FormData();
  form.append("message", message);
  form.append("access_token", token);

  const res = await fetch(`${FB_API_BASE}/${FB_PAGE_ID}/feed`, {
    method: "POST",
    body: form,
  });
  const data = await res.json() as { id?: string; error?: unknown };
  if (!data.id) throw new Error(`FB text post: ${JSON.stringify(data.error)}`);
  return data.id;
}
