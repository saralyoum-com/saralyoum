"use client";

import { useState } from "react";
import Disclaimer from "@/components/Disclaimer";
import AdSlot from "@/components/AdSlot";
import { useLang } from "@/components/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@/lib/analytics";

type Step = "form" | "success";

export default function AlertsPage() {
  const { lang } = useLang();
  const dir = lang === "ar" ? "rtl" : "ltr";

  const ASSETS = [
    { id: "gold",     labelAr: "الذهب",    labelEn: "Gold",     icon: "🥇" },
    { id: "silver",   labelAr: "الفضة",    labelEn: "Silver",   icon: "🥈" },
    { id: "bitcoin",  labelAr: "بيتكوين",  labelEn: "Bitcoin",  icon: "₿" },
    { id: "ethereum", labelAr: "إيثيريوم", labelEn: "Ethereum", icon: "⟠" },
  ];

  const [email, setEmail] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [alertType, setAlertType] = useState<"daily" | "price">("daily");
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const txt = {
    title:         lang === "ar" ? "🔔 التنبيهات الذكية"                       : "🔔 Smart Alerts",
    subtitle:      lang === "ar" ? "تلقَّ تنبيهات الأسعار مباشرة في بريدك الإلكتروني" : "Receive price alerts directly in your email",
    emailLabel:    lang === "ar" ? "📧 البريد الإلكتروني"                        : "📧 Email address",
    assetLabel:    lang === "ar" ? "💰 اختر الأصل (يمكن اختيار أكثر من واحد)"   : "💰 Select asset (multiple allowed)",
    alertTypeLabel:lang === "ar" ? "⚙️ نوع التنبيه"                             : "⚙️ Alert type",
    daily:         lang === "ar" ? "تنبيه يومي"                                 : "Daily alert",
    dailySub:      lang === "ar" ? "كل يوم 8 صباحاً"                            : "Every day at 8 AM",
    price:         lang === "ar" ? "تنبيه سعري"                                 : "Price alert",
    priceSub:      lang === "ar" ? "عند بلوغ سعر معين"                          : "When price target is reached",
    targetLabel:   lang === "ar" ? "🎯 السعر المستهدف (USD)"                    : "🎯 Target price (USD)",
    above:         lang === "ar" ? "▲ فوق السعر"                                : "▲ Above price",
    below:         lang === "ar" ? "▼ تحت السعر"                                : "▼ Below price",
    placeholder:   lang === "ar" ? "مثال: 3200"                                 : "e.g. 3200",
    maxAlerts:     lang === "ar" ? "⚠️ حد أقصى 3 تنبيهات سعرية لكل بريد إلكتروني" : "⚠️ Max 3 price alerts per email",
    subscribe:     lang === "ar" ? "🔔 اشترك في التنبيهات مجاناً"               : "🔔 Subscribe to alerts for free",
    subscribing:   lang === "ar" ? "جاري التسجيل..."                             : "Subscribing...",
    terms:         lang === "ar" ? "بالاشتراك، تقبل"                             : "By subscribing, you accept the",
    termsLink:     lang === "ar" ? "شروط الاستخدام"                              : "Terms of Use",
    and:           lang === "ar" ? "و"                                           : "and",
    privacyLink:   lang === "ar" ? "سياسة الخصوصية"                             : "Privacy Policy",
    successTitle:  lang === "ar" ? "تم التسجيل بنجاح!"                          : "Successfully subscribed!",
    successSub:    lang === "ar" ? "سيصلك بريد تأكيد على"                        : "A confirmation email will be sent to",
    successNote:   lang === "ar" ? "📅 التنبيه اليومي يُرسَل الساعة 8:00 صباحاً (توقيت الرياض)" : "📅 Daily alert is sent at 8:00 AM (Riyadh time)",
    addAnother:    lang === "ar" ? "إضافة تنبيه آخر"                             : "Add another alert",
    errEmail:      lang === "ar" ? "يُرجى إدخال البريد الإلكتروني"               : "Please enter your email",
    errAsset:      lang === "ar" ? "يُرجى اختيار أصل واحد على الأقل"             : "Please select at least one asset",
    errPrice:      lang === "ar" ? "يُرجى إدخال السعر المستهدف"                  : "Please enter the target price",
    errServer:     lang === "ar" ? "تعذّر الاتصال بالخادم، يُرجى المحاولة لاحقاً" : "Could not connect to server, please try again",
  };

  function toggleAsset(id: string) {
    const willSelect = !selectedAssets.includes(id);
    track.alertAssetToggle(id, willSelect);
    setSelectedAssets((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email) { setError(txt.errEmail); return; }
    if (selectedAssets.length === 0) { setError(txt.errAsset); return; }
    if (alertType === "price" && !targetPrice) { setError(txt.errPrice); return; }

    setLoading(true);
    try {
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
        setError(firstFailed.error || txt.errServer);
        return;
      }

      track.alertFormSubmit(true, selectedAssets);
      setStep("success");
    } catch {
      track.alertFormSubmit(false, selectedAssets);
      setError(txt.errServer);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir={dir} className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary mb-2">{txt.title}</h1>
        <p className="text-text-secondary">{txt.subtitle}</p>
      </div>

      {/* Telegram Channel Banner */}
      <a
        href="https://t.me/sardhahab"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 sm:gap-4 bg-[#229ED9]/10 border border-[#229ED9]/40 rounded-2xl p-4 sm:p-5 mb-6 hover:bg-[#229ED9]/15 transition-all group"
      >
        <div className="shrink-0 w-11 h-11 bg-[#229ED9] rounded-xl flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-2.04 9.613c-.149.666-.546.829-1.107.516l-3.07-2.263-1.482 1.425c-.165.165-.303.303-.618.303l.22-3.12 5.674-5.126c.247-.22-.054-.342-.383-.123L6.91 14.42 3.9 13.473c-.657-.207-.67-.657.138-.973l10.88-4.195c.547-.197 1.026.133.844.943z"/></svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-text-primary text-sm sm:text-base group-hover:text-[#229ED9] transition-colors">
            {lang === "ar" ? "🔔 انضم لقناة سعر اليوم على تيليجرام" : "🔔 Join sardhahab on Telegram"}
          </div>
          <div className="text-text-secondary text-xs sm:text-sm mt-0.5">
            {lang === "ar"
              ? "تنبيهات فورية بأسعار الذهب والعملات — مجاناً"
              : "Instant gold & currency price alerts — free"}
          </div>
        </div>
        <div className="shrink-0 text-[#229ED9] font-bold text-sm hidden sm:flex items-center gap-1">
          {lang === "ar" ? "انضم الآن" : "Join Now"} ←
        </div>
      </a>

      {/* Ad at top */}
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
            <h2 className="text-2xl font-bold text-text-primary mb-2">{txt.successTitle}</h2>
            <p className="text-text-secondary mb-4">
              {txt.successSub} <span className="text-gold">{email}</span>
            </p>
            <div className="bg-surface-2 rounded-xl p-4 text-sm text-text-secondary mb-6">
              <p>{txt.successNote}</p>
            </div>
            <button
              onClick={() => { setStep("form"); setEmail(""); setSelectedAssets([]); setTargetPrice(""); }}
              className="bg-gold text-background font-bold px-6 py-2.5 rounded-xl hover:bg-gold-light transition-colors"
            >
              {txt.addAnother}
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
            {/* Email */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <label className="block text-text-primary font-bold mb-3">{txt.emailLabel}</label>
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

            {/* Asset selection */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <label className="block text-text-primary font-bold mb-3">{txt.assetLabel}</label>
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
                    <span className="font-medium text-sm">
                      {lang === "ar" ? asset.labelAr : asset.labelEn}
                    </span>
                    {selectedAssets.includes(asset.id) && (
                      <span className={`${lang === "ar" ? "mr-auto" : "ml-auto"} text-gold`}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Alert type */}
            <div className="bg-surface border border-border rounded-2xl p-5">
              <label className="block text-text-primary font-bold mb-3">{txt.alertTypeLabel}</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => { setAlertType("daily"); track.alertTypeSelect("daily"); }}
                  className={`p-4 rounded-xl border ${lang === "ar" ? "text-right" : "text-left"} transition-all ${
                    alertType === "daily" ? "border-gold bg-gold/10" : "border-border hover:border-gold/40"
                  }`}
                >
                  <div className="text-2xl mb-1">📅</div>
                  <div className={`font-bold text-sm ${alertType === "daily" ? "text-gold" : "text-text-primary"}`}>
                    {txt.daily}
                  </div>
                  <div className="text-text-secondary text-xs mt-0.5">{txt.dailySub}</div>
                </button>
                <button
                  type="button"
                  onClick={() => { setAlertType("price"); track.alertTypeSelect("price"); }}
                  className={`p-4 rounded-xl border ${lang === "ar" ? "text-right" : "text-left"} transition-all ${
                    alertType === "price" ? "border-gold bg-gold/10" : "border-border hover:border-gold/40"
                  }`}
                >
                  <div className="text-2xl mb-1">🎯</div>
                  <div className={`font-bold text-sm ${alertType === "price" ? "text-gold" : "text-text-primary"}`}>
                    {txt.price}
                  </div>
                  <div className="text-text-secondary text-xs mt-0.5">{txt.priceSub}</div>
                </button>
              </div>
            </div>

            {/* Target price */}
            <AnimatePresence>
              {alertType === "price" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-surface border border-border rounded-2xl p-5"
                >
                  <label className="block text-text-primary font-bold mb-3">{txt.targetLabel}</label>
                  <div className="flex gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => { setCondition("above"); track.alertConditionSelect("above"); }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        condition === "above" ? "border-rise bg-rise/10 text-rise" : "border-border text-text-secondary"
                      }`}
                    >
                      {txt.above}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setCondition("below"); track.alertConditionSelect("below"); }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        condition === "below" ? "border-fall bg-fall/10 text-fall" : "border-border text-text-secondary"
                      }`}
                    >
                      {txt.below}
                    </button>
                  </div>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder={txt.placeholder}
                    dir="ltr"
                    className="w-full bg-surface-2 border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-gold transition-colors text-sm"
                  />
                  <p className="text-text-secondary text-xs mt-2">{txt.maxAlerts}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <Disclaimer compact />

            {/* Ad between form and submit */}
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
              {loading ? txt.subscribing : txt.subscribe}
            </button>

            <p className="text-center text-text-secondary text-xs">
              {txt.terms}{" "}
              <a href="/شروط-الاستخدام" className="text-gold hover:underline">{txt.termsLink}</a>
              {" "}{txt.and}{" "}
              <a href="/سياسة-الخصوصية" className="text-gold hover:underline">{txt.privacyLink}</a>
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
