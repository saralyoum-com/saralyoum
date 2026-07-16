import { NextRequest, NextResponse } from "next/server";
import { authenticateAgent } from "@/lib/agentAuth";
import { createServiceClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// GET /api/agent/me — validate token, return agent profile + weekly stats.
export async function GET(req: NextRequest) {
  const agent = await authenticateAgent(req.headers.get("authorization"));
  if (!agent) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  try {
    const supabase = createServiceClient();
    const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();

    const [doneRes, openRes] = await Promise.all([
      supabase
        .from("agent_tasks")
        .select("completed_at,created_at", { count: "exact" })
        .eq("agent_id", agent.id)
        .eq("status", "done")
        .gte("completed_at", weekAgo),
      supabase
        .from("agent_tasks")
        .select("id", { count: "exact", head: true })
        .eq("agent_id", agent.id)
        .eq("status", "open"),
    ]);

    // Median-ish completion time: average of this week's completions (hours).
    let avgHours: number | null = null;
    const rows = doneRes.data || [];
    if (rows.length) {
      const total = rows.reduce((s, r) => {
        const ms = new Date(r.completed_at).getTime() - new Date(r.created_at).getTime();
        return s + Math.max(0, ms);
      }, 0);
      avgHours = Math.round((total / rows.length / 36e5) * 10) / 10;
    }

    return NextResponse.json({
      agent: { name: agent.name, role: agent.role, country_code: agent.country_code },
      stats: {
        done_this_week: doneRes.count || 0,
        open_tasks: openRes.count || 0,
        avg_completion_hours: avgHours,
      },
    });
  } catch (err) {
    console.error("[agent/me]", err);
    return NextResponse.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
