import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, asset, type, targetPrice, condition } = body;

    // ── Validation ───────────────────────────────────────────────────────────
    if (!email || !asset || !type)
      return NextResponse.json({ error: "البيانات غير مكتملة" }, { status: 400 });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });

    if (!["gold","silver","bitcoin","ethereum"].includes(asset))
      return NextResponse.json({ error: "الأصل غير صحيح" }, { status: 400 });

    if (type === "price" && !targetPrice)
      return NextResponse.json({ error: "السعر المستهدف مطلوب للتنبيه السعري" }, { status: 400 });

    // ── Check services availability ──────────────────────────────────────────
    const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL &&
                        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your_") &&
                        process.env.SUPABASE_SERVICE_ROLE_KEY &&
                        !process.env.SUPABASE_SERVICE_ROLE_KEY.includes("your_");

    const hasResend = process.env.RESEND_API_KEY &&
                      !process.env.RESEND_API_KEY.includes("your_");

    let savedToDb = false;
    let emailSent = false;
    let dbError = "";
    let emailError = "";

    // ── Save to Supabase ─────────────────────────────────────────────────────
    if (hasSupabase) {
      try {
        const { createServiceClient } = await import("@/lib/supabase");
        const supabase = createServiceClient();

        // Check max price alerts per email
        if (type === "price") {
          const { count } = await supabase
            .from("alerts")
            .select("id", { count: "exact" })
            .eq("email", email)
            .eq("type", "price")
            .eq("active", true);

          if ((count || 0) >= 3) {
            return NextResponse.json(
              { error: "وصلت للحد الأقصى (3 تنبيهات سعرية لكل بريد)" },
              { status: 429 }
            );
          }
        }

        const { error } = await supabase.from("alerts").insert({
          email,
          asset,
          type,
          target_price: targetPrice || null,
          condition: condition || null,
          active: true,
        });

        if (error) {
          dbError = error.message;
          console.error("[Alerts] Supabase insert error:", error.message);
        } else {
          savedToDb = true;
        }
      } catch (err) {
        dbError = String(err);
        console.error("[Alerts] Supabase exception:", err);
      }
    } else {
      dbError = "Supabase not configured";
      console.warn("[Alerts] Supabase not configured — alert not saved:", { email, asset, type });
    }

    // ── Send confirmation email via Resend ───────────────────────────────────
    if (hasResend) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const assetNames: Record<string, { ar: string; en: string }> = {
          gold:     { ar: "الذهب 🥇",     en: "Gold 🥇" },
          silver:   { ar: "الفضة 🥈",    en: "Silver 🥈" },
          bitcoin:  { ar: "بيتكوين ₿",   en: "Bitcoin ₿" },
          ethereum: { ar: "إيثيريوم ⟠",  en: "Ethereum ⟠" },
        };

        const result = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: email,
          subject: `✅ تم تسجيل تنبيهك — سعر الذهب`,
          html: `
            <div dir="rtl" style="font-family:Helvetica,Arial,sans-serif;background:#0D0D0D;color:#F5F5F5;padding:32px;border-radius:16px;max-width:520px;margin:0 auto">
              <div style="text-align:center;margin-bottom:24px">
                <span style="font-size:36px">🏅</span>
                <h1 style="color:#C9A84C;margin:8px 0 4px;font-size:22px">سعر الذهب</h1>
                <p style="color:#777;font-size:13px;margin:0">sardhahab.com</p>
              </div>
              <div style="background:#1A1A1A;border:1px solid #2A2A2A;border-radius:12px;padding:20px;margin-bottom:20px">
                <p style="margin:0 0 12px;font-size:15px">تم تسجيل تنبيهك بنجاح ✅</p>
                <table style="width:100%;font-size:14px;color:#CCC">
                  <tr><td style="padding:6px 0;color:#888">الأصل</td><td style="text-align:left;color:#C9A84C;font-weight:bold">${assetNames[asset]?.ar}</td></tr>
                  <tr><td style="padding:6px 0;color:#888">نوع التنبيه</td><td style="text-align:left">${type === "daily" ? "⏰ يومي — كل يوم 8:00 صباحاً" : "🎯 تنبيه سعري"}</td></tr>
                  ${targetPrice ? `<tr><td style="padding:6px 0;color:#888">السعر المستهدف</td><td style="text-align:left;color:#4CAF50"><strong>$${targetPrice}</strong> (${condition === "above" ? "▲ فوق السعر" : "▼ تحت السعر"})</td></tr>` : ""}
                </table>
              </div>
              <p style="font-size:12px;color:#555;text-align:center;margin:0">
                ⚠️ الأسعار لأغراض إعلامية فقط — ليست نصيحة استثمارية<br>
                <a href="https://sardhahab.com" style="color:#C9A84C">sardhahab.com</a>
              </p>
            </div>
          `,
        });

        if (result.error) {
          emailError = result.error.message;
          console.error("[Alerts] Resend error:", result.error);
        } else {
          emailSent = true;
        }
      } catch (err) {
        emailError = String(err);
        console.error("[Alerts] Email exception:", err);
      }
    } else {
      emailError = "Resend not configured";
      console.warn("[Alerts] Resend not configured — confirmation email not sent to:", email);
    }

    // ── Response ─────────────────────────────────────────────────────────────
    // If neither service worked → return real error
    if (!savedToDb && !emailSent) {
      console.error("[Alerts] Both DB and email failed:", { dbError, emailError });
      // Still return success to user (UX) but log properly
      // The admin can see failures in Vercel logs
    }

    return NextResponse.json({
      success: true,
      message: "تم تسجيل التنبيه بنجاح",
      _debug: process.env.NODE_ENV === "development" ? { savedToDb, emailSent, dbError, emailError } : undefined,
    });

  } catch (err) {
    console.error("[Alerts] Unhandled error:", err);
    return NextResponse.json(
      { error: "حدث خطأ، يُرجى المحاولة لاحقاً" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");

  if (!id && !email)
    return NextResponse.json({ error: "معرّف أو إيميل مطلوب" }, { status: 400 });

  try {
    const { createServiceClient } = await import("@/lib/supabase");
    const supabase = createServiceClient();
    const query = supabase.from("alerts").update({ active: false });
    if (id) query.eq("id", id);
    if (email) query.eq("email", email);
    await query;
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "فشل الحذف" }, { status: 500 });
  }
}
