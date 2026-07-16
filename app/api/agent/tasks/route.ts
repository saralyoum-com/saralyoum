import { NextRequest, NextResponse } from "next/server";
import { authenticateAgent, logAgentEvent } from "@/lib/agentAuth";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET /api/agent/tasks — open tasks first, then last 10 completed.
export async function GET(req: NextRequest) {
  const agent = await authenticateAgent(req.headers.get("authorization"));
  if (!agent) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const supabase = createServiceClient();
    const [open, recent] = await Promise.all([
      supabase
        .from("agent_tasks")
        .select("id,task_type,title,details,status,due_at,created_at")
        .eq("agent_id", agent.id)
        .eq("status", "open")
        .order("due_at", { ascending: true, nullsFirst: false }),
      supabase
        .from("agent_tasks")
        .select("id,task_type,title,status,completed_at")
        .eq("agent_id", agent.id)
        .eq("status", "done")
        .order("completed_at", { ascending: false })
        .limit(10),
    ]);

    return NextResponse.json({ open: open.data || [], recent: recent.data || [] });
  } catch (err) {
    console.error("[agent/tasks GET]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

// PATCH /api/agent/tasks — { id, action: "complete" }
export async function PATCH(req: NextRequest) {
  const agent = await authenticateAgent(req.headers.get("authorization"));
  if (!agent) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const { id, action } = await req.json();
    if (!id || action !== "complete")
      return NextResponse.json({ error: "طلب غير صالح" }, { status: 400 });

    const supabase = createServiceClient();
    // Scoped to the agent's own tasks — an agent can never touch another's.
    const { data, error } = await supabase
      .from("agent_tasks")
      .update({ status: "done", completed_at: new Date().toISOString() })
      .eq("id", id)
      .eq("agent_id", agent.id)
      .eq("status", "open")
      .select("id,task_type,created_at,completed_at")
      .maybeSingle();

    if (error) return NextResponse.json({ error: "فشل التحديث" }, { status: 500 });
    if (!data) return NextResponse.json({ error: "المهمة غير موجودة" }, { status: 404 });

    const seconds = Math.round(
      (new Date(data.completed_at).getTime() - new Date(data.created_at).getTime()) / 1000
    );
    await logAgentEvent("agent_task_completed", {
      agent_id: agent.id,
      task_type: data.task_type,
      time_to_complete_s: seconds,
      country_code: agent.country_code,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[agent/tasks PATCH]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
