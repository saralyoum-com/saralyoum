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
// "deepseek-chat" was retired upstream — the API now 400s with "supported API
// model names are deepseek-v4-pro or deepseek-v4-flash". That was the real
// cause of the silent LinkedIn-draft outage (found 26 Jul 2026).
const DEEPSEEK_MODEL = "deepseek-v4-flash";
const GROQ_URL       = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL     = "llama-3.3-70b-versatile";

const TIMEOUT_MS = 45_000;

// DeepSeek v4 is a REASONING model: it spends tokens on internal reasoning
// before emitting content, and those tokens count against max_tokens. A small
// budget returns content:"" with finish_reason:"length" — a silent empty
// string. Give it headroom on top of whatever the caller asked for.
const REASONING_HEADROOM = 600;

/** One OpenAI-compatible chat call with a hard timeout (both providers share the shape). */
async function callProvider(
  url: string, key: string, model: string,
  system: string, user: string, maxTokens: number,
): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({
        model,
        // only DeepSeek needs the reasoning headroom; Groq is not a reasoning model
        max_tokens: model === DEEPSEEK_MODEL
          ? Math.max(maxTokens + REASONING_HEADROOM, 700)
          : maxTokens,
        messages: [
          { role: "system", content: system },
          { role: "user",   content: user   },
        ],
      }),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const err = await res.text().catch(() => res.statusText);
      throw new Error(`${model} API error ${res.status}: ${err}`);
    }
    const data = await res.json() as { choices?: { message?: { content?: string } }[] };
    const text = data?.choices?.[0]?.message?.content ?? "";
    if (!text) throw new Error(`${model} returned empty content (reasoning likely consumed the token budget)`);
    return text.trim();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Chat with DeepSeek, falling back to Groq on ANY DeepSeek failure.
 *
 * Previously this was DeepSeek-only with no timeout or fallback, so a single
 * flaky upstream call took the whole route down with a 500 — that is exactly
 * what silently killed the LinkedIn draft cron (caught 26 Jul 2026: DeepSeek
 * was intermittently timing out and DNS-failing, and no draft ever reached
 * Telegram). The Python bot already had this retry+Groq pattern and kept
 * posting through the same outage; this brings the website in line.
 */
export async function chat(system: string, user: string, maxTokens = 900): Promise<string> {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const groqKey     = process.env.GROQ_API_KEY;

  if (deepseekKey) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        return await callProvider(DEEPSEEK_URL, deepseekKey, DEEPSEEK_MODEL, system, user, maxTokens);
      } catch (err) {
        console.warn(`[ai] DeepSeek attempt ${attempt} failed:`, err instanceof Error ? err.message : err);
        if (attempt === 1) await new Promise(r => setTimeout(r, 1500));
      }
    }
  } else {
    console.warn("[ai] DEEPSEEK_API_KEY not configured — going straight to Groq");
  }

  if (groqKey) {
    console.warn("[ai] falling back to Groq");
    return await callProvider(GROQ_URL, groqKey, GROQ_MODEL, system, user, maxTokens);
  }

  throw new Error("All AI providers failed (DeepSeek unavailable, GROQ_API_KEY not configured)");
}
