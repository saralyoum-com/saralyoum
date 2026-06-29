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

export async function postToX(text: string): Promise<{ id: string }> {
  const client = getClient();
  const res = await client.v2.tweet(text);
  return { id: res.data.id };
}
