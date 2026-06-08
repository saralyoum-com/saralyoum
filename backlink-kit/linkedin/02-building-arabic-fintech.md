# LinkedIn Article #2 (Tech / Founder Story)

**Posting strategy:**
- Post 1-2 weeks after Article #1
- Tag tech-related Arabic finance figures
- Cross-post to your X (@sardhahab)

---

## Title (Arabic)
**كيف بنيت موقع تتبع ذهب عربي في 30 يوماً (وما تعلمته)**

## Hashtags
#فينتك #تكنولوجيا #الذهب #المملكة_العربية_السعودية #ريادة_الأعمال #NextJS #AI

---

قبل 30 يوماً، لم يكن لدي إلا فكرة:

**"لماذا لا يوجد موقع عربي حقيقي لتتبع أسعار الذهب لحظياً مثل CoinMarketCap للعملات الرقمية؟"**

اليوم، [sardhahab.com](https://sardhahab.com) موقع يقدّم:
✅ أسعار الذهب لحظياً بـ 19 عملة عربية
✅ صفحات مخصصة لـ 16 دولة عربية
✅ حاسبة زكاة ذهب وعملات رقمية
✅ تنبيهات سعرية فورية
✅ تحقق Chainlink من الأسعار
✅ محتوى أصلي بأكثر من 25,000 كلمة

كل هذا في 30 يوماً، بكلفة استضافة لا تتجاوز $20 شهرياً.

## 🛠️ التقنيات المستخدمة

**Frontend**: Next.js 14 (App Router) + Tailwind CSS
**Backend**: Vercel Edge Functions + Supabase
**Data**: GoldAPI.io + CoinGecko + ExchangeRate-API + Chainlink
**Email**: Resend
**Push**: OneSignal
**Analytics**: Google Analytics 4 + Search Console + Supermetrics

## 💡 أصعب 3 تحديات

### 1. مشكلة الـ URL العربي على Vercel
ماك OS يستخدم Unicode NFD، بينما Linux/Vercel يستخدم NFC. هذا يعني أن `سعر-الذهب-السعودية` يعمل محلياً لكنه يفشل في الإنتاج.

**الحل**: Edge Middleware يقوم بـ decode + NFC normalize + توجيه ASCII داخلي.

### 2. تحديث الأسعار في الوقت الفعلي
كنت أحتاج أسعار لحظية بدون تكلفة هائلة. الحل كان طبقات متعددة:
- API الأساسي (GoldAPI.io)
- Yahoo Finance كاحتياطي
- أسعار افتراضية صحيحة للحالات الاستثنائية
- ISR (Incremental Static Regeneration) لتحديث الصفحة كل 60 ثانية

### 3. SEO عربي حقيقي
معظم مواقع SEO الإنجليزية لا تنطبق على المحتوى العربي. اضطررت لـ:
- محتوى عربي أصلي عميق (1,500+ كلمة لكل صفحة دولة)
- JSON-LD Schema بالعربية
- روابط canonical عربية صحيحة
- معالجة خاصة لرمزَي الريال السعودي والدرهم الإماراتي الجديدَين

## 📊 الأرقام بعد 30 يوماً

- **0 → 250 ظهور أسبوعياً** في Google
- **3 استفسارات في المركز 11-12** (قريبة من الصفحة الأولى)
- **متوسط مدة الجلسة: 14 دقيقة** (مذهل لموقع جديد)
- **25,000+ كلمة عربية أصلية** عن سوق الذهب

## 🚀 ما هو التالي

الخطة للـ 60 يوم القادمة:
- إطلاق تطبيق للجوال (React Native)
- خدمة API تجارية للمواقع الأخرى
- نظام حسابات مستخدمين
- محتوى فيديو قصير على X/تيليجرام

## 🎓 الدرس الأكبر

**السوق العربي ليس صغيراً — هو فقط غير مخدوم بشكل جيد.**

كل عربي يتعامل مع الذهب يومياً: في الزواج، الادخار، الزكاة، أو الاستثمار. لكن الأدوات المتاحة بالعربية أقل بكثير من المعروض بالإنجليزية.

هذه فرصة، وليست مجرد مشكلة.

## 🤝 شارك بتجربتك

هل بنيت أو تخطط لبناء منتج فينتك عربي؟ ما هي أكبر التحديات التي واجهتك؟

أحب أن أتعلم من تجاربكم.

---

**Bio:** أيمن مالوستات — مؤسس [sardhahab.com](https://sardhahab.com). أشارك تجربتي في بناء منتجات فينتك للسوق العربي.

---

## English Version (post separately)

**Title:** How I Built an Arabic Gold Tracker in 30 Days (And What I Learned)

#Fintech #Tech #Gold #SaudiArabia #Entrepreneurship #NextJS #AI

30 days ago, I had just an idea:

**"Why isn't there a real Arabic gold price tracker like CoinMarketCap for crypto?"**

Today, [sardhahab.com](https://sardhahab.com) offers:
✅ Real-time gold prices in 19 Arab currencies
✅ Dedicated pages for 16 Arab countries
✅ Gold + crypto zakat calculators
✅ Instant price alerts
✅ Chainlink price verification
✅ 25,000+ words of original Arabic content

All in 30 days, with hosting costs under $20/month.

[Continue translating the rest...]
