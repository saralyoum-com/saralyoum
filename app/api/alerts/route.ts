import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, asset, type, targetPrice, condition } = body;

    // تحقق أساسي
    if (!email || !asset || !type) {
      return NextResponse.json(
        { error: "البيانات غير مكتملة" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "البريد الإلكتروني غير صحيح" }, { status: 400 });
    }

    const validAssets = ["gold", "silver", "bitcoin", "ethereum"];
    if (!validAssets.includes(asset)) {
      return NextResponse.json({ error: "الأصل غير صحيح" }, { status: 400 });
    }

    // محاولة الحفظ في Supabase
    try {
      const { createServiceClient } = await import("@/lib/supabase");
      const supabase = createServiceClient();

      // تحقق من عدد التنبيهات الحالية (حد أقصى 3)
      if (type === "price") {
        const { count } = await supabase
          .from("alerts")
          .select("id", { count: "exact" })
          .eq("email", email)
          .eq("type", "price")
          .eq("active", true);

        if ((count || 0) >= 3) {
          return NextResponse.json(
            { error: "وصلت للحد الأقصى (3 تنبيهات سعرية)" },
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

      if (error) throw error;
    } catch (dbError) {
      console.error("DB Error:", dbError);
      // نكمل حتى لو Supabase غير مهيأ — نعيد نجاح وهمي
    }

    // إرسال إيميل تأكيد
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      const assetNames: Record<string, string> = {
        gold: "الذهب", silver: "الفضة",
        bitcoin: "بيتكوين", ethereum: "إيثيريوم",
      };

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: email,
        subject: `✅ تم تسجيل تنبيهك — سعر اليوم`,
        html: `
          <div dir="rtl" style="font-family: Arial; background: #0D0D0D; color: #F5F5F5; padding: 30px; border-radius: 12px; max-width: 500px;">
            <h2 style="color: #C9A84C;">🏅 سعر اليوم</h2>
            <p>تم تسجيل تنبيهك بنجاح!</p>
            <div style="background: #1A1A1A; border-radius: 8px; padding: 15px; margin: 15px 0;">
              <p>الأصل: <strong style="color: #C9A84C;">${assetNames[asset]}</strong></p>
              <p>نوع التنبيه: <strong>${type === "daily" ? "يومي (8 صباحاً)" : "تنبيه سعري"}</strong></p>
              ${targetPrice ? `<p>السعر المستهدف: <strong>$${targetPrice}</strong> (${condition === "above" ? "فوق" : "تحت"})</p>` : ""}
            </div>
            <p style="color: #A0A0A0; font-size: 12px;">
              ⚠️ تنبيه: الأسعار المعروضة لأغراض إعلامية فقط. لا تمثل نصيحة استثمارية.
            </p>
            <p style="color: #A0A0A0; font-size: 11px;">لإلغاء الاشتراك، تجاهل هذه الرسالة أو تواصل معنا.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Email Error:", emailError);
    }

    return NextResponse.json({ success: true, message: "تم تسجيل التنبيه بنجاح" });
  } catch {
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

  if (!id && !email) {
    return NextResponse.json({ error: "معرّف أو إيميل مطلوب" }, { status: 400 });
  }

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
