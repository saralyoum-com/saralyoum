# سعر اليوم — Claude Code Project Prompt

## Project Overview
**sardhahab.com** — A real-time gold, silver, crypto, and currency prices website in Arabic & English.
- Framework: Next.js 14 App Router (TypeScript)
- Styling: Tailwind CSS (dark theme, custom gold palette)
- Hosting: Vercel (project name: `saralyoum`)
- Domain: sardhahab.com (Namecheap → Vercel DNS)
- Analytics: Google Analytics 4 (ID: `G-2EFBVGR83R`)
- Ads: Google AdSense (publisher: `ca-pub-6286580154921898`)

---

## Directory Structure
```
app/
  page.tsx                  → Home page (SSR, revalidate: 60s)
  layout.tsx                → Root layout (GA, AdSense, providers)
  sitemap.ts                → Auto-generated sitemap.xml
  robots.ts                 → Auto-generated robots.txt
  اسعار/page.tsx            → Live prices table (Gold/Silver/Crypto/Currencies)
  حاسبة-الذهب/page.tsx     → Gold value + Zakat calculator
  اخبار/page.tsx            → Economic news feed (RSS)
  تنبيهات/page.tsx          → Smart price alerts (email subscription)
  من-نحن/page.tsx           → About page
  شروط-الاستخدام/page.tsx  → Terms of use
  سياسة-الخصوصية/page.tsx  → Privacy policy
  إخلاء-مسؤولية/page.tsx   → Disclaimer
  api/
    prices/route.ts         → Prices API (metals, crypto, currencies)
    news/route.ts           → News RSS aggregator
    alerts/route.ts         → Email alerts subscription

components/
  Navigation.tsx            → Sticky header with mobile hamburger menu
  Footer.tsx                → Site footer with links
  PriceTicker.tsx           → Scrolling live price ticker (top of page)
  PriceCard.tsx             → Individual asset price card
  PriceCardsClient.tsx      → Grid wrapper for 4 price cards
  HomeContent.tsx           → Home sections (Hero, CTA, News, QuickLinks)
  AdSlot.tsx                → Google AdSense ad slots
  AdSense.tsx               → AdSense script loader
  Disclaimer.tsx            → Disclaimer box (compact/full)
  LocalCurrency.tsx         → User location detection + currency conversion
  LanguageContext.tsx       → AR/EN language toggle (localStorage)

lib/
  analytics.ts              → GA4 event tracking utility (track.*)
  goldapi.ts                → GoldAPI.io integration
  coingecko.ts              → CoinGecko crypto prices
  exchangerate.ts           → ExchangeRate-API currency rates
  technical.ts              → Mock technical analysis signals
  format.ts                 → Date/number formatting helpers
  i18n.ts                   → Translation strings (AR/EN)
  supabase.ts               → Supabase client (alerts storage)
```

---

## Key Conventions

### Language / i18n
- All pages support Arabic (RTL) and English (LTR)
- Use `const { lang, t } = useLang()` in client components
- Use `const dir = lang === "ar" ? "rtl" : "ltr"` for layout direction
- For inline text: `lang === "ar" ? "النص العربي" : "English text"`
- The `t` object from `useLang()` covers nav, home, and common strings
- For page-specific strings, use the `txt` object pattern (see alerts page)

### Responsiveness Rules
- Mobile-first: always start with base (mobile) styles, add `sm:` `md:` `lg:` breakpoints
- Use `px-3 sm:px-4` for horizontal padding
- Use `py-6 sm:py-8` for vertical padding
- Use `text-2xl sm:text-3xl` for headings
- Use `gap-3 sm:gap-4` for grid/flex gaps
- Grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (never skip sm for 4-col grids)
- Tables: always wrap in `overflow-x-auto` and set `min-w-[360px]` on table
- Flex rows that could wrap on mobile: use `flex-col sm:flex-row`
- Do NOT use inline `style={{ height: "Xpx" }}` — use Tailwind `h-X` classes instead

### Analytics Tracking
- Import: `import { track } from "@/lib/analytics"`
- All interactive elements should call a `track.*` function
- Common events are pre-defined in `lib/analytics.ts`
- Add new events to `lib/analytics.ts` following the existing pattern
- Events fire via `window.gtag("event", ...)` — they silently no-op server-side

### AdSense Ad Slots
- Import: `import AdSlot from "@/components/AdSlot"`
- Sizes: `"leaderboard"` (728×90, desktop only), `"mobile-banner"` (320×50, mobile only), `"responsive"`, `"rectangle"`
- Always pair leaderboard + mobile-banner for full coverage:
  ```tsx
  <AdSlot size="leaderboard" slot="SLOT_ID" className="mb-6" />
  <AdSlot size="mobile-banner" slot="SLOT_ID_NEXT" className="mb-6" />
  ```
- Ad slots show placeholder boxes in development, real ads in production
- Publisher ID is hardcoded in `AdSlot.tsx` — do NOT change it

### SEO Metadata
- Client pages (`"use client"`) cannot export `metadata` — use a sibling `layout.tsx` instead
- All metadata uses `metadataBase: new URL("https://sardhahab.com")`
- Always include: title, description, keywords, openGraph, alternates.canonical
- JSON-LD structured data goes in `<script type="application/ld+json">` inside the page component

### API Routes
- All API routes use `export const dynamic = "force-dynamic"`
- Prices: `/api/prices?type=metals|crypto|currencies`
- News: `/api/news?lang=ar|en`
- Alerts: `POST /api/alerts` with `{ email, asset, type, targetPrice?, condition? }`
- Fallback mock data is provided if external APIs fail

### Cache Strategy
- Home page: `export const revalidate = 60` (1 minute ISR)
- News page: fetches with `next: { revalidate: 900 }` (15 minutes)
- API price routes: s-maxage=300 (5 minutes)
- API news routes: s-maxage=900 (15 minutes)
- Static assets: immutable (1 year)

---

## Design System

### Colors (CSS variables + Tailwind)
- `bg-background` — main dark background
- `bg-surface` — card background
- `bg-surface-2` — inner card elements
- `border-border` — border color
- `text-text-primary` — main text
- `text-text-secondary` — muted text
- `text-gold` / `bg-gold` — #C9A84C (primary brand color)
- `text-gold-light` / `bg-gold-light` — lighter gold (hover)
- `text-rise` / `bg-rise/10` — green (price up)
- `text-fall` / `bg-fall/10` — red (price down)

### Typography
- Font: Tajawal (Arabic + Latin) via `--font-tajawal`
- Headlines: `font-black` (900 weight)
- Body: `font-medium` (500)
- Captions: `text-xs text-text-secondary`

### Component Patterns
- Cards: `bg-surface border border-border rounded-2xl p-4 sm:p-5`
- Buttons (primary): `bg-gold text-background font-bold px-4 py-2.5 rounded-xl hover:bg-gold-light`
- Buttons (secondary): `border border-border text-text-secondary hover:text-text-primary rounded-xl`
- Inputs: `bg-surface-2 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-gold`
- Active pills: `bg-gold text-background`
- Inactive pills: `bg-surface border border-border text-text-secondary`

---

## External Services

| Service | Purpose | Key |
|---------|---------|-----|
| GoldAPI.io | Gold & silver spot prices | in `lib/goldapi.ts` |
| CoinGecko | BTC & ETH prices | in `lib/coingecko.ts` |
| ExchangeRate-API | Currency conversion rates | in `lib/exchangerate.ts` |
| Supabase | Alert subscriptions storage | in `lib/supabase.ts` |
| Google Analytics 4 | User tracking | `G-2EFBVGR83R` |
| Google AdSense | Ad revenue | `ca-pub-6286580154921898` |
| Vercel | Hosting + Edge functions | project: `saralyoum` |

---

## Deployment
```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Build
npm run build

# Deploy to Vercel (auto on git push to main)
npx vercel --prod
```

Environment variables needed in Vercel dashboard:
- `GOLDAPI_KEY` — GoldAPI.io API key
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `EXCHANGERATE_API_KEY` — ExchangeRate-API key

---

## Common Tasks

### Add a new page
1. Create `app/[page-name]/page.tsx` (add "use client" if needed)
2. If client page: create `app/[page-name]/layout.tsx` for SEO metadata
3. Add the route to `Navigation.tsx` navHrefs array
4. Add to `app/sitemap.ts`
5. Add i18n labels to `lib/i18n.ts`

### Add GA tracking to a new element
```typescript
import { track } from "@/lib/analytics";
// Use existing events or add new ones to lib/analytics.ts
<button onClick={() => track.navClick("my-page")}>Click</button>
```

### Add an ad slot
```tsx
import AdSlot from "@/components/AdSlot";
// Desktop leaderboard + mobile banner (paired)
<AdSlot size="leaderboard" slot="YOUR_SLOT_ID" className="mb-6" />
<AdSlot size="mobile-banner" slot="YOUR_SLOT_ID_2" className="mb-6" />
```

### Add a new translation key
1. Open `lib/i18n.ts`
2. Add the key to both `ar` and `en` objects
3. Use via `t.yourSection.yourKey` in components

---

## Do NOT
- Do NOT change the AdSense publisher ID (`ca-pub-6286580154921898`)
- Do NOT change the GA measurement ID (`G-2EFBVGR83R`)
- Do NOT use hardcoded inline height styles — use Tailwind `h-*` classes
- Do NOT skip `sm:` breakpoints in grids with 3+ columns
- Do NOT export `metadata` from pages with `"use client"` — use `layout.tsx` instead
- Do NOT use fixed pixel widths on elements that should stretch
- Do NOT modify `app/sitemap.ts` or `app/robots.ts` URLs without updating the domain config
