import Link from "next/link";
import GoldPredictionPoll from "@/components/GoldPredictionPoll";

export default function TechnicalAnalysisPage() {
  return (
    <main dir="rtl" className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-[12px] text-text-secondary mb-6">
        <Link href="/" className="hover:text-gold transition-colors">الرئيسية</Link>
        <span>/</span>
        <span className="text-text-primary">التحليل التقني للذهب</span>
      </nav>

      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <span className="text-gold text-xl">✦</span>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary">
            التحليل التقني للذهب
          </h1>
        </div>
        <p className="text-sm text-text-secondary max-w-2xl">
          توقعات يومية وأسبوعية وشهرية لسعر الذهب مدعومة بالذكاء الاصطناعي، مع تصويت مجتمع المتداولين العرب.
        </p>
      </div>

      {/* Main poll widget */}
      <GoldPredictionPoll />

      {/* Other assets grid */}
      <section className="mt-10 mb-8">
        <h2 className="text-base font-bold text-text-primary mb-4">تحليل أصول أخرى</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-1.5 opacity-60">
            <span className="text-xl">🥈</span>
            <p className="text-sm font-bold text-text-primary">الفضة</p>
            <p className="text-[11px] text-text-secondary">قريباً</p>
          </div>
          <Link
            href="/سعر-البيتكوين"
            className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-1.5 hover:border-gold/40 transition-colors"
          >
            <span className="text-xl">₿</span>
            <p className="text-sm font-bold text-text-primary">بيتكوين</p>
            <p className="text-[11px] text-gold">عرض السعر ←</p>
          </Link>
          <Link
            href="/سعر-الاثيريوم"
            className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-1.5 hover:border-gold/40 transition-colors"
          >
            <span className="text-xl">⟠</span>
            <p className="text-sm font-bold text-text-primary">إيثيريوم</p>
            <p className="text-[11px] text-gold">عرض السعر ←</p>
          </Link>
          <Link
            href="/اسعار"
            className="rounded-xl border border-border bg-surface p-4 flex flex-col gap-1.5 hover:border-gold/40 transition-colors"
          >
            <span className="text-xl">📊</span>
            <p className="text-sm font-bold text-text-primary">جميع الأسعار</p>
            <p className="text-[11px] text-gold">عرض الكل ←</p>
          </Link>
        </div>
      </section>

      {/* Alert CTA */}
      <section className="rounded-2xl border border-gold/20 bg-surface p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div>
          <p className="font-bold text-text-primary mb-1">هل تريد تنبيهاً عند تغير السعر؟</p>
          <p className="text-sm text-text-secondary">فعّل التنبيهات وكن أول من يعلم بتحركات الذهب.</p>
        </div>
        <Link
          href="/تنبيهات"
          className="shrink-0 px-5 py-2.5 rounded-xl bg-gold text-background font-bold text-sm hover:opacity-90 transition-opacity"
        >
          تفعيل التنبيهات
        </Link>
      </section>

      {/* Disclaimer */}
      <div className="rounded-xl bg-surface-2 border border-border p-4 text-[11px] text-text-secondary leading-relaxed">
        <strong className="text-text-primary">تنبيه:</strong>{" "}
        التحليلات والتوقعات الواردة في هذه الصفحة مدعومة بالذكاء الاصطناعي وهي لأغراض إعلامية فقط.
        لا تُعدّ نصيحة مالية أو استثمارية. يُنصح بالتشاور مع مستشار مالي متخصص قبل اتخاذ أي قرار استثماري.
      </div>

    </main>
  );
}
