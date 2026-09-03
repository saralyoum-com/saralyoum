"use client";

import { useCallback, useEffect, useState } from "react";
import PinGate from "@/components/PinGate";
import { safeDecode } from "@/lib/radar/decode";
import type { Finding, RadarReport, Severity } from "@/lib/radar";

/**
 * /radar — the monitoring agent's dashboard.
 *
 * Findings come first and numbers come second, deliberately. The tables below
 * are evidence you check after a finding tells you where to look; leading with
 * them is how dashboards end up being admired and never acted on.
 *
 * Gated by the shared PIN (same session cookie as /sard-control) and noindexed
 * in the layout — this is business data, not a public page.
 */

const SEVERITY: Record<Severity, { label: string; dot: string; text: string; bg: string }> = {
  critical: { label: "حرج", dot: "bg-fall", text: "text-fall", bg: "bg-fall/10" },
  warning: { label: "تحذير", dot: "bg-gold", text: "text-gold", bg: "bg-gold/10" },
  opportunity: { label: "فرصة", dot: "bg-rise", text: "text-rise", bg: "bg-rise/10" },
  info: { label: "معلومة", dot: "bg-text-secondary", text: "text-text-secondary", bg: "bg-surface-2" },
};

const WINDOWS = [7, 30, 90];

const nf = new Intl.NumberFormat("en");
const pct = (v: number, digits = 0) => `${(v * 100).toFixed(digits)}%`;
const duration = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.round(sec % 60)).padStart(2, "0")}`;

function Metric({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: string }) {
  return (
    <div className="rounded-lg bg-surface p-4">
      <p className="text-xs text-text-secondary">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${tone ?? "text-text-primary"}`}>{value}</p>
      {hint && <p className="mt-0.5 text-xs text-text-secondary">{hint}</p>}
    </div>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  const s = SEVERITY[finding.severity];
  return (
    <div className="flex gap-3 border-t border-border py-4 first:border-t-0">
      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${s.dot}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-text-primary">{finding.title}</h3>
          <span className={`rounded px-2 py-0.5 text-[11px] ${s.bg} ${s.text}`}>{s.label}</span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">{finding.detail}</p>
      </div>
    </div>
  );
}

function Table({
  title,
  head,
  rows,
}: {
  title: string;
  head: string[];
  rows: (string | number)[][];
}) {
  if (!rows.length) return null;
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-semibold text-text-primary">{title}</h2>
      <div className="overflow-x-auto rounded-lg bg-surface">
        <table className="min-w-[360px] w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-text-secondary">
              {head.map((h, i) => (
                <th key={h} className={`p-3 font-normal ${i === 0 ? "text-start" : "text-end"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={ri} className="border-b border-border/50 last:border-0">
                {r.map((cell, ci) => (
                  <td
                    key={ci}
                    className={`p-3 ${ci === 0 ? "text-start text-text-primary" : "text-end tabular-nums text-text-secondary"}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Report() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<RadarReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/radar?days=${days}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`تعذر جلب التقرير (${res.status})`);
        return (await res.json()) as RadarReport;
      })
      .then((json) => !cancelled && setData(json))
      .catch((e: Error) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [days]);

  const site = data?.site;

  return (
    <div dir="rtl" className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text-primary">وكيل الرصد</h1>
          <p className="mt-1 text-sm text-text-secondary">
            {data
              ? `sardhahab.com · آخر ${data.windowDays} يوم · حُدّث ${new Date(data.generatedAt).toLocaleString("ar-SA")}`
              : "sardhahab.com"}
          </p>
        </div>
        <div className="flex gap-1 rounded-lg bg-surface p-1">
          {WINDOWS.map((w) => (
            <button
              key={w}
              onClick={() => setDays(w)}
              className={`rounded px-3 py-1.5 text-sm transition-colors ${
                days === w ? "bg-gold text-background" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {w} يوم
            </button>
          ))}
        </div>
      </header>

      {data && (
        <div className="mb-6 flex flex-wrap gap-2 text-xs">
          {(
            [
              ["جوجل أناليتكس وسيرش كونسول", data.sources.google],
              ["أحداثنا الخاصة", data.sources.owned],
              ["ميتا", data.sources.meta],
            ] as const
          ).map(([label, ok]) => (
            <span
              key={label}
              className={`rounded px-2.5 py-1 ${ok ? "bg-rise/10 text-rise" : "bg-surface-2 text-text-secondary"}`}
            >
              {ok ? "متصل" : "غير متصل"} · {label}
            </span>
          ))}
        </div>
      )}

      {loading && <p className="py-12 text-center text-sm text-text-secondary">جارٍ بناء التقرير…</p>}
      {error && <p className="rounded-lg bg-fall/10 p-4 text-sm text-fall">{error}</p>}

      {data && !loading && (
        <>
          {data.errors.length > 0 && (
            <div className="mb-6 rounded-lg bg-fall/10 p-4 text-sm text-fall">
              <p className="font-semibold">تعذر جلب بعض المصادر</p>
              <ul className="mt-1 list-disc pr-5">
                {data.errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <section className="mb-8">
            <h2 className="mb-2 text-sm font-semibold text-text-primary">
              ما رصده الوكيل ({data.findings.length})
            </h2>
            <div className="rounded-lg bg-surface px-4">
              {data.findings.length ? (
                data.findings.map((f) => <FindingCard key={f.code} finding={f} />)
              ) : (
                <p className="py-6 text-sm text-text-secondary">لا شيء يستدعي الانتباه في هذه الفترة.</p>
              )}
            </div>
          </section>

          {site && (
            <section className="mb-8">
              <h2 className="mb-2 text-sm font-semibold text-text-primary">الموقع</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <Metric
                  label="جلسات"
                  value={nf.format(site.current.sessions)}
                  hint={site.comparable ? `سابقا ${nf.format(site.previous.sessions)}` : "بلا مقارنة موثوقة"}
                />
                <Metric label="مستخدمون" value={nf.format(site.current.users)} />
                <Metric label="مشاهدات" value={nf.format(site.current.views)} />
                <Metric label="تفاعل" value={pct(site.current.engagementRate)} />
                <Metric label="ارتداد" value={pct(site.current.bounceRate)} />
              </div>
              {data.owned.configured && (
                <p className="mt-2 text-xs text-text-secondary">
                  مخزوننا الخاص — بعد رفض الترافيك الآلي — يسجل{" "}
                  <span className="text-text-primary">{nf.format(data.owned.sessions)}</span> جلسة و{" "}
                  {nf.format(data.owned.events)} حدث. اعتمد هذا الرقم عند قياس النمو.
                </p>
              )}
            </section>
          )}

          {data.search && (
            <section className="mb-8">
              <h2 className="mb-2 text-sm font-semibold text-text-primary">البحث</h2>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Metric label="ظهور" value={nf.format(data.search.totals.impressions)} />
                <Metric label="نقرات" value={nf.format(data.search.totals.clicks)} tone="text-fall" />
                <Metric label="نسبة النقر" value={pct(data.search.totals.ctr, 2)} />
                <Metric label="متوسط الترتيب" value={data.search.totals.position.toFixed(1)} />
              </div>
            </section>
          )}

          {data.meta.configured && (
            <section className="mb-8">
              <h2 className="mb-2 text-sm font-semibold text-text-primary">السوشيال</h2>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Metric label="متابعو فيسبوك" value={nf.format(data.meta.facebook.followers ?? 0)} />
                <Metric
                  label="تفاعل فيسبوك"
                  value={data.meta.facebook.engagements30d === null ? "—" : nf.format(data.meta.facebook.engagements30d)}
                  hint="الوصول ألغته ميتا"
                  tone={data.meta.facebook.engagements30d === 0 ? "text-fall" : undefined}
                />
                <Metric label="متابعو إنستغرام" value={nf.format(data.meta.instagram.followers ?? 0)} />
                <Metric
                  label="وصول إنستغرام"
                  value={nf.format(data.meta.instagram.reach30d ?? 0)}
                  hint={data.meta.instagram.tokenValid ? undefined : "التوكن لا يعمل"}
                />
              </div>
            </section>
          )}

          <Table
            title="القنوات"
            head={["القناة", "جلسات", "ارتداد", "متوسط المدة"]}
            rows={data.channels.map((c) => [c.key, nf.format(c.sessions), pct(c.bounceRate), duration(c.avgDuration)])}
          />

          <Table
            title="صفحات الدخول"
            head={["الصفحة", "جلسات", "ارتداد", "متوسط المدة"]}
            rows={data.landingPages
              .slice(0, 12)
              .map((p) => [
                safeDecode(p.key),
                nf.format(p.sessions),
                pct(p.bounceRate),
                duration(p.avgDuration),
              ])}
          />

          {data.search && (
            <Table
              title="أعلى الكلمات"
              head={["الكلمة", "نقرات", "ظهور", "الترتيب"]}
              rows={[...data.search.queries]
                .sort((a, b) => b.impressions - a.impressions)
                .slice(0, 15)
                .map((q) => [q.key, nf.format(q.clicks), nf.format(q.impressions), q.position.toFixed(1)])}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function RadarPage() {
  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/radar?days=7");
    return res.status !== 401;
  }, []);

  return (
    <PinGate icon="📡" title="وكيل الرصد" subtitle="أدخل الرمز لعرض تقرير الأداء" checkAuth={checkAuth}>
      <Report />
    </PinGate>
  );
}
