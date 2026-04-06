import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
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
