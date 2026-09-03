/**
 * Meta (Facebook Page + Instagram) source for the radar agent.
 *
 * Optional by design. The tokens live on Vercel and on the EC2 bot, so a local
 * run — or any deploy where they are not set — must degrade to `configured:
 * false` rather than throw. Everything else in the report still renders.
 *
 * IG uses graph.instagram.com with IG_USER_TOKEN (Instagram Login, 60-day
 * lifetime, refreshed weekly by maxtools/ig_token_refresh.py); FB uses
 * graph.facebook.com with the never-expiring FB_PAGE_TOKEN. They are different
 * tokens on different hosts — one dying does not imply the other is dead, so
 * each half reports its own error instead of failing the pair.
 *
 * REACH IS GONE ON FACEBOOK. Verified against v25 on 2 Sep 2026: every
 * impressions metric — page_impressions, page_impressions_unique,
 * post_impressions, post_impressions_unique — now returns "(#100) The value
 * must be a valid insights metric". This is Meta deprecating them, not a
 * permission gap: the same token reads the metrics listed below fine. So the
 * Facebook half reports engagement and views only, and flags reach as
 * unavailable rather than silently showing zero — a zero we did not measure is
 * worse than an honest gap. Instagram still serves `reach` normally.
 */

const FB = "https://graph.facebook.com/v25.0";
const IG = "https://graph.instagram.com/v25.0";

/** Confirmed valid on this page in v25 — see the note above before adding any. */
const FB_PAGE_METRICS = "page_post_engagements,page_views_total,page_follows";
const FB_POST_METRICS = "post_clicks,post_reactions_by_type_total";

export type SocialPost = {
  platform: "facebook" | "instagram";
  id: string;
  date: string;
  mediaType: string | null;
  /** null on Facebook — Meta removed the metric, we did not fail to read it. */
  reach: number | null;
  engagement: number | null;
  excerpt: string;
};

export type MetaSnapshot = {
  configured: boolean;
  facebook: {
    followers: number | null;
    engagements30d: number | null;
    pageViews30d: number | null;
    /** Always false on v25; kept explicit so the UI can say why reach is blank. */
    reachAvailable: boolean;
    error?: string;
  };
  instagram: {
    username: string | null;
    followers: number | null;
    reach30d: number | null;
    /**
     * Whether IG_USER_TOKEN still works. There is no introspection endpoint for
     * Instagram Login tokens — debug_token on graph.facebook.com rejects them —
     * so this is derived from whether the profile read actually succeeded.
     * Expiry date is genuinely unknowable here; the weekly refresh cron owns
     * that. What matters to the report is the binary: can we still publish.
     */
    tokenValid: boolean;
    error?: string;
  };
  posts: SocialPost[];
};

export const EMPTY_META: MetaSnapshot = {
  configured: false,
  facebook: { followers: null, engagements30d: null, pageViews30d: null, reachAvailable: false },
  instagram: { username: null, followers: null, reach30d: null, tokenValid: false },
  posts: [],
};

export function metaConfigured(): boolean {
  return Boolean(
    process.env.FB_PAGE_ID &&
      process.env.FB_PAGE_TOKEN &&
      process.env.INSTAGRAM_ACCOUNT_ID &&
      process.env.IG_USER_TOKEN
  );
}

type GraphError = { error?: { message: string; code?: number } };
type InsightSeries = { name: string; values?: { value: unknown }[] }[];

async function graph<T>(url: string): Promise<T | { __error: string }> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = (await res.json()) as T & GraphError;
    if (json.error) {
      return { __error: `${json.error.message}${json.error.code ? ` (${json.error.code})` : ""}` };
    }
    return json;
  } catch (e) {
    return { __error: e instanceof Error ? e.message : "network error" };
  }
}

const failed = (v: unknown): v is { __error: string } =>
  typeof v === "object" && v !== null && "__error" in v;

/**
 * Sum one insights series. Meta mixes shapes: a daily metric is a list of
 * numbers, while post_reactions_by_type_total is a single object keyed by
 * reaction. Both collapse to one total here.
 */
function sumSeries(data: InsightSeries | undefined, name: string): number | null {
  const metric = data?.find((m) => m.name === name);
  if (!metric?.values) return null;
  let total = 0;
  for (const entry of metric.values) {
    if (typeof entry.value === "number") total += entry.value;
    else if (entry.value && typeof entry.value === "object") {
      for (const n of Object.values(entry.value as Record<string, unknown>)) {
        if (typeof n === "number") total += n;
      }
    }
  }
  return total;
}

export async function metaSnapshot(days = 30): Promise<MetaSnapshot> {
  if (!metaConfigured()) return EMPTY_META;

  const until = Math.floor(Date.now() / 1000);
  const since = until - days * 86_400;
  const pageId = process.env.FB_PAGE_ID!;
  const pageToken = process.env.FB_PAGE_TOKEN!;
  const igId = process.env.INSTAGRAM_ACCOUNT_ID!;
  const igToken = process.env.IG_USER_TOKEN!;

  const [page, pageIns, fbPosts, igMe, igIns, igMedia] = await Promise.all([
    graph<{ followers_count?: number; fan_count?: number }>(
      `${FB}/${pageId}?fields=followers_count,fan_count&access_token=${pageToken}`
    ),
    graph<{ data?: InsightSeries }>(
      `${FB}/${pageId}/insights?metric=${FB_PAGE_METRICS}&period=day&since=${since}&until=${until}&access_token=${pageToken}`
    ),
    graph<{
      data?: {
        id: string;
        created_time: string;
        message?: string;
        insights?: { data?: InsightSeries };
      }[];
    }>(
      `${FB}/${pageId}/posts?fields=id,created_time,message,insights.metric(${FB_POST_METRICS})&limit=10&access_token=${pageToken}`
    ),
    graph<{ username?: string; followers_count?: number }>(
      `${IG}/${igId}?fields=username,followers_count&access_token=${igToken}`
    ),
    graph<{ data?: InsightSeries }>(
      `${IG}/${igId}/insights?metric=reach&period=day&since=${since}&until=${until}&access_token=${igToken}`
    ),
    graph<{
      data?: {
        id: string;
        timestamp: string;
        caption?: string;
        media_type?: string;
        like_count?: number;
        comments_count?: number;
        insights?: { data?: InsightSeries };
      }[];
    }>(
      `${IG}/${igId}/media?fields=id,timestamp,caption,media_type,like_count,comments_count,insights.metric(reach)&limit=25&access_token=${igToken}`
    ),
  ]);

  const posts: SocialPost[] = [];

  if (!failed(fbPosts)) {
    for (const p of fbPosts.data ?? []) {
      const clicks = sumSeries(p.insights?.data, "post_clicks") ?? 0;
      const reactions = sumSeries(p.insights?.data, "post_reactions_by_type_total") ?? 0;
      posts.push({
        platform: "facebook",
        id: p.id,
        date: p.created_time.slice(0, 10),
        mediaType: null,
        reach: null, // deprecated by Meta — see the file header
        engagement: clicks + reactions,
        excerpt: (p.message ?? "").replace(/\s+/g, " ").slice(0, 80),
      });
    }
  }

  if (!failed(igMedia)) {
    for (const m of igMedia.data ?? []) {
      posts.push({
        platform: "instagram",
        id: m.id,
        date: m.timestamp.slice(0, 10),
        mediaType: m.media_type ?? null,
        reach: sumSeries(m.insights?.data, "reach"),
        engagement: (m.like_count ?? 0) + (m.comments_count ?? 0),
        excerpt: (m.caption ?? "").replace(/\s+/g, " ").slice(0, 80),
      });
    }
  }

  posts.sort((a, b) => b.date.localeCompare(a.date));

  return {
    configured: true,
    facebook: {
      followers: failed(page) ? null : page.followers_count ?? page.fan_count ?? null,
      // A successful call that returns an empty series means genuinely zero
      // activity, not a failed read — so only a real error yields null. The
      // difference matters: null renders as "unknown", 0 renders as a finding.
      engagements30d: failed(pageIns) ? null : sumSeries(pageIns.data, "page_post_engagements") ?? 0,
      pageViews30d: failed(pageIns) ? null : sumSeries(pageIns.data, "page_views_total") ?? 0,
      reachAvailable: false,
      ...(failed(page) ? { error: page.__error } : {}),
    },
    instagram: {
      username: failed(igMe) ? null : igMe.username ?? null,
      followers: failed(igMe) ? null : igMe.followers_count ?? null,
      reach30d: failed(igIns) ? null : sumSeries(igIns.data, "reach") ?? 0,
      tokenValid: !failed(igMe),
      ...(failed(igMe) ? { error: igMe.__error } : {}),
    },
    posts: posts.slice(0, 25),
  };
}
