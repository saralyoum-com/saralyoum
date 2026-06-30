// Thin wrapper around DeepSeek chat API (OpenAI-compatible format)
// Uses DEEPSEEK_API_KEY env var — set in Vercel production env

export interface SocialPosts {
  instagram: string;
  facebook: string;
  telegram: string;
  x: string;
  linkedin: string;
}

/** Parse DeepSeek JSON response. Falls back to field-level regex extraction so raw JSON never leaks into a caption. */
export function parseSocialPosts(raw: string, fallbackText: string): SocialPosts {
  // Try full JSON parse
  try {
    const jsonStr = raw.match(/\{[\s\S]*\}/)?.[0] ?? raw;
    const parsed = JSON.parse(jsonStr) as Partial<SocialPosts>;
    if (parsed.instagram && parsed.facebook) return parsed as SocialPosts;
  } catch { /* fall through */ }

  // Field-level regex extraction — works even when JSON is slightly malformed
  const extract = (key: string): string => {
    const m = raw.match(new RegExp(`"${key}"\\s*:\\s*"([\\s\\S]*?)(?<!\\\\)"(?:\\s*[,}])`));
    return m ? m[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : fallbackText;
  };

  return {
    instagram: extract("instagram"),
    facebook:  extract("facebook"),
    telegram:  extract("telegram"),
    x:         extract("x"),
    linkedin:  extract("linkedin"),
  };
}

const DEEPSEEK_URL   = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_MODEL = "deepseek-chat";

export async function chat(system: string, user: string, maxTokens = 900): Promise<string> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new Error("DEEPSEEK_API_KEY not configured");

  const res = await fetch(DEEPSEEK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user",   content: user   },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`DeepSeek API error ${res.status}: ${err}`);
  }

  const data = await res.json() as { choices?: { message?: { content?: string } }[] };
  const text = data?.choices?.[0]?.message?.content ?? "";
  if (!text) throw new Error("DeepSeek returned empty content");
  return text.trim();
}
