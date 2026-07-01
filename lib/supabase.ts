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
`;
