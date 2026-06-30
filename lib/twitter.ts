import { TwitterApi } from "twitter-api-v2";

let _client: TwitterApi | null = null;

function getClient(): TwitterApi {
  if (_client) return _client;
  _client = new TwitterApi({
    appKey:      process.env.X_API_KEY!,
    appSecret:   process.env.X_API_SECRET!,
    accessToken: process.env.X_ACCESS_TOKEN!,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
  });
  return _client;
}

export async function postToX(text: string, imageUrl?: string): Promise<{ id: string }> {
  const client = getClient();

  if (imageUrl) {
    const imgRes = await fetch(imageUrl);
    if (!imgRes.ok) throw new Error(`Card image fetch failed: ${imgRes.status}`);
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const mediaId = await client.v1.uploadMedia(buffer, { mimeType: "image/png" });
    const res = await client.v2.tweet({ text, media: { media_ids: [mediaId] } });
    return { id: res.data.id };
  }

  const res = await client.v2.tweet(text);
  return { id: res.data.id };
}
