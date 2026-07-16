"use client";

/**
 * Agent Workspace (Move 3, v1) — Arabic-first, token-gated.
 *
 * Auth: the agent pastes their access token once; it lives in localStorage
 * and is sent as a Bearer header to /api/agent/*. Wrong/expired token drops
 * back to the login screen. All writes are server-mediated and audit-logged.
 */

import { useCallback, useEffect, useState } from "react";

const TOKEN_KEY = "sard_agent_token";

type Me = {
  agent: { name: string; role: string; country_code: string | null };
  stats: { done_this_week: number; open_tasks: number; avg_completion_hours: number | null };
};
type Task = {
  id: string;
  task_type: string;
  title: string;
  details?: string | null;
  due_at?: string | null;
  completed_at?: string | null;
};

const ROLE_AR: Record<string, string> = {
  price_moderator: "مشرف أسعار",
  content_editor: "محرر محتوى",
  partner_agent: "وكيل شراكات",
};
const TYPE_ICON: Record<string, string> = {
  price_verify: "💰",
  article: "📝",
  review: "🔎",
  other: "📌",
};

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export default function AgentWorkspace() {
  const [token, setToken] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [me, setMe] = useState<Me | null>(null);
  const [tasks, setTasks] = useState<{ open: Task[]; recent: Task[] }>({ open: [], recent: [] });
  const [phase, setPhase] = useState<"boot" | "login" | "loading" | "ready">("boot");
  const [loginError, setLoginError] = useState("");
  const [toast, setToast] = useState("");

  // Support modal
  const [showSupport, setShowSupport] = useState(false);
  const [supCategory, setSupCategory] = useState("price_data");
  const [supSeverity, setSupSeverity] = useState("normal");
  const [supBody, setSupBody] = useState("");
  const [supState, setSupState] = useState<"idle" | "sending" | "sent">("idle");

  // Price console
  const [poKarat, setPoKarat] = useState("21");
  const [poField, setPoField] = useState("masna3iya");
  const [poValue, setPoValue] = useState("");
  const [poNote, setPoNote] = useState("");
  const [poState, setPoState] = useState<"idle" | "sending">("idle");

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const loadWorkspace = useCallback(async (t: string) => {
    setPhase("loading");
    try {
      const meRes = await fetch("/api/agent/me", { headers: authHeaders(t) });
      if (meRes.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setPhase("login");
        setLoginError("رمز الدخول غير صحيح أو منتهي");
        return;
      }
      const meData = await meRes.json();
      const tasksRes = await fetch("/api/agent/tasks", { headers: authHeaders(t) });
      const tasksData = await tasksRes.json();
      setMe(meData);
      setTasks({ open: tasksData.open || [], recent: tasksData.recent || [] });
      setPhase("ready");
    } catch {
      setPhase("login");
      setLoginError("تعذر الاتصال، حاول مجددا");
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY);
    if (saved) {
      setToken(saved);
      loadWorkspace(saved);
    } else {
      setPhase("login");
    }
  }, [loadWorkspace]);

  const handleLogin = () => {
    const t = input.trim();
    if (t.length < 32) {
      setLoginError("رمز الدخول قصير جدا");
      return;
    }
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setLoginError("");
    loadWorkspace(t);
  };

  const completeTask = async (id: string) => {
    if (!token) return;
    const res = await fetch("/api/agent/tasks", {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ id, action: "complete" }),
    });
    if (res.ok) {
      flash("✅ تم إنجاز المهمة");
      loadWorkspace(token);
    } else {
      flash("تعذر تحديث المهمة");
    }
  };

  const sendSupport = async () => {
    if (!token || supBody.trim().length < 5) return;
    setSupState("sending");
    const res = await fetch("/api/agent/support", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ category: supCategory, severity: supSeverity, body: supBody }),
    });
    if (res.ok) {
      setSupState("sent");
      setSupBody("");
      setTimeout(() => {
        setShowSupport(false);
        setSupState("idle");
      }, 2500);
    } else {
      setSupState("idle");
      flash("تعذر إرسال الطلب");
    }
  };

  const sendOverride = async () => {
    if (!token || !me) return;
    const v = Number(poValue);
    if (!isFinite(v) || v <= 0) {
      flash("أدخل قيمة صحيحة");
      return;
    }
    setPoState("sending");
    const res = await fetch("/api/agent/price-override", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        country_code: me.agent.country_code,
        karat: Number(poKarat),
        field: poField,
        new_value: v,
        note: poNote || undefined,
      }),
    });
    const data = await res.json();
    setPoState("idle");
    if (res.ok) {
      setPoValue("");
      setPoNote("");
      flash("💰 أُرسل للموافقة — سيصل المدير الآن");
    } else {
      flash(data.error || "تعذر الإرسال");
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setMe(null);
    setPhase("login");
  };

  /* ── Login screen ─────────────────────────────────────────────────────── */
  if (phase === "boot" || phase === "loading") {
    return (
      <div dir="rtl" className="max-w-md mx-auto px-4 py-24 text-center text-text-secondary">
        جاري التحميل...
      </div>
    );
  }

  if (phase === "login") {
    return (
      <div dir="rtl" className="max-w-md mx-auto px-4 py-16">
        <div className="bg-surface border border-border rounded-3xl p-6 sm:p-8">
          <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mb-4">
            <span className="text-2xl">🔑</span>
          </div>
          <h1 className="text-xl font-black text-text-primary mb-1">مساحة عمل الوكلاء</h1>
          <p className="text-text-secondary text-sm mb-6">أدخل رمز الدخول الذي استلمته من الإدارة</p>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="رمز الدخول"
            className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-primary text-sm mb-3 focus:border-gold outline-none"
            dir="ltr"
          />
          {loginError && <p className="text-fall text-xs mb-3">{loginError}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-gold hover:bg-gold-light text-background font-bold py-3 rounded-xl transition-colors"
          >
            دخول
          </button>
        </div>
      </div>
    );
  }

  /* ── Workspace ────────────────────────────────────────────────────────── */
  const stats = me!.stats;
  const agent = me!.agent;

  return (
    <div dir="rtl" className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">مساحة العمل</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {agent.name} · {ROLE_AR[agent.role] || agent.role}
            {agent.country_code ? ` — ${agent.country_code.toUpperCase()}` : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSupport(true)}
            className="border border-gold text-gold hover:bg-gold/10 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            🛟 طلب مساعدة
          </button>
          <button
            onClick={logout}
            className="border border-border text-text-secondary hover:text-text-primary text-sm px-3 py-2.5 rounded-xl transition-colors"
          >
            خروج
          </button>
        </div>
      </div>

      {/* Metrics strip */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
        <div className="bg-surface rounded-2xl p-3 sm:p-4">
          <p className="text-text-secondary text-[11px] sm:text-xs">مهام هذا الأسبوع</p>
          <p className="text-text-primary text-lg sm:text-2xl font-black mt-1">{stats.done_this_week}</p>
        </div>
        <div className="bg-surface rounded-2xl p-3 sm:p-4">
          <p className="text-text-secondary text-[11px] sm:text-xs">مهام مفتوحة</p>
          <p className={`text-lg sm:text-2xl font-black mt-1 ${stats.open_tasks > 0 ? "text-gold" : "text-text-primary"}`}>
            {stats.open_tasks}
          </p>
        </div>
        <div className="bg-surface rounded-2xl p-3 sm:p-4">
          <p className="text-text-secondary text-[11px] sm:text-xs">متوسط الإنجاز</p>
          <p className="text-text-primary text-lg sm:text-2xl font-black mt-1">
            {stats.avg_completion_hours != null ? `${stats.avg_completion_hours} س` : "—"}
          </p>
        </div>
      </div>

      {/* Task queue */}
      <h2 className="text-sm font-bold text-text-secondary mb-3">قائمة المهام</h2>
      {tasks.open.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl p-5 text-center text-text-secondary text-sm mb-6">
          لا مهام مفتوحة — أحسنت 🎉
        </div>
      ) : (
        <div className="space-y-2 mb-6">
          {tasks.open.map((t) => (
            <div key={t.id} className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-text-primary text-sm font-bold truncate">
                  {TYPE_ICON[t.task_type] || "📌"} {t.title}
                </p>
                {t.details && <p className="text-text-secondary text-xs mt-0.5 line-clamp-2">{t.details}</p>}
                {t.due_at && (
                  <p className={`text-[11px] mt-1 ${new Date(t.due_at) < new Date() ? "text-fall" : "text-text-secondary"}`}>
                    الاستحقاق: {new Date(t.due_at).toLocaleString("ar", { dateStyle: "short", timeStyle: "short" })}
                  </p>
                )}
              </div>
              <button
                onClick={() => completeTask(t.id)}
                className="bg-gold hover:bg-gold-light text-background font-bold text-xs px-4 py-2 rounded-xl transition-colors shrink-0"
              >
                تم الإنجاز
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Price console — price moderators only */}
      {agent.role === "price_moderator" && (
        <div className="bg-surface-2 border border-border rounded-2xl p-4 sm:p-5 mb-6">
          <h2 className="text-sm font-bold text-text-primary mb-1">
            وحدة تحديث السعر — {agent.country_code?.toUpperCase()}
          </h2>
          <p className="text-text-secondary text-xs mb-4">
            أدخل السعر الفعلي من السوق المحلي · يسجل كل تعديل باسمك · يحتاج موافقة المدير قبل النشر
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <select
              value={poKarat}
              onChange={(e) => setPoKarat(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary"
            >
              <option value="24">عيار 24</option>
              <option value="22">عيار 22</option>
              <option value="21">عيار 21</option>
              <option value="18">عيار 18</option>
            </select>
            <select
              value={poField}
              onChange={(e) => setPoField(e.target.value)}
              className="bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary"
            >
              <option value="masna3iya">المصنعية</option>
              <option value="buy">سعر الشراء</option>
              <option value="sell">سعر البيع</option>
            </select>
            <input
              type="number"
              inputMode="decimal"
              value={poValue}
              onChange={(e) => setPoValue(e.target.value)}
              placeholder="القيمة"
              className="bg-background border border-gold/50 rounded-xl px-3 py-2.5 text-sm text-text-primary focus:border-gold outline-none"
            />
            <button
              onClick={sendOverride}
              disabled={poState === "sending"}
              className="bg-gold hover:bg-gold-light text-background font-bold text-sm rounded-xl transition-colors disabled:opacity-60"
            >
              {poState === "sending" ? "جاري الإرسال..." : "إرسال للموافقة"}
            </button>
          </div>
          <input
            value={poNote}
            onChange={(e) => setPoNote(e.target.value)}
            placeholder="ملاحظة (اختياري) — مثال: متوسط 3 محلات في الرياض"
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-xs text-text-primary focus:border-gold outline-none"
          />
        </div>
      )}

      {/* Recently completed */}
      {tasks.recent.length > 0 && (
        <>
          <h2 className="text-sm font-bold text-text-secondary mb-3">أنجزت مؤخرا</h2>
          <div className="space-y-1.5">
            {tasks.recent.map((t) => (
              <div key={t.id} className="bg-surface/50 border border-border rounded-xl px-4 py-2.5 flex items-center justify-between">
                <p className="text-text-secondary text-xs truncate">
                  {TYPE_ICON[t.task_type] || "📌"} {t.title}
                </p>
                <span className="text-rise text-[11px] shrink-0">✓</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center px-4 z-50">
          <div className="bg-surface-2 border border-gold/50 rounded-xl px-5 py-3 text-sm text-text-primary shadow-lg animate-fade-in">
            {toast}
          </div>
        </div>
      )}

      {/* Support modal */}
      {showSupport && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 px-3 py-6" onClick={() => supState !== "sending" && setShowSupport(false)}>
          <div dir="rtl" className="bg-surface border border-border rounded-3xl p-5 sm:p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            {supState === "sent" ? (
              <div className="text-center py-6">
                <p className="text-2xl mb-2">✅</p>
                <p className="text-text-primary font-bold">تم الاستلام</p>
                <p className="text-text-secondary text-sm mt-1">سيصلك الرد قريبا — الطلبات العاجلة خلال ساعة</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-black text-text-primary mb-4">🛟 طلب مساعدة</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <select
                    value={supCategory}
                    onChange={(e) => setSupCategory(e.target.value)}
                    className="bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary"
                  >
                    <option value="price_data">بيانات الأسعار</option>
                    <option value="technical">مشكلة تقنية</option>
                    <option value="content">محتوى</option>
                    <option value="payment">مستحقات</option>
                    <option value="other">أخرى</option>
                  </select>
                  <select
                    value={supSeverity}
                    onChange={(e) => setSupSeverity(e.target.value)}
                    className="bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary"
                  >
                    <option value="normal">عادي</option>
                    <option value="urgent">عاجل — يؤثر على الموقع</option>
                  </select>
                </div>
                <textarea
                  value={supBody}
                  onChange={(e) => setSupBody(e.target.value)}
                  placeholder="صف المشكلة باختصار..."
                  rows={4}
                  className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:border-gold outline-none mb-3 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={sendSupport}
                    disabled={supState === "sending" || supBody.trim().length < 5}
                    className="flex-1 bg-gold hover:bg-gold-light text-background font-bold py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {supState === "sending" ? "جاري الإرسال..." : "إرسال"}
                  </button>
                  <button
                    onClick={() => setShowSupport(false)}
                    className="border border-border text-text-secondary px-4 py-2.5 rounded-xl text-sm"
                  >
                    إلغاء
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
