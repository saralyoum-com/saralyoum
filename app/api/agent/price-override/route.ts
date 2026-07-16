import { NextRequest, NextResponse } from "next/server";
import { authenticateAgent, logAgentEvent } from "@/lib/agentAuth";
import { createServiceClient } from "@/lib/supabase";
import { sendTelegramToOwner } from "@/lib/telegram";

export const dynamic = "force-dynamic";

const FIELD_AR: Record<string, string> = {
  buy: "سعر الشراء",
  sell: "سعر البيع",
  masna3iya: "المصنعية",
};

// POST /api/agent/price-override
// { country_code, karat, field, new_value, old_value?, note? }
// Every submission lands as `pending` — nothing touches the public site until
// the admin approves. The full audit trail (who/when/old→new) is the row.
export async function POST(req: NextRequest) {
  const agent = await authenticateAgent(req.headers.get("authorization"));
  if (!agent) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  // Only price moderators may submit, and only for their own market.
  if (agent.role !== "price_moderator")
    return NextResponse.json({ error: "صلاحية مشرف أسعار مطلوبة" }, { status: 403 });

  try {
    const { country_code, karat, field, new_value, old_value, note } = await req.json();

    if (!country_code || String(country_code).toLowerCase() !== (agent.country_code || "").toLowerCase())
      return NextResponse.json({ error: "يمكنك التعديل لسوقك فقط" }, { status: 403 });
    if (![18, 21, 22, 24].includes(Number(karat)))
      return NextResponse.json({ error: "العيار غير صحيح" }, { status: 400 });
    if (!["buy", "sell", "masna3iya"].includes(field))
      return NextResponse.json({ error: "الحقل غير صحيح" }, { status: 400 });

    const value = Number(new_value);
    if (!isFinite(value) || value <= 0 || value > 1e7)
      return NextResponse.json({ error: "القيمة يجب أن تكون رقما موجبا" }, { status: 400 });

    const prev = old_value != null && isFinite(Number(old_value)) ? Number(old_value) : null;
    const deltaPct = prev ? Math.abs(((value - prev) / prev) * 100) : null;

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("price_overrides")
      .insert({
        agent_id: agent.id,
        country_code: String(country_code).toLowerCase(),
        karat: Number(karat),
        field,
        old_value: prev,
        new_value: value,
        note: typeof note === "string" ? note.slice(0, 500) : null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[agent/price-override] insert:", error.message);
      return NextResponse.json({ error: "فشل الإرسال" }, { status: 500 });
    }

    const flag = deltaPct != null && deltaPct > 2 ? "⚠️ فرق كبير — " : "";
    await sendTelegramToOwner(
      `💰 <b>تحديث سعر بانتظار الموافقة</b>\n` +
        `👤 ${agent.name} · ${String(country_code).toUpperCase()}\n` +
        `${flag}عيار ${karat} · ${FIELD_AR[field]}: ${prev ?? "—"} ← <b>${value}</b>` +
        (deltaPct != null ? ` (${deltaPct.toFixed(1)}%)` : "") +
        (note ? `\n📝 ${String(note).slice(0, 200)}` : "") +
        `\n🆔 <code>${data.id}</code>`
    ).catch((e) => console.error("[agent/price-override] telegram:", e));

    await logAgentEvent("agent_price_override_submitted", {
      agent_id: agent.id,
      country_code: String(country_code).toLowerCase(),
      karat: Number(karat),
      field,
      delta_pct: deltaPct,
    });

    return NextResponse.json({ success: true, id: data.id, status: "pending" });
  } catch (err) {
    console.error("[agent/price-override]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
