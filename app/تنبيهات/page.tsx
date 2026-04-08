"use client";

import { useState } from "react";
import Disclaimer from "@/components/Disclaimer";
import AdSlot from "@/components/AdSlot";
import { motion, AnimatePresence } from "framer-motion";

const ASSETS = [
  { id: "gold", label: "الذهب", icon: "🥇" },
  { id: "silver", label: "الفضة", icon: "🥈" },
  { id: "bitcoin", label: "بيتكوين", icon: "₿" },
  { id: "ethereum", label: "إيثيريوم", icon: "⟠" },
];

type Step = "form" | "success";

export default function AlertsPage() {
  const [email, setEmail] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [alertType, setAlertType] = useState<"daily" | "price">("daily");
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleAsset(id: string) {
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email) { setError("يُرجى إدخال البريد الإلكتروني"); return; }
    if (selectedAssets.length === 0) { setError("يُرجى اختيار أصل واحد على الأقل"); return; }
    if (alertType === "price" && !targetPrice) { setError("يُرجى إدخال السعر المستهدف"); return; }

    setLoading(true);
    try {
      // أرسل تنبيهاً لكل أصل مختار
      const promises = selectedAssets.map((asset) =>
        fetch("/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            asset,
            type: alertType,
            targetPrice: alertType === "price" ? parseFloat(targetPrice) : undefined,
            condition: alertType === "price" ? condition : undefined,
          }),
        })
      );

      const results = await Promise.all(promises);
      const failed = results.filter((r) => !r.ok);

      if (failed.length > 0) {
        const firstFailed = await failed[0].json();
        setError(firstFailed.error || "حدث خطأ، يُرجى المحاولة لاحقاً");
        return;
      }

      setStep("success");
    } catch {
      setError("تعذّر الاتصال بالخادم، يُرجى المحاولة لاحقاً");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary mb-2">🔔 التنبيهات الذكية</h1>
        <p className="text-text-secondary">تلقَّ تنبيهات الأسعار مباشرة في بريدك الإلكتروني</p>
      </div>

      {/* إعلان أعلى الصفحة */}
      <AdSlot size="leaderboard" slot="5678901234" className="mb-6" />
      <AdSlot size="mobile-banner" slot="5678901235" className="mb-6" />

      <AnimatePresence mode="wait">
        {step === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface border border-rise/20 rounded-2xl p-8 text-center"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">تم التسجيل بنجاح!</h2>
            <p className="text-text-secondary mb-4">
              سيصلك بريد تأكيد على <span className="text-gold">{email}</span>
            </p>
            <div className="bg-surface-2 rounded-xl p-4 text-sm text-text-secondary mb-6">
              <p>📅 التنبيه اليومي يُرسَل الساعة 8:00 صباحاً (توقيت الرياض)</p>
            </div>
            <button
              onClick={() => {
                setStep("form");
                setEmail("");
                setSelectedAssets([]);
                setTargetPrice("");
              }}
              className="bg-gold text-background font-bold px-6 py-2.5 rounded-xl hover:bg-gold-light transition-colors"
            >
              إضافة تنبيه آخر
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* البريد الإلكتروني */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <label className="block text-text-primary font-bold mb-3">
                📧 البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                dir="ltr"
                className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold transition-colors text-sm"
                required
              />
            </div>

            {/* اختيار الأصل */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <label className="block text-text-primary font-bold mb-3">
                💰 اختر الأصل (يمكن اختيار أكثر من واحد)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {ASSETS.map((asset) => (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => toggleAsset(asset.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      selectedAssets.includes(asset.id)
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border text-text-secondary hover:border-gold/40"
                    }`}
                  >
                    <span className="text-xl">{asset.icon}</span>
                    <span className="font-medium text-sm">{asset.label}</span>
                    {selectedAssets.includes(asset.id) && (
                      <span className="mr-auto text-gold">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* نوع التنبيه */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <label className="block text-text-primary font-bold mb-3">
                ⚙️ نوع التنبيه
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAlertType("daily")}
                  className={`p-4 rounded-xl border text-right transition-all ${
                    alertType === "daily"
                      ? "border-gold bg-gold/10"
                      : "border-border hover:border-gold/40"
                  }`}
                >
                  <div className="text-2xl mb-1">📅</div>
                  <div className={`font-bold text-sm ${alertType === "daily" ? "text-gold" : "text-text-primary"}`}>
                    تنبيه يومي
                  </div>
                  <div className="text-text-secondary text-xs mt-0.5">
                    كل يوم 8 صباحاً
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setAlertType("price")}
                  className={`p-4 rounded-xl border text-right transition-all ${
                    alertType === "price"
                      ? "border-gold bg-gold/10"
                      : "border-border hover:border-gold/40"
                  }`}
                >
                  <div className="text-2xl mb-1">🎯</div>
                  <div className={`font-bold text-sm ${alertType === "price" ? "text-gold" : "text-text-primary"}`}>
                    تنبيه سعري
                  </div>
                  <div className="text-text-secondary text-xs mt-0.5">
                    عند بلوغ سعر معين
                  </div>
                </button>
              </div>
            </div>

            {/* السعر المستهدف */}
            <AnimatePresence>
              {alertType === "price" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-surface border border-border rounded-2xl p-5"
                >
                  <label className="block text-text-primary font-bold mb-3">
                    🎯 السعر المستهدف (USD)
                  </label>
                  <div className="flex gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => setCondition("above")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        condition === "above"
                          ? "border-rise bg-rise/10 text-rise"
                          : "border-border text-text-secondary"
                      }`}
                    >
                      ▲ فوق السعر
                    </button>
                    <button
                      type="button"
                      onClick={() => setCondition("below")}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        condition === "below"
                          ? "border-fall bg-fall/10 text-fall"
                          : "border-border text-text-secondary"
                      }`}
                    >
                      ▼ تحت السعر
                    </button>
                  </div>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="مثال: 3200"
                    dir="ltr"
                    className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold transition-colors text-sm"
                  />
                  <p className="text-text-secondary text-xs mt-2">
                    ⚠️ حد أقصى 3 تنبيهات سعرية لكل بريد إلكتروني
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <Disclaimer compact />

            {/* إعلان بين الفورم وزر الإرسال */}
            <AdSlot size="responsive" slot="5678901236" />

            {error && (
              <div className="bg-fall/10 border border-fall/20 rounded-xl px-4 py-3 text-fall text-sm">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-background font-bold py-4 rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {loading ? "جاري التسجيل..." : "🔔 اشترك في التنبيهات مجاناً"}
            </button>

            <p className="text-center text-text-secondary text-xs">
              بالاشتراك، تقبل{" "}
              <a href="/شروط-الاستخدام" className="text-gold hover:underline">
                شروط الاستخدام
              </a>{" "}
              و{" "}
              <a href="/سياسة-الخصوصية" className="text-gold hover:underline">
                سياسة الخصوصية
              </a>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
