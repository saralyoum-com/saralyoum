import { NextRequest, NextResponse } from "next/server";
import { authenticateAgent, logAgentEvent } from "@/lib/agentAuth";
import { createServiceClient } from "@/lib/supabase";
import { sendTelegramToOwner } from "@/lib/telegram";

export const dynamic = "force-dynamic";

const CATEGORIES = ["price_data", "technical", "content", "payment", "other"] as const;
const CATEGORY_AR: Record<string, string> = {
  price_data: "بيانات الأسعار",
  technical: "مشكلة تقنية",
  content: "محتوى",
  payment: "مستحقات",
  other: "أخرى",
};

// POST /api/agent/support — { category, severity, body }
// Inserts the request and DMs the owner on Telegram immediately (sev-urgent)
// so triage happens from the phone without opening any dashboard.
export async function POST(req: NextRequest) {
  const agent = await authenticateAgent(req.headers.get("authorization"));
  if (!agent) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const { category, severity, body } = await req.json();

    if (!CATEGORIES.includes(category))
      return NextResponse.json({ error: "التصنيف غير صحيح" }, { status: 400 });
    if (!["urgent", "normal"].includes(severity))
      return NextResponse.json({ error: "الأولوية غير صحيحة" }, { status: 400 });
    if (typeof body !== "string" || body.trim().length < 5 || body.length > 2000)
      return NextResponse.json({ error: "اكتب وصفا للمشكلة (5 أحرف على الأقل)" }, { status: 400 });

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("support_requests")
      .insert({ agent_id: agent.id, category, severity, body: body.trim() })
      .select("id")
      .single();

    if (error) {
      console.error("[agent/support] insert:", error.message);
      return NextResponse.json({ error: "فشل الإرسال، حاول مجددا" }, { status: 500 });
    }

    // Telegram DM to the owner. Failure here must not fail the request —
    // the row is already saved and visible in the admin queue.
    const icon = severity === "urgent" ? "🚨" : "📩";
    await sendTelegramToOwner(
      `${icon} <b>طلب مساعدة من وكيل</b>\n` +
        `👤 ${agent.name} (${agent.country_code?.toUpperCase() || agent.role})\n` +
        `📂 ${CATEGORY_AR[category]} · ${severity === "urgent" ? "عاجل" : "عادي"}\n` +
        `💬 ${body.trim().slice(0, 500)}\n` +
        `🆔 <code>${data.id}</code>`
    ).catch((e) => console.error("[agent/support] telegram:", e));

    await logAgentEvent("agent_support_requested", {
      agent_id: agent.id,
      category,
      severity,
    });

    return NextResponse.json({ success: true, id: data.id });
  } catch (err) {
    console.error("[agent/support]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
