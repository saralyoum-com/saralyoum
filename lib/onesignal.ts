const APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "";
const REST_KEY = (process.env.ONESIGNAL_REST_API_KEY || "").trim();

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
      included_segments: ["Subscribed Users"],
      headings: { ar: headingAr, en: headingAr },
      contents: { ar: contentAr, en: contentAr },
      url,
      web_push_topic: "daily-gold-price",
    }),
  });

  return res.json();
}
