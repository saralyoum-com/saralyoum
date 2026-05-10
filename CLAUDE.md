# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
npm run dev      # Start local dev server (http://localhost:3000)
npm run build    # Production build — catches TypeScript + lint errors
npm run lint     # ESLint only
npm run start    # Serve the production build locally
```

No test runner is configured. Validate changes with `npm run build` before deploying.

---

## Project Overview

**sardhahab.com** — Real-time gold, silver, crypto, and currency price site in Arabic & English.

- **Framework**: Next.js 14 App Router (TypeScript)  
- **Styling**: Tailwind CSS (dark theme, custom gold palette)  
- **Hosting**: Vercel (project: `saralyoum`; domain: `sardhahab.com`)  
- **Analytics**: GA4 `G-2EFBVGR83R` · **AdSense**: `ca-pub-6286580154921898`

---

## Critical: Arabic URL Routing (NFD/NFC)

This is the most important architectural nuance in the codebase.

**The problem**: macOS compiles Arabic strings as NFD-encoded. Vercel/Linux normalises incoming URLs to NFC. This means Next.js `rewrites` compiled on macOS **never match** Arabic slugs on production → 404.

**The solution**: `middleware.ts` runs at the Edge, decodes + NFC-normalises every incoming pathname, then maps it to an ASCII route via two lookup tables:

| Table | Maps | To |
|---|---|---|
| `COUNTRY_SLUGS` | e.g. `سعر-الذهب-السعودية` | `/gold/sa` |
| `OTHER_SLUGS` | e.g. `سعر-البيتكوين` | `/bitcoin-price` |

**Rule**: Arabic-path pages **must** be implemented as ASCII routes (`/gold/[code]`, `/bitcoin-price`, `/ethereum-price`, `/zakat-crypto`) with a matching entry in `OTHER_SLUGS` or `COUNTRY_SLUGS`. Never create `app/سعر-البيتكوين/` — it works locally but 404s on Vercel.

The only Arabic directories that work directly are static pages with no rewrite dependency (e.g., `app/مقالات/`, `app/اسعار/`).

---

## Data Layer

All prices have a 3-tier fallback: **primary API → Yahoo Finance → hardcoded mock**.

### `lib/goldapi.ts`
- Primary: `GoldAPI.io` (`GOLDAPI_KEY` env var, `XAU`/`XAG` symbols)
- Fallback: Yahoo Finance (`GC=F` futures for gold, `SI=F` for silver)
- Returns: `PriceData` (from `types/index.ts`)

### `lib/coingecko.ts`
- `getCryptoPrice("bitcoin"|"ethereum")` — single coin via CoinGecko `/coins/:id`
- `getAllCryptoPrices()` — BTC, ETH, BNB, SOL, XRP via `/coins/markets`
- No API key required (free tier)

### `lib/exchangerate.ts`
- Primary: `https://v6.exchangerate-api.com` (`EXCHANGE_RATE_API_KEY`)
- Fallback: `https://open.er-api.com` (keyless)
- Returns: `ExchangeRate[]` — **note**: interface has `nameAr` and `flag` but NO `nameEn`. Use `r.code` when `nameEn` is needed.
- All rates are USD-based (`1 USD = X currency`)

### `lib/supabase.ts`
- Supabase client for alert subscriptions (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

## Core Types (`types/index.ts`)

```typescript
PriceData    // price, change, changePercent, high24h, low24h, marketCap, volume24h
ExchangeRate // code, nameAr, flag, rate, group: "arab"|"world"  — NO nameEn
NewsItem     // id, title, description, url, source, publishedAt
Alert        // email, asset, type: "daily"|"price", targetPrice, condition
```

---

## Provider Tree (Root Layout)

```
LanguageProvider          // AR/EN toggle, localStorage, exposes useLang()
  Navigation
  LocationProvider        // user country detection, currency preference, exposes useSetCurrency()
    <main>{children}</main>
  Footer
OneSignalInit             // push notifications
GoogleAnalytics
AdSenseScript
```

Pages that need the user's preferred currency call `useSetCurrency()` (e.g., `CountryGoldPage` sets the currency automatically on mount so the calculator picks it up globally).

---

## Page Patterns

### Country gold pages
`app/gold/[code]/page.tsx` (SSG, 16 static params) → rendered by `components/CountryGoldPage.tsx`  
Arabic URL is the canonical; `/gold/[code]` is the internal route (blocked in robots.txt).

### Crypto price pages
`app/bitcoin-price/page.tsx` + `app/ethereum-price/page.tsx` (`revalidate = 300`)  
Rendered by `components/CryptoPricePage.tsx`. Arabic slugs are middleware-rewritten.

### Articles
`app/مقالات/[slug]/page.tsx` → rendered by `components/ArticlePage.tsx`  
Article metadata lives in `lib/articles.ts` (`ARTICLES` array). Adding a new article requires: new page + layout under `app/مقالات/`, entry in `ARTICLES`, entry in `app/sitemap.ts`.

### Client pages and SEO
Pages with `"use client"` **cannot export `metadata`**. Always create a sibling `layout.tsx` for metadata + JSON-LD. Put Article + FAQPage + BreadcrumbList schema in the layout.

---

## API Routes (`app/api/`)

All routes: `export const dynamic = "force-dynamic"`

| Route | Purpose |
|---|---|
| `/api/prices?type=metals\|crypto\|currencies\|all` | Aggregates all price sources |
| `/api/news?lang=ar\|en` | RSS feed aggregator |
| `/api/alerts` | POST — saves email alert to Supabase |
| `/api/og` | Dynamic OG image (`?asset=gold\|bitcoin\|ethereum`) |
| `/api/cron` | Price-alert email dispatch (cron-triggered) |
| `/api/history` | Mock price history for charts |
| `/api/location` | IP → country detection |

---

## Cache Strategy

| Target | TTL |
|---|---|
| Home page ISR | 60 s |
| `/api/prices` | 300 s (s-maxage) |
| `/api/news` | 900 s |
| `/api/og` | 1 h |
| `getExchangeRates()` | 3600 s (Next fetch cache) |
| Crypto/metals via CoinGecko/GoldAPI | 60–300 s |
| Static assets | 1 year immutable |

---

## SEO Conventions

- Canonical URLs always use the **Arabic slug** (e.g. `https://sardhahab.com/سعر-البيتكوين`), even when the Next.js route is ASCII.
- `/_next/static/media/` is disallowed in `robots.txt` — prevents font files from burning crawl budget.
- `/gold/` is disallowed — only Arabic-slug country URLs are indexed.
- `app/sitemap.ts` uses percent-encoded Arabic paths. When adding pages, encode with `encodeURIComponent`.
- OG images are always served from `/api/og?asset=<name>` — **never** reference static image files in `/public/`.

---

## Design System Tokens

```
bg-background / bg-surface / bg-surface-2   — dark hierarchy
text-text-primary / text-text-secondary      — typography
text-gold / bg-gold (#C9A84C)               — brand
text-gold-light                              — hover
text-rise / bg-rise/10                       — green (up)
text-fall / bg-fall/10                       — red (down)
border-border
```

Font: Tajawal via `--font-tajawal` (Arabic + Latin, weights 300–900).

RTL layout: set `dir={lang === "ar" ? "rtl" : "ltr"}` on the outermost wrapper of every page/component, not on `<html>` (which is always `dir="rtl"` in root layout).

---

## i18n

- `useLang()` from `LanguageContext` → `{ lang, t, toggleLang }`
- `t` covers nav, home, footer, and common strings (see `lib/i18n.ts`)
- Page-specific strings: define a local `txt = { ar: {...}, en: {...} }` object and access via `txt[lang].key`
- New nav links must be added to **both** `navHrefs` in `Navigation.tsx` **and** both language objects in `lib/i18n.ts`

---

## Analytics

```typescript
import { track } from "@/lib/analytics";
// Pre-defined events: track.navClick(), track.logoClick(), track.quickLinkClick(), ...
// All calls are no-ops server-side; fire via window.gtag() client-side
```

Add new event types to `lib/analytics.ts` following existing patterns.

---

## AdSense Ad Slots

```tsx
import AdSlot from "@/components/AdSlot";
// Sizes: "leaderboard" (desktop), "mobile-banner" (mobile), "responsive", "rectangle"
// Always pair leaderboard + mobile-banner for full coverage:
<AdSlot size="leaderboard" slot="SLOT_ID" className="mb-6" />
<AdSlot size="mobile-banner" slot="SLOT_ID_2" className="mb-6" />
```

---

## Environment Variables

| Variable | Used in |
|---|---|
| `GOLDAPI_KEY` | `lib/goldapi.ts` |
| `EXCHANGE_RATE_API_KEY` | `lib/exchangerate.ts` |
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase.ts` |

---

## Responsiveness Rules

- Mobile-first: base styles first, then `sm:` `md:` `lg:` breakpoints
- Tables: always wrap in `overflow-x-auto` with `min-w-[360px]` on the `<table>`
- Grids with 3+ columns: never skip `sm:` (e.g. `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`)
- Flex rows: `flex-col sm:flex-row`

---

## Do NOT

- Change the AdSense publisher ID (`ca-pub-6286580154921898`) or GA ID (`G-2EFBVGR83R`)
- Use inline `style={{ height: "Xpx" }}` — use Tailwind `h-*` classes
- Export `metadata` from `"use client"` pages — use `layout.tsx`
- Create Arabic-path app directories for pages that need middleware rewriting — use ASCII routes
- Skip `sm:` breakpoints in grids with 3+ columns
- Reference static OG images — always use `/api/og?asset=…`
- Update mock fallback prices without checking current market levels
