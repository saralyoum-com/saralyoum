import { NextRequest, NextResponse } from "next/server";
import { isAuthed, unauthorized } from "@/lib/connectAuth";
import { applyReview, type ApproveUpdate } from "@/lib/contentPlan";

export const dynamic = "force-dynamic";

const VALID_STATUS = ["pending", "approved", "skipped", "published"];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  const update: ApproveUpdate = { id };

  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !VALID_STATUS.includes(body.status)) {
      return NextResponse.json({ error: "invalid status" }, { status: 400 });
    }
    update.status = body.status as ApproveUpdate["status"];
  }
  for (const field of ["notes", "ig_caption", "fb_post", "x_tweet"] as const) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== "string") {
        return NextResponse.json({ error: `invalid ${field}` }, { status: 400 });
      }
      update[field] = body[field] as string;
    }
  }

  try {
    const row = await applyReview(update);
    return NextResponse.json({ ok: true, row });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
