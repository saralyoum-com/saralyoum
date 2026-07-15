import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
  // .trim() guards against trailing newlines baked into Vercel env values
  // (bit us before with ONESIGNAL_REST_API_KEY) — an untrimmed key throws
  // an opaque "invalid header value" error deep inside the HTTP client.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Supabase env vars not configured");
  return createClient(url, key, {
    // Next.js patches global fetch() to cache by default, and that patch
    // reaches into supabase-js's internal fetch calls even on routes marked
    // force-dynamic — without this, writes (e.g. approvals) can appear to
    // "not stick" because reads keep serving a cached pre-write response.
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}

export const supabaseSchema = `
-- جدول التنبيهات
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  asset TEXT NOT NULL CHECK (asset IN ('gold', 'silver', 'bitcoin', 'ethereum')),
  type TEXT NOT NULL CHECK (type IN ('daily', 'price')),
  target_price DECIMAL,
  condition TEXT CHECK (condition IN ('above', 'below')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_sent_at TIMESTAMPTZ
);

-- فهرس على الإيميل
CREATE INDEX IF NOT EXISTS alerts_email_idx ON alerts(email);
CREATE INDEX IF NOT EXISTS alerts_active_idx ON alerts(active);

-- جدول تتبع تنبيهات Push المرسلة (يمنع التكرار)
CREATE TABLE IF NOT EXISTS push_log (
  key TEXT PRIMARY KEY,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- جدول خطة المحتوى — لوحة الموافقة /sard-control
CREATE TABLE IF NOT EXISTS content_plan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_date DATE NOT NULL,
  slot TEXT NOT NULL CHECK (slot IN ('morning', 'educational', 'engagement')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'skipped', 'published')),
  template_ig TEXT,
  template_fb TEXT,
  topic TEXT,
  countries JSONB,
  ig_caption TEXT,
  fb_post TEXT,
  x_tweet TEXT,
  card_image_url TEXT,
  card_image_url_fb TEXT,
  market_up BOOLEAN,
  market_price NUMERIC,
  notes TEXT,
  design_notes TEXT,
  edited BOOLEAN DEFAULT false,
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  post_ids JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_date, slot)
);

CREATE INDEX IF NOT EXISTS content_plan_date_idx ON content_plan(post_date);
CREATE INDEX IF NOT EXISTS content_plan_status_idx ON content_plan(status);

-- RLS on: only the service_role key (used server-side by the Next.js API routes
-- and the Python cron) can read/write. No policies = anon key gets nothing.
ALTER TABLE content_plan ENABLE ROW LEVEL SECURITY;

-- جدول الأحداث — مصدر الحقيقة الذي نملكه (Move 1: unified analytics dispatcher)
-- Every track.* call fans out to GA4 + Amplitude + this table via /api/collect.
-- No PII: emails are SHA-256 hashed server-side before insert; no raw URLs with
-- query strings. This is the one store that can JOIN user events to agent events.
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  event TEXT NOT NULL,
  props JSONB,
  client_id TEXT,          -- GA client_id, so rows reconcile with GA4/Amplitude
  session_id TEXT,
  page_path TEXT,          -- pathname only, never the query string
  country_code TEXT,       -- from Vercel edge geo header, server-set
  device TEXT,             -- 'mobile' | 'desktop', server-derived from UA
  lang TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS events_event_idx ON events(event);
CREATE INDEX IF NOT EXISTS events_created_idx ON events(created_at);
CREATE INDEX IF NOT EXISTS events_client_idx ON events(client_id);

-- RLS on: service_role only, same posture as content_plan. Raw events never
-- reach the anon/client key. 13-month retention is enforced by a scheduled
-- DELETE (see /api/cron or a Supabase cron) — keep this table lean.
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
`;
