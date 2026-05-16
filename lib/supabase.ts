import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured");
  return createClient(url, key);
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
`;
