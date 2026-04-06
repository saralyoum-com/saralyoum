export default function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div
        dir="rtl"
        className="bg-surface-2 border border-border rounded-xl px-4 py-3 text-xs text-text-secondary"
      >
        ⚠️ المحتوى لأغراض تعليمية وإعلامية فقط. لا يمثل نصيحة استثمارية أو مالية.
        استشر مستشاراً مالياً مرخصاً قبل أي قرار.
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="bg-surface border border-gold/20 rounded-2xl p-5 my-6"
    >
      <div className="flex items-start gap-3">
        <span className="text-gold text-xl mt-0.5">⚠️</span>
        <div>
          <h3 className="text-gold font-bold mb-2">إخلاء المسؤولية</h3>
          <p className="text-text-secondary text-sm leading-relaxed">
            المحتوى المعروض على هذا الموقع لأغراض تعليمية وإعلامية فقط.
            لا يمثل نصيحة استثمارية أو مالية أو توصية بشراء أو بيع أي أصل مالي.
            الاستثمار في الأسواق المالية والعملات الرقمية ينطوي على مخاطر عالية.
            يُرجى استشارة مستشار مالي مرخص قبل اتخاذ أي قرار استثماري.
          </p>
        </div>
      </div>
    </div>
  );
}
