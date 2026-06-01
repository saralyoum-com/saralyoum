import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

// Destination address lives only on the server — never sent to the client
const INBOX = process.env.CONTACT_INBOX ?? "sardhahab@gmail.com";

/** Escape HTML entities to prevent XSS in email templates */
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // ── Validation ────────────────────────────────────────────────────────────
    if (!name?.trim() || !email?.trim() || !message?.trim())
      return NextResponse.json({ error: "جميع الحقول مطلوبة" }, { status: 400 });

    if (name.trim().length > 100)
      return NextResponse.json({ error: "الاسم طويل جداً" }, { status: 400 });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });

    if (email.trim().length > 254)
      return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });

    if (message.trim().length < 10)
      return NextResponse.json({ error: "الرسالة قصيرة جداً" }, { status: 400 });

    if (message.trim().length > 2000)
      return NextResponse.json({ error: "الرسالة طويلة جداً (الحد 2000 حرف)" }, { status: 400 });

    // ── Send via Resend ───────────────────────────────────────────────────────
    const hasResend = process.env.RESEND_API_KEY &&
                      !process.env.RESEND_API_KEY.includes("your_");

    if (hasResend) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const safeName    = esc(name.trim());
      const safeEmail   = esc(email.trim());
      const safeMessage = esc(message.trim());

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: INBOX,
        replyTo: email.trim(),
        subject: `📩 رسالة جديدة من ${safeName} — سعر الذهب`,
        html: `
          <div dir="rtl" style="font-family:Helvetica,Arial,sans-serif;background:#0D0D0D;color:#F5F5F5;padding:32px;border-radius:16px;max-width:520px;margin:0 auto">
            <div style="text-align:center;margin-bottom:24px">
              <img src="https://sardhahab.com/logo.png" alt="سعر الذهب — SARD" width="80" height="80" style="border-radius:50%;margin-bottom:8px" />
              <h1 style="color:#C9A84C;margin:8px 0 4px;font-size:20px">رسالة جديدة</h1>
              <p style="color:#777;font-size:12px;margin:0"><a href="https://sardhahab.com" style="color:#C9A84C;text-decoration:none">sardhahab.com</a></p>
            </div>
            <div style="background:#1A1A1A;border:1px solid #2A2A2A;border-radius:12px;padding:20px;margin-bottom:16px">
              <table style="width:100%;font-size:14px;color:#CCC">
                <tr><td style="padding:6px 0;color:#888;width:100px">الاسم</td><td style="color:#F5F5F5;font-weight:bold">${safeName}</td></tr>
                <tr><td style="padding:6px 0;color:#888">البريد</td><td><a href="mailto:${safeEmail}" style="color:#C9A84C">${safeEmail}</a></td></tr>
              </table>
            </div>
            <div style="background:#1A1A1A;border:1px solid #2A2A2A;border-radius:12px;padding:20px">
              <p style="color:#888;font-size:12px;margin:0 0 8px">الرسالة</p>
              <p style="color:#F5F5F5;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap">${safeMessage}</p>
            </div>
            <p style="font-size:11px;color:#444;text-align:center;margin-top:20px">
              للرد مباشرةً على المرسل اضغط "رد" — البريد محفوظ في حقل reply-to
            </p>
          </div>
        `,
      });
    } else {
      // Log in dev when Resend is not wired up
      console.log("[Contact] Message received (Resend not configured):", { name, email, message });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact] Error:", err);
    return NextResponse.json({ error: "حدث خطأ، يُرجى المحاولة لاحقاً" }, { status: 500 });
  }
}
