import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-setup-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  try {
    const { createServiceClient } = await import("@/lib/supabase");
    const supabase = createServiceClient();

    // إنشاء الجدول عبر SQL مباشر
    const { error } = await supabase.rpc("exec_sql", {
      sql: `
        CREATE TABLE IF NOT EXISTS alerts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email TEXT NOT NULL,
          asset TEXT NOT NULL,
          type TEXT NOT NULL,
          target_price DECIMAL,
          condition TEXT,
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          last_sent_at TIMESTAMPTZ
        );
        CREATE INDEX IF NOT EXISTS alerts_email_idx ON alerts(email);
        CREATE INDEX IF NOT EXISTS alerts_active_idx ON alerts(active);
      `,
    });

    if (error) {
      // الجدول ربما موجود أصلاً، نتحقق
      const { error: checkError } = await supabase.from("alerts").select("id").limit(1);
      if (!checkError) {
        return NextResponse.json({ success: true, message: "الجدول موجود بالفعل" });
      }
      return NextResponse.json({ error: error.message, hint: "شغّل SQL يدوياً من Supabase Dashboard" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "تم إنشاء الجدول بنجاح" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
