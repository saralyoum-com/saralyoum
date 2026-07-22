# SARD Share Cards — Design & Build Spec

Hand-off spec for the share-card feature on sardhahab.com. Everything an
implementing agent needs to build (or rebuild) it correctly.

---

## 0. What this feature is

On the home page, under the hero, there is a **row of 5 tap-to-share cards** —
one per asset (🥇 gold, 🥈 silver, ₿ bitcoin, ⟠ ethereum) plus 💰 the user's
portfolio. Tapping a card fetches a branded **1080×1080 PNG** from an API route
and hands it to the phone's native share sheet (WhatsApp / Telegram), falling
back to a download on desktop.

There is also a **"since your last visit" bar** at the top of the page that
personalizes the visit (portfolio move, or gold move for non-owners).

### Files

| File | Role |
|---|---|
| `app/api/social-card/route.tsx` | The PNG renderer (Satori / `next/og` `ImageResponse`). Card types: `price`, `asset`, `portfolio` (also legacy `morning`/`coin`/`country`/`cta`/etc). |
| `components/ShareAssetRow.tsx` | The home-page 5-card share row (client). |
| `components/SinceLastVisit.tsx` | The "since last visit" bar (client). |
| `components/PortfolioTracker.tsx` | The محفظتي widget (buy-price → profit/loss card). |
| `public/share-coin.png` | SARD coin logo used in every card header (copied from `شعارر/1024x1024.png`). |

---

## 1. CRITICAL — Satori RTL / glyph rules (read first)

The cards are rendered by **Satori** (`next/og`), NOT a browser. Satori has **no
Unicode bidi algorithm** and only the embedded Tajawal font. These rules are the
whole difficulty of this feature — get them wrong and the Arabic looks scrambled:

1. **A single-word Arabic span is fine — leave it plain.** But a plain span
   with **2 or more Arabic words reorders those words** (see rule 7 — this
   supersedes an earlier, incorrect version of this rule that claimed plain
   multi-word spans were safe; they are not, verified by calibration render).
   Use `ArLine` (rule 7) for any 2+-word Arabic string.
2. **Never add `direction: "rtl"` to a text-holding span** — it injects large
   broken gaps between words on top of the reorder from rule 7 (double
   damage). `direction: "rtl"` is fine on a flex CONTAINER whose job is to
   order child *elements* (e.g. a row holding a label span + a chip) — it
   only breaks when applied directly to text.
3. **A number inside an Arabic run gets misplaced** (a date "22 يوليو" renders as
   "يوليو 22"), but a single Arabic word + a digit token is otherwise fine
   (`عيار 24` is correct as a plain span — verified). For dates specifically,
   or any string where you want digits pinned in place: split the string on
   spaces and render each token as its own `<span>` inside a
   `flexDirection: "row-reverse"` row (this is exactly what `ArLine` does —
   `SquareHeader`'s date uses the same technique inline).
4. **No `▲` / `▼`** — not in Tajawal, render as tofu (☐). Use `+` and `−`
   (U+2212). On-page HTML (the share row) can use ▲/▼ freely — that's the browser.
5. **No emoji inside Satori** — unreliable. Use text or the logo image. (Emoji in
   on-page HTML components is fine.)
6. **Never mix Latin + Arabic in one text node** (e.g. "SARD · سعر الذهب") — bidi
   there is unfixable. That's why the header is the **logo image**, not text.
7. **Any plain span with 2+ Arabic-script words reorders those words**,
   regardless of font size — this is NOT a "wide/hero-text-only" bug (that
   was an earlier, incorrect theory; disproven by isolated calibration
   renders at 26–30px). `سعر الأونصة الآن` (26px, fits on one line with room
   to spare) still renders as `الآن الأونصة سعر` — Satori's Yoga layout lays
   out same-direction (Arabic) tokens in naive left-to-right box order; it
   does not implement the Unicode bidi algorithm at the paragraph/line level.
   **A single Arabic word combined with a digit token is NOT affected**
   (`عيار 24` renders correctly, confirmed by pixel-crop inspection) — the
   bug is specifically 2-or-more same-direction tokens.
   **Fix:** use the `ArLine({ text, style })` helper (near `splitBalanced`) —
   it splits on whitespace and renders each token as its own `<span>` inside
   a `flexDirection: "row-reverse"` row (tokens left in natural, un-reversed
   order — same technique already used for the header's date). Apply it to
   **every** Arabic string with 2+ words: hero subtitles, stat-box labels,
   captions — not just large titles. The portfolio title (`محفظتي` /
   `الذهبية`) uses a different valid fix (two words on two separate stacked
   lines, one word per line, so there's nothing to reorder) — either
   approach works; `ArLine` is the general-purpose one.
   **Verification method that actually catches this:** render the string
   ALONE, then render two known, visually-distinguishable test words
   together (e.g. `واحد اثنان`) and crop-zoom the PNG to confirm which glyph
   shape sits on which side — do not eyeball a real string and assume it's
   right based on general impression. That mistake was made twice in this
   file's history before the bug was correctly isolated.

---

## 2. Global card style (all square cards)

- **Canvas:** 1080 × 1080 px. `background: #09090F`. `fontFamily: "Tajawal, sans-serif"`.
- **Fonts:** Tajawal Bold (700) + ExtraBold (900), loaded via `readFileSync` from
  `public/fonts/Tajawal-Bold.ttf` / `Tajawal-ExtraBold.ttf`.
- **Top accent bar:** full-width rect, height 7px, at y=0, linear-gradient L→R:
  `0% #8B6914 · 28% #F2D98A · 62% #C9A84C · 100% #8B6914`.

### Color tokens

| Token | Hex | Use |
|---|---|---|
| Gold (brand) | `#C9A84C` | brand, hero numbers, accents |
| Background | `#09090F` | canvas |
| Text primary | `#F5F5F5` | main values |
| Text muted | `#7a7a7a` | labels |
| Text faint | `#555` | footer secondary |
| Gold dim | `#8a6d1f` | small brand captions |
| Rise (green) | `#4ade80` | up / profit |
| Fall (red) | `#f87171` | down / loss |
| Green tint bg | `rgba(74,222,128,0.12)` | up pill fill |
| Red tint bg | `rgba(248,113,113,0.12)` | down pill fill |

### Shared header — `SquareHeader({ logo, dateStr })`

Column, centered, `paddingTop: 46`:
1. Logo `<img>` 140×140 (data-URI, see §5).
2. Date: `dateStr.split(/\s+/)` → each token a `<span>` (`#7a7a7a`, 26px) inside a
   `flexDirection: "row-reverse"`, `gap: 10`, `marginTop: 12` row. **(rule 1.3)**

### Shared footer — `SquareFooter({ tagline })`

Absolute bottom, full-width, height 72, `borderTop: 1px rgba(255,255,255,0.06)`,
centered row, `gap: 12`:
- `sardhahab.com` — gold `#C9A84C`, 26px, weight 700
- `·` — `#555`, 20px
- `{tagline}` — `#555`, 20px (plain span)

Taglines: price/asset = `أسعار لحظية للذهب والعملات`; portfolio = `تتبّع قيمة ذهبك لحظياً`.

---

## 3. Card layouts

### 3.1 `type=price` — gold, with karat breakdown

Body between header and footer is a `flexGrow:1`, vertically-centered column.

**Hero (centered column):**
- `سعر الأونصة الآن` — `#7a7a7a`, 26px.
- Row (`gap:18`, baseline): `${sym-or-$}${gold}` — `#F5F5F5`, 92px, weight 900 —
  then the **change pill**.
- `{curName} · للجرام` — `#8a6d1f`, 24px.

**Change pill:** `padding: 6px 20px`, `borderRadius: 30`, text 30px/700.
Up → fill `rgba(74,222,128,0.12)`, border `rgba(74,222,128,0.3)`, color `#4ade80`.
Down → red equivalents. Text = `${isUp?"+":"−"}${absChange}%`.

**Karat table:** container `margin: 48px 56px 0`, `border: 1px rgba(201,168,76,0.16)`,
`borderRadius: 22`, `overflow:hidden`. Three rows `[عيار 24, عيار 21, عيار 18]`,
each: `direction:"rtl"` (container — OK per rule 1.2), `padding: 34px 46px`, row 24
gets `background: rgba(201,168,76,0.06)`, rows 2–3 a `1px rgba(255,255,255,0.05)` top border.
- Left group (`gap:16`): label `#F5F5F5` 38px/700, then **chip**.
- Right group (baseline, `gap:10`): value 56px/900 (gold for row 24, else `#F5F5F5`),
  then `sym` `rgba(201,168,76,0.5)` 28px.
- **Chips:** 24 → bg gold / text `#0a0a0a`; 21 → bg `rgba(201,168,76,0.2)` / text gold;
  18 → bg `rgba(255,255,255,0.06)` / text `#9a9a9a`. All `4px 14px`, radius 8, 22px/800.

**Params:** `gold, change, dir, g24, g21, g18, sym, curName, date`.

### 3.2 `type=asset` — silver / bitcoin / ethereum (generic)

Body = centered column:
- `assetSub` (default `السعر الآن`) — `#7a7a7a`, 30px.
- `assetName` — gold, 68px, weight 900. (single word e.g. الفضة)
- `${sym}${price}` — `#F5F5F5`, 108px, weight 900.
- Change pill (as §3.1) but text = `${isUp?"+":"−"}${absChange}% · اليوم`.

**Params:** `assetName, assetSub, price, sym, change, dir, date`.
Client formats `price`: crypto → integer, silver → 2 decimals. `sym` = `$` (USD).

### 3.3 `type=portfolio` — holdings summary

Body = centered column, `padding: 0 56px 40px`:
- `محفظتي الذهبية` — `#F5F5F5`, 62px, weight 900; then `count` (e.g. `1 قطعة`) `#7a7a7a` 30px.
- `إجمالي القيمة` — `#7a7a7a` 30px; then `${sym} ${pv}` — gold, 104px, weight 900.
- Row of **2 stat boxes** (`gap:24`, `marginTop:48`):
  - Box: `bg rgba(255,255,255,0.03)`, `border 1px rgba(201,168,76,0.14)`,
    `borderRadius 20`, `padding 28px 34px`, `alignItems: flex-end`, `flexGrow:1`.
    Label `#7a7a7a` 26px; value 54px/900 (green/red); sub-pct 28px/700 (green/red).
  - Box 1 = `تغيير اليوم` → `${dUp?"+":"−"}${sym} ${daily}` + `${dailyPct}%`.
  - Box 2 = `الربح / الخسارة` (**only if `pnl` present**) → `${sym} ${pnl}` + `${pnlPct}%`.

**Params:** `pv, sym, count, daily, dailyPct, dailyDir, pnl?, pnlPct?, pnlDir?, date`.

---

## 4. On-page components

### 4.1 `ShareAssetRow` (home page, replaces old `SharePriceButton`)

- Props: `gold, silver, bitcoin, ethereum` — each `{ price, changePercent }`.
- Heading: `📤 شارك السعر كبطاقة جاهزة — اختر الأصل`.
- `grid grid-cols-5 gap-2 sm:gap-3`. Each card: icon → label → `▲/▼ x.x%`.
  Icons: 🥇 الذهب · 🥈 الفضة · ₿ بيتكوين · ⟠ إيثيريوم · 💰 محفظتي.
- **Portfolio card is "featured":** `bg-gold/[0.06] border-gold/40`. Others:
  `bg-surface border-border hover:border-gold/40`.
- **Portfolio empty state** (no saved holdings): card becomes an `<a href="#portfolio">`
  showing `أضف ذهبك` instead of a %.
- State per card: idle icon → `⏳` while fetching → `✅` for 2s after share.
- **Gold** builds `type=price` (needs local per-gram karat prices — uses `useLocation()`
  for currency/rate). **Silver/BTC/ETH** build `type=asset` (USD, `$`). **Portfolio**
  reads `localStorage["gold_portfolio"]`, computes value/daily/P&L, builds `type=portfolio`.
- Share handler: `fetch(url)` → blob → `File` → `navigator.share({files})` if
  `navigator.canShare`, else anchor download. Analytics: `track.quickLinkClick("share-"+key)`.

### 4.2 `SinceLastVisit` bar

- Backend-free. `localStorage["sard_last_visit_gold"] = { price, ts }`. Only shows if
  the stored visit is ≥ 3 hours old (`MIN_HOURS`), then records the new visit.
- Full-width bar, `rounded-2xl`, gradient tint `from-rise/[0.08]` (or fall) `to-transparent`,
  matching border.
- Left: icon `📈`/`📉` in a tinted square + `منذ زيارتك الأخيرة` + one line.
- Right: big amount + pct.
- **If the user owns gold** (reads `gold_portfolio`): compute the portfolio's value
  change between the last-visit gold price and now → show `محفظتك ارتفعت/انخفضت · الذهب ▲ x%`
  and the currency amount + `% على قيمتك`.
- **If not:** show `الذهب ▲ x%` + a subtle `أضف ذهبك لتخصيص هذا` link to `#portfolio`.

### 4.3 `PortfolioTracker` buy-price nudge

The rich purchase-vs-current + P&L holding card already exists; it only renders when a
holding has a buy price. The add-form's "buy price" field is emphasized (gold-tinted
border, hint `أدخله لتظهر أرباحك تلقائياً`) so users fill it and get that card by default.

> Note: `PortfolioTracker` also has its own 📤 export that draws the portfolio image on a
> **`<canvas>`** (not this API route) — so it still has the old text header, no logo. If you
> want it identical to the row's 💰 card, switch it to fetch `type=portfolio` instead.

---

## 5. Logo asset

- Header logo is the **SARD gold coin** at `public/share-coin.png` (copied from
  `شعارر/1024x1024.png`). It already has "SARD" + "سعر الذهب" engraved, transparent bg —
  which is exactly why the header carries no text.
- Embedded into the ImageResponse as a **base64 data URI** via a cached `loadLogo()`
  (`readFileSync` + `toString("base64")`). Do **not** reference it by URL — keep the
  renderer network-free. Must live under `public/` so Vercel's output tracing bundles it.

---

## 6. Verify like this (Arabic folder blocks the preview tool)

`npm run dev`, then `curl` the route and **open the PNG** to eyeball the Arabic — do not
trust the code alone. Example:

```
curl -s -o card.png "http://localhost:3000/api/social-card?type=asset&assetName=%D8%A7%D9%84%D9%81%D8%B6%D8%A9&assetSub=%D8%B3%D8%B9%D8%B1%20%D8%A7%D9%84%D8%A3%D9%88%D9%86%D8%B5%D8%A9%20%D8%A7%D9%84%D8%A2%D9%86&price=76.48&sym=%24&change=0.90&dir=up&date=%D8%A7%D9%84%D8%A3%D8%B1%D8%A8%D8%B9%D8%A7%D8%A1%D8%8C%2022%20%D9%8A%D9%88%D9%84%D9%8A%D9%88%202026"
```

Always validate with `npm run build` before deploying. No test runner is configured.

Arabic spelling rule for this project: **no tanwin** (ً ٍ ٌ).
