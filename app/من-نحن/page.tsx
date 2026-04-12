import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "من نحن",
  description:
    "تعرّف على موقع سعر الذهب — المرجع العربي لأسعار الذهب والفضة والعملات الرقمية لحظياً مع أخبار اقتصادية وتنبيهات ذكية.",
  openGraph: {
    title: "من نحن — سعر الذهب",
    description: "تعرّف على موقع سعر الذهب ومصادر بياناته وما يقدمه",
    type: "website",
  },
  alternates: {
    canonical: "https://sardhahab.com/من-نحن",
  },
};

export default function AboutPage() {
  return (
    <div dir="rtl" className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-text-primary mb-8">من نحن</h1>

      {/* البطاقة الرئيسية */}
      <div className="bg-gradient-to-l from-gold/5 to-gold/10 border border-gold/20 rounded-2xl p-8 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">🏅</span>
          <div>
            <h2 className="text-2xl font-black text-gold">سعر الذهب</h2>
            <p className="text-text-secondary">أسعار لحظية للذهب والعملات</p>
          </div>
        </div>
        <p className="text-text-secondary leading-relaxed">
          موقع عربي متكامل متخصص في تقديم أسعار الذهب والفضة والعملات الرقمية
          والعملات العالمية بشكل لحظي، مع أخبار اقتصادية يومية وتنبيهات ذكية للأسواق.
          نسعى إلى أن نكون المرجع العربي الأول للمتابعة المالية اليومية.
        </p>
      </div>

      {/* إعلان بعد البطاقة الرئيسية */}
      <AdSlot size="leaderboard" slot="6789012345" className="mb-8" />
      <AdSlot size="mobile-banner" slot="6789012346" className="mb-8" />

      {/* ما نُقدّمه */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[
          { icon: "🥇", title: "أسعار المعادن", desc: "ذهب وفضة محدّثة كل 5 دقائق من GoldAPI" },
          { icon: "₿", title: "العملات الرقمية", desc: "بيتكوين وإيثيريوم وغيرها من CoinGecko" },
          { icon: "💱", title: "أسعار الصرف", desc: "أكثر من 27 عملة عربية وعالمية" },
          { icon: "📰", title: "الأخبار", desc: "من BBC عربي والجزيرة ورويترز ومصادر موثوقة" },
          { icon: "🔔", title: "التنبيهات", desc: "تنبيهات يومية وسعرية مجانية على بريدك" },
          { icon: "📊", title: "الإشارات التقنية", desc: "RSI والمتوسطات المتحركة — للإعلام فقط" },
        ].map((item) => (
          <div key={item.title} className="bg-surface border border-border rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="font-bold text-text-primary">{item.title}</h3>
            </div>
            <p className="text-text-secondary text-sm">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* إعلان في المنتصف */}
      <AdSlot size="responsive" slot="6789012347" className="mb-8" />

      {/* التزامنا */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
        <h2 className="text-text-primary font-bold text-xl mb-4">التزامنا</h2>
        <div className="space-y-3 text-text-secondary text-sm">
          <div className="flex items-start gap-2">
            <span className="text-gold mt-0.5">✓</span>
            <p>الشفافية التامة — نوضح دائماً أن المحتوى إعلامي وليس استثمارياً</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gold mt-0.5">✓</span>
            <p>خصوصيتك أولاً — لا نبيع بياناتك لأي طرف</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gold mt-0.5">✓</span>
            <p>مجانية كاملة — جميع الخدمات الأساسية مجانية</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gold mt-0.5">✓</span>
            <p>تحديث مستمر — أسعار تُحدَّث باستمرار طوال ساعات التداول</p>
          </div>
        </div>
      </div>

      {/* تنبيه مهم */}
      <div className="bg-gold/5 border border-gold/20 rounded-xl p-5 mb-8">
        <h3 className="text-gold font-bold mb-2">⚠️ تنبيه مهم</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          نحن لسنا مستشارين ماليين مرخصين. جميع المعلومات والأسعار والإشارات التقنية
          المعروضة هي لأغراض إعلامية وتعليمية فقط ولا تمثل نصيحة استثمارية.
          يُرجى قراءة{" "}
          <Link href="/إخلاء-مسؤولية" className="text-gold hover:underline">
            إخلاء المسؤولية
          </Link>{" "}
          كاملاً.
        </p>
      </div>

      {/* روابط قانونية */}
      <div className="flex flex-wrap gap-3">
        <Link href="/إخلاء-مسؤولية" className="text-gold hover:text-gold-light text-sm transition-colors">
          إخلاء المسؤولية
        </Link>
        <span className="text-border">|</span>
        <Link href="/شروط-الاستخدام" className="text-gold hover:text-gold-light text-sm transition-colors">
          شروط الاستخدام
        </Link>
        <span className="text-border">|</span>
        <Link href="/سياسة-الخصوصية" className="text-gold hover:text-gold-light text-sm transition-colors">
          سياسة الخصوصية
        </Link>
      </div>
    </div>
  );
}
