"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to console — replace with Sentry.captureException(error) when Sentry is added
    console.error("[GlobalError]", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" dir="rtl">
      <div className="bg-surface rounded-2xl border border-border p-8 max-w-md w-full">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-xl font-bold text-text-primary mb-2">حدث خطأ غير متوقع</h1>
        <p className="text-text-secondary text-sm mb-6">
          نعتذر عن هذا الخلل. يمكنك المحاولة مجدداً أو العودة للصفحة الرئيسية.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-gold text-background font-bold px-5 py-2.5 rounded-xl hover:bg-gold-light transition-colors text-sm"
          >
            حاول مجدداً
          </button>
          <Link
            href="/"
            className="border border-border text-text-secondary px-5 py-2.5 rounded-xl hover:border-gold hover:text-gold transition-colors text-sm"
          >
            الصفحة الرئيسية
          </Link>
        </div>
        {error.digest && (
          <p className="text-text-secondary text-xs mt-4 opacity-40">
            كود الخطأ: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
