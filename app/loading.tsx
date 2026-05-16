export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center" dir="rtl">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
        <p className="text-text-secondary text-sm">جاري التحميل...</p>
      </div>
    </div>
  );
}
