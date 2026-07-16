import { NextRequest, NextResponse } from "next/server";
import { getNewsData } from "@/lib/news";

export const dynamic = "force-dynamic";
export const revalidate = 900; // 15 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") === "en" ? "en" : "ar";
  const news = await getNewsData(lang);
  return NextResponse.json({ news: news.slice(0, 20) });
}
