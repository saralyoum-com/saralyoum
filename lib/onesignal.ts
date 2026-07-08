const APP_ID = (process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "").trim();
const REST_KEY = (process.env.ONESIGNAL_REST_API_KEY || "").trim();
const ICON_URL = "https://sardhahab.com/logo.png";

interface PushPayload {
  headingAr: string;
  contentAr: string;
  url?: string;
}

export async function sendPushToAll({ headingAr, contentAr, url = "https://sardhahab.com" }: PushPayload) {
  if (!APP_ID || !REST_KEY) return { error: "OneSignal not configured" };

  const res = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${REST_KEY}`,
    },
    body: JSON.stringify({
      app_id: APP_ID,
      // "Subscribed Users" is OneSignal's legacy default segment name and does not
      // exist on this app (created with the newer default segment set) — targeting
      // it silently sent to nobody. "Active Subscriptions" is this app's equivalent:
      // everyone currently opted in and reachable.
      included_segments: ["Active Subscriptions"],
      headings: { ar: headingAr, en: headingAr },
      contents: { ar: contentAr, en: contentAr },
      url,
      chrome_web_icon: ICON_URL,
      firefox_icon: ICON_URL,
      chrome_web_badge: ICON_URL,
      web_push_topic: "daily-gold-price",
    }),
  });

  return res.json();
}

// Push to specific OneSignal player IDs (e.g. a re-engagement nudge targeted
// at inactive subscribers) instead of a broadcast segment.
export async function sendPushToPlayers(playerIds: string[], { headingAr, contentAr, url = "https://sardhahab.com" }: PushPayload) {
  if (!APP_ID || !REST_KEY) return { error: "OneSignal not configured" };
  if (playerIds.length === 0) return { error: "no players" };

  const res = await fetch("https://api.onesignal.com/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${REST_KEY}`,
    },
    body: JSON.stringify({
      app_id: APP_ID,
      include_player_ids: playerIds,
      headings: { ar: headingAr, en: headingAr },
      contents: { ar: contentAr, en: contentAr },
      url,
      chrome_web_icon: ICON_URL,
      firefox_icon: ICON_URL,
      chrome_web_badge: ICON_URL,
    }),
  });

  return res.json();
}

// All current OneSignal player records for this app (paginated, capped at a
// few thousand — plenty for this site's subscriber count). Includes tags —
// used e.g. to read back the poll_* tags set client-side by GoldPredictionPoll.
export async function listPlayers(): Promise<Array<{
  id: string;
  last_active: number;
  invalid_identifier: boolean;
  tags?: Record<string, string>;
}>> {
  if (!APP_ID || !REST_KEY) return [];
  const res = await fetch(`https://api.onesignal.com/players?app_id=${APP_ID}&limit=300`, {
    headers: { Authorization: `Key ${REST_KEY}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.players ?? [];
}

// Update (or clear, with "" values) a player's tags server-side — used to
// mark a poll prediction as resolved so it isn't picked up again.
export async function setPlayerTags(playerId: string, tags: Record<string, string>) {
  if (!APP_ID || !REST_KEY) return { error: "OneSignal not configured" };
  const res = await fetch(`https://api.onesignal.com/players/${playerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${REST_KEY}`,
    },
    body: JSON.stringify({ app_id: APP_ID, tags }),
  });
  return res.json();
}
