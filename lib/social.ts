// Shared social posting helpers — Facebook Page + Instagram Business
// Facebook uses graph.facebook.com with FB_PAGE_TOKEN (never-expiring page token)
// Instagram uses graph.instagram.com with IG_USER_TOKEN (60-day, from Instagram Login flow)

// Build a dynamic 1080×1350 social card URL with live price data embedded as params.
// Instagram downloads this URL when publishing — prices are baked in at cron time.
export function buildSocialCardUrl(params: {
  type: "morning" | "educational" | "breaking";
  gold: string;
  change: string;
  dir: "up" | "down";
  date?: string;
  silver?: string;
  btc?: string;
  topic?: string;
}): string {
  const sp = new URLSearchParams({ type: params.type, gold: params.gold, change: params.change, dir: params.dir });
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
