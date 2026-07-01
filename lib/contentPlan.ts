import { createServiceClient } from "@/lib/supabase";

export type Slot = "morning" | "educational" | "engagement";
export type PlanStatus = "pending" | "approved" | "skipped" | "published";

export interface CountryRow {
  name: string;
  flag: string;
  price: string;
  currency: string;
  chg: string;
  up: boolean;
}

export interface ContentPlanRow {
  id: string;
  post_date: string; // YYYY-MM-DD
  slot: Slot;
  status: PlanStatus;
  template_ig: string | null;
  template_fb: string | null;
  topic: string | null;
  countries: CountryRow[] | null;
  ig_caption: string | null;
  fb_post: string | null;
  x_tweet: string | null;
  card_image_url: string | null;
  notes: string | null;
  edited: boolean;
  approved_at: string | null;
  published_at: string | null;
  post_ids: Record<string, string> | null;
  created_at: string;
}

/** All rows whose post_date falls in the given calendar month (1-12). */
export async function getMonthPlan(year: number, month: number): Promise<ContentPlanRow[]> {
  const supabase = createServiceClient();
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("content_plan")
    .select("*")
    .gte("post_date", start)
    .lte("post_date", end)
    .order("post_date", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as ContentPlanRow[];
}

export interface ApproveUpdate {
  id: string;
  status?: PlanStatus;
  notes?: string;
  ig_caption?: string;
  fb_post?: string;
  x_tweet?: string;
}

/** Apply a review action (approve/skip/edit) to a single planned post. */
export async function applyReview(update: ApproveUpdate): Promise<ContentPlanRow> {
  const supabase = createServiceClient();
  const { id, ...fields } = update;

  const patch: Record<string, unknown> = { ...fields };
  const captionFields = ["ig_caption", "fb_post", "x_tweet"] as const;
  if (captionFields.some((f) => f in fields)) patch.edited = true;
  if (fields.status === "approved") patch.approved_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("content_plan")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as ContentPlanRow;
}
