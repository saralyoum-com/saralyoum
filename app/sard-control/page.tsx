"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import PinGate from "@/components/PinGate";

type Slot = "morning" | "educational" | "engagement";
type PlanStatus = "pending" | "approved" | "skipped" | "published";

interface CountryRow { name: string; flag: string; currency: string; price?: string; chg?: string; up?: boolean; }
interface ContentPlanRow {
  id: string; post_date: string; slot: Slot; status: PlanStatus;
  template_ig: string | null; template_fb: string | null; topic: string | null;
  countries: CountryRow[] | null; ig_caption: string | null; fb_post: string | null; x_tweet: string | null;
  card_image_url: string | null; card_image_url_fb: string | null;
  notes: string | null; design_notes: string | null; edited: boolean;
  approved_at: string | null; published_at: string | null; post_ids: Record<string, string> | null; created_at: string;
}

const PLATFORMS = [
  { field: "ig_caption" as const, label: "إنستغرام", icon: "📸", image: "ig" as const, rows: 3 },
  { field: "fb_post" as const, label: "فيسبوك", icon: "📘", image: "fb" as const, rows: 4 },
  { field: "x_tweet" as const, label: "X", icon: "✕", image: "fb" as const, rows: 2 },
];

const SLOT_ORDER: Slot[] = ["morning", "educational", "engagement"];
const SLOT_META: Record<Slot, { label: string; time: string; icon: string; color: string; aspect: string }> = {
  morning:     { label: "صباحي",  time: "7:30 ص",  icon: "🌅", color: "#C9A84C", aspect: "1 / 1" },
  educational: { label: "تعليمي", time: "12:30 م", icon: "💡", color: "#60a5fa", aspect: "4 / 5" },
  engagement:  { label: "تفاعلي", time: "9:00 م",  icon: "🌙", color: "#a78bfa", aspect: "4 / 5" },
};
const STATUS_META: Record<PlanStatus, { label: string; bg: string; fg: string }> = {
  pending:   { label: "قيد المراجعة", bg: "rgba(250,204,21,0.12)",  fg: "#facc15" },
  approved:  { label: "موافق عليه",   bg: "rgba(34,197,94,0.12)",   fg: "#4ade80" },
  skipped:   { label: "تم التخطي",    bg: "rgba(255,255,255,0.06)", fg: "#888" },
  published: { label: "تم النشر",     bg: "rgba(96,165,250,0.12)",  fg: "#60a5fa" },
};
const AR_MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const AR_WEEKDAYS = ["أح","اث","ثل","أر","خم","جم","سب"];

const card: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14 };
const textarea: React.CSSProperties = { width: "100%", boxSizing: "border-box", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#eee", fontSize: 12.5, padding: "8px 10px", direction: "rtl", fontFamily: "Tajawal,sans-serif", resize: "vertical", lineHeight: 1.7 };
const btn: React.CSSProperties = { border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 600, padding: "8px 14px", cursor: "pointer" };

function fmtMonth(y: number, m: number) { return `${y}-${String(m).padStart(2, "0")}`; }

export default function SardControlPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [rows, setRows] = useState<ContentPlanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<Record<"ig_caption" | "fb_post" | "x_tweet" | "notes" | "design_notes", string>>>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [dayNote, setDayNote] = useState("");
  const [applyingDayNote, setApplyingDayNote] = useState(false);

  const checkAuth = useCallback(async () => {
    const res = await fetch(`/api/sard-control/plan?month=${fmtMonth(year, month)}`);
    return res.ok;
  }, [year, month]);

  const loadPlan = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/sard-control/plan?month=${fmtMonth(year, month)}`);
      if (res.ok) setRows((await res.json()).rows ?? []);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { loadPlan(); }, [loadPlan]);
  useEffect(() => { setDayNote(""); }, [selected]);

  const byDate = useMemo(() => {
    const m = new Map<string, ContentPlanRow[]>();
    for (const r of rows) {
      if (!m.has(r.post_date)) m.set(r.post_date, []);
      m.get(r.post_date)!.push(r);
    }
    return m;
  }, [rows]);

  const stats = useMemo(() => {
    const s: Record<PlanStatus, number> = { pending: 0, approved: 0, skipped: 0, published: 0 };
    for (const r of rows) s[r.status]++;
    return s;
  }, [rows]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const changeMonth = (delta: number) => {
    let m = month + delta, y = year;
    if (m < 1) { m = 12; y -= 1; } else if (m > 12) { m = 1; y += 1; }
    setMonth(m); setYear(y); setSelected(null);
  };

  const draftOf = (id: string) => drafts[id] ?? {};
  const setField = (id: string, key: "ig_caption" | "fb_post" | "x_tweet" | "notes" | "design_notes", value: string) =>
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [key]: value } }));

  const save = async (row: ContentPlanRow, status?: PlanStatus) => {
    setSaving(row.id);
    const d = draftOf(row.id);
    try {
      const body: Record<string, unknown> = { id: row.id, ...d };
      if (status) body.status = status;
      const res = await fetch("/api/sard-control/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const { row: updated } = await res.json();
        setRows((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
        setDrafts((cur) => { const c = { ...cur }; delete c[row.id]; return c; });
        setFlash({ type: "ok", msg: status === "approved" ? "تم الاعتماد ✅" : status === "skipped" ? "تم التخطي" : "تم حفظ التعديل" });
      } else {
        setFlash({ type: "err", msg: "فشل الحفظ — حاول مرة أخرى" });
      }
    } finally {
      setSaving(null);
      setTimeout(() => setFlash(null), 2500);
    }
  };

  const applyDayNoteToAll = async () => {
    if (!selected || !dayNote.trim()) return;
    const dayRows = (byDate.get(selected) ?? []).filter((r) => r.status !== "published");
    if (dayRows.length === 0) return;
    setApplyingDayNote(true);
    try {
      const results = await Promise.all(
        dayRows.map((r) =>
          fetch("/api/sard-control/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: r.id, notes: dayNote }),
          }).then((res) => res.json())
        )
      );
      setRows((rs) => rs.map((r) => results.find((res) => res.row?.id === r.id)?.row ?? r));
      setDayNote("");
      setFlash({ type: "ok", msg: `تم تطبيق الملاحظة على ${dayRows.length} منشورات ✅` });
    } catch {
      setFlash({ type: "err", msg: "فشل تطبيق الملاحظة — حاول مرة أخرى" });
    } finally {
      setApplyingDayNote(false);
      setTimeout(() => setFlash(null), 2500);
    }
  };

  return (
    <PinGate icon="🗓️" title="SARD Control" subtitle="لوحة الموافقة على المحتوى" checkAuth={checkAuth}>
      <div style={{ minHeight: "100vh", background: "#080808", padding: "36px 18px 80px", fontFamily: "Tajawal,sans-serif", direction: "rtl" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#C9A84C" }}>خطة المحتوى — {AR_MONTHS[month - 1]} {year}</div>
              <div style={{ fontSize: 12.5, color: "#666", marginTop: 3 }}>راجع، عدّل، اعتمد أو تخطَّ أي منشور قبل نشره</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => changeMonth(-1)} style={{ ...btn, background: "rgba(255,255,255,0.06)", color: "#ccc" }}>◀ السابق</button>
              <button onClick={() => changeMonth(1)} style={{ ...btn, background: "rgba(255,255,255,0.06)", color: "#ccc" }}>التالي ▶</button>
            </div>
          </div>

          {flash && (
            <div style={{ background: flash.type === "ok" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${flash.type === "ok" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius: 10, padding: "10px 16px", marginBottom: 16, color: flash.type === "ok" ? "#4ade80" : "#f87171", fontSize: 13, textAlign: "center" }}>
              {flash.msg}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {(Object.keys(STATUS_META) as PlanStatus[]).map((s) => (
              <div key={s} style={{ background: STATUS_META[s].bg, color: STATUS_META[s].fg, borderRadius: 20, padding: "5px 14px", fontSize: 12 }}>
                <b>{stats[s]}</b> {STATUS_META[s].label}
              </div>
            ))}
          </div>

          {/* Calendar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 4 }}>
            {AR_WEEKDAYS.map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: 11, color: "#555", padding: "4px 0", fontWeight: 500 }}>{d}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 20 }}>
            {Array.from({ length: firstWeekday }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayRows = byDate.get(dateStr) ?? [];
              const isToday = dateStr === todayStr;
              const isSel = dateStr === selected;
              return (
                <div
                  key={day}
                  onClick={() => setSelected(dateStr)}
                  style={{
                    ...card,
                    cursor: "pointer",
                    minHeight: 50,
                    padding: "6px 4px",
                    borderColor: isSel ? "#C9A84C" : isToday ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)",
                    background: isSel ? "rgba(201,168,76,0.08)" : dayRows.length ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 600, textAlign: "center", color: isSel || isToday ? "#C9A84C" : "#ccc", marginBottom: 3 }}>{day}</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 2 }}>
                    {SLOT_ORDER.filter((s) => dayRows.some((r) => r.slot === s)).map((s) => (
                      <div key={s} style={{ width: 5, height: 5, borderRadius: "50%", background: SLOT_META[s].color }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {loading && <div style={{ textAlign: "center", color: "#555", fontSize: 13, padding: 20 }}>...جارٍ التحميل</div>}

          {!loading && selected && (
            <div style={{ ...card, overflow: "hidden" }}>
              <div style={{ background: "rgba(255,255,255,0.04)", padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#eee" }}>{selected}</div>
                <div onClick={() => setSelected(null)} style={{ cursor: "pointer", color: "#666", fontSize: 20, lineHeight: 1 }}>×</div>
              </div>

              <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(96,165,250,0.04)" }}>
                <div style={{ fontSize: 11, color: "#60a5fa", fontWeight: 600, marginBottom: 6 }}>💬 ملاحظة عامة — تُطبَّق على منشورات اليوم الثلاثة دفعة واحدة</div>
                <textarea
                  rows={2}
                  placeholder="مثال: كل منشورات اليوم — اجعل النبرة أكثر حماسة..."
                  value={dayNote}
                  onChange={(e) => setDayNote(e.target.value)}
                  style={{ ...textarea, borderColor: "rgba(96,165,250,0.3)", marginBottom: 6 }}
                />
                <button
                  disabled={applyingDayNote || !dayNote.trim()}
                  onClick={applyDayNoteToAll}
                  style={{ ...btn, background: "#60a5fa", color: "#04101f", opacity: applyingDayNote || !dayNote.trim() ? 0.5 : 1 }}
                >
                  {applyingDayNote ? "..." : "تطبيق على الثلاثة"}
                </button>
              </div>

              {SLOT_ORDER.map((slot) => {
                const row = (byDate.get(selected) ?? []).find((r) => r.slot === slot);
                const meta = SLOT_META[slot];
                if (!row) {
                  return (
                    <div key={slot} style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 14, alignItems: "center" }}>
                      <div style={{ width: 60, aspectRatio: meta.aspect, background: "rgba(255,255,255,0.03)", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, opacity: 0.3 }}>{meta.icon}</div>
                      <div style={{ fontSize: 12.5, color: "#555" }}>{meta.label} — {meta.time} · لم يتم إنشاء المحتوى بعد (يُنشأ قبل موعد النشر بوقت كافٍ)</div>
                    </div>
                  );
                }
                const d = draftOf(row.id);
                const sm = STATUS_META[row.status];
                const hasContent = Boolean(row.ig_caption || row.card_image_url);
                const countriesLine = row.countries && row.countries.length > 0
                  ? row.countries.map((c) => c.price ? `${c.flag} ${c.name} ${c.price} ${c.currency}` : `${c.flag} ${c.name}`).join(" · ")
                  : null;

                if (!hasContent) {
                  return (
                    <div key={row.id} style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 14, alignItems: "center" }}>
                      <div style={{ width: 60, aspectRatio: meta.aspect, background: "rgba(255,255,255,0.03)", borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, opacity: 0.3 }}>{meta.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: meta.color, fontWeight: 600, marginBottom: 4 }}>{meta.icon} {meta.label} — {meta.time}</div>
                        {row.topic && <div style={{ fontSize: 13, fontWeight: 600, color: "#ccc", marginBottom: 3 }}>{row.topic}</div>}
                        {countriesLine && <div style={{ fontSize: 11.5, color: "#888", marginBottom: 3 }}>{countriesLine}</div>}
                        <div style={{ fontSize: 11.5, color: "#555" }}>مخطَّط — سيُنشأ المحتوى الكامل والصورة قبل موعد النشر</div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={row.id} style={{ padding: "16px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 12, color: meta.color, fontWeight: 600 }}>{meta.icon} {meta.label} — {meta.time}</span>
                      <span style={{ background: sm.bg, color: sm.fg, borderRadius: 12, padding: "2px 10px", fontSize: 11 }}>{sm.label}</span>
                      {row.edited && <span style={{ fontSize: 11, color: "#777" }}>· معدَّل يدوياً</span>}
                    </div>
                    {row.topic && <div style={{ fontSize: 13, fontWeight: 600, color: "#ddd", marginBottom: 6 }}>{row.topic}</div>}
                    {countriesLine && (
                      <div style={{ fontSize: 11.5, color: "#999", marginBottom: 10 }}>{countriesLine}</div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 10 }}>
                      {PLATFORMS.map((p) => {
                        const imgUrl = p.image === "ig" ? row.card_image_url : row.card_image_url_fb;
                        const imgAspect = p.image === "ig" ? meta.aspect : "1200 / 628";
                        return (
                          <div key={p.field} style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 11.5, fontWeight: 600, color: "#ccc" }}>
                              <span>{p.icon}</span><span>{p.label}</span>
                            </div>
                            <div style={{ display: "flex", gap: 8, padding: "8px 10px" }}>
                              <div
                                onClick={() => imgUrl && setLightboxUrl(imgUrl)}
                                style={{ width: 46, aspectRatio: imgAspect, background: "#050505", borderRadius: 5, flexShrink: 0, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", cursor: imgUrl ? "zoom-in" : "default" }}
                              >
                                {imgUrl
                                  ? <img src={imgUrl} alt={p.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, opacity: 0.3 }}>{meta.icon}</div>}
                              </div>
                              <textarea
                                rows={p.rows}
                                value={d[p.field] ?? row[p.field] ?? ""}
                                onChange={(e) => setField(row.id, p.field, e.target.value)}
                                disabled={row.status === "published"}
                                style={{ ...textarea, flex: 1, minWidth: 0, fontSize: 11.5 }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 10.5, color: "#888", marginBottom: 3 }}>📝 ملاحظة على المحتوى</div>
                        <textarea
                          rows={2}
                          placeholder="مثال: اجعل السؤال أقوى، غيّر الرقم..."
                          value={d.notes ?? row.notes ?? ""}
                          onChange={(e) => setField(row.id, "notes", e.target.value)}
                          disabled={row.status === "published"}
                          style={{ ...textarea, color: "#aaa" }}
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: 10.5, color: "#a78bfa", marginBottom: 3 }}>🎨 ملاحظة على التصميم</div>
                        <textarea
                          rows={2}
                          placeholder="مثال: اللون فاتح جداً، كبّر الخط..."
                          value={d.design_notes ?? row.design_notes ?? ""}
                          onChange={(e) => setField(row.id, "design_notes", e.target.value)}
                          disabled={row.status === "published"}
                          style={{ ...textarea, borderColor: "rgba(167,139,250,0.3)", color: "#aaa" }}
                        />
                      </div>
                    </div>

                    {row.status !== "published" && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button disabled={saving === row.id} onClick={() => save(row, "approved")} style={{ ...btn, background: "#22c55e", color: "#04140a", opacity: saving === row.id ? 0.6 : 1 }}>
                          {saving === row.id ? "..." : "اعتماد"}
                        </button>
                        <button disabled={saving === row.id} onClick={() => save(row)} style={{ ...btn, background: "rgba(255,255,255,0.08)", color: "#ddd" }}>حفظ التعديل</button>
                        <button disabled={saving === row.id} onClick={() => save(row, "skipped")} style={{ ...btn, background: "transparent", color: "#888", border: "1px solid rgba(255,255,255,0.12)" }}>تخطّي</button>
                      </div>
                    )}
                    {row.status === "published" && row.post_ids && (
                      <div style={{ fontSize: 11, color: "#555" }}>تم النشر على: {Object.keys(row.post_ids).join(" · ")}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!loading && !selected && (
            <div style={{ textAlign: "center", color: "#555", fontSize: 13, padding: "40px 0" }}>اختر يوماً من التقويم لمراجعة منشوراته</div>
          )}

          <div style={{ textAlign: "center", marginTop: 32, color: "#2a2a2a", fontSize: 11 }}>sardhahab.com · SARD Control</div>
        </div>
      </div>

      {lightboxUrl && (
        <div
          onClick={() => setLightboxUrl(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "zoom-out" }}
        >
          <div onClick={() => setLightboxUrl(null)} style={{ position: "absolute", top: 20, left: 20, color: "#ccc", fontSize: 28, cursor: "pointer", lineHeight: 1 }}>×</div>
          <img
            src={lightboxUrl}
            alt=""
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "min(90vw, 700px)", maxHeight: "88vh", borderRadius: 10, boxShadow: "0 20px 60px rgba(0,0,0,0.6)", cursor: "default" }}
          />
        </div>
      )}
    </PinGate>
  );
}
