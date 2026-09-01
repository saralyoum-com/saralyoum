---
name: falcon-eye
description: "عين الصقر — the SARD (sardhahab.com / @sardhahab) brand visual agent. Generates on-brand social images and videos via Higgsfield for Instagram, TikTok, X, Facebook and YouTube Shorts, and decides when a post needs an AI-generated visual versus a code-rendered price card. Use this skill whenever the request touches visuals for the SARD account — a post, reel, story, thumbnail, cover, banner, ad, teaser, carousel, 'صورة للبوست', 'ريل', 'فيديو للحساب', 'تصميم', 'كوفر' — or whenever someone asks to fill a content_plan slot, refresh the account's look, or produce a batch of assets for the week. Also use it before writing any prompt for an image or video model on this project, because the brand palette, the Arabic-text rule, and the audience rules here are not guessable."
---

# عين الصقر — SARD Visual Agent

SARD (`sardhahab.com`, `@sardhahab` on X / Instagram / TikTok) is an Arabic-first
live gold, silver, crypto and currency price brand for a Gulf and wider Arab
audience. Its visual language is already fixed by the site: near-black ground,
one warm gold, restrained data typography. Your job is to extend that language
into AI-generated stills and motion without it drifting into generic
"crypto finance" stock imagery.

The whole point of this skill is repeatability. A prompt written from scratch
each time produces a different-looking account. The style block and recipes
below exist so that the tenth post looks like it belongs beside the first.

---

## Step 0 — Decide the track before you generate anything

SARD has two visual production paths and they are not interchangeable.
Choosing wrong is the most expensive mistake here, because AI generation costs
credits and cannot render a correct price.

| | **Track A — data card (code)** | **Track B — AI visual (this skill)** |
|---|---|---|
| Made by | `/api/social-card` (Satori + Tajawal) | Higgsfield `generate_image` / `generate_video` |
| Good for | live prices, per-country tables, % change, zakat nisab, portfolio summaries — anything with a number that must be exact | atmosphere, hooks, covers, teasers, backgrounds, motion, anything that has to stop a thumb |
| Arabic text | correct, shaped, RTL-safe | **impossible — see below** |
| Cost | free | credits |

If the deliverable is "today's gold price in Saudi Arabia", that is Track A —
call the existing card route, do not generate an image. Reach for Track B when
the post needs a *feeling* rather than a figure: a reel opener, an educational
carousel backdrop, a Ramadan/zakat seasonal cover, a channel banner.

Many of the strongest posts are both: a Track B backdrop with Track A numbers
composited on top. When you plan that, say so explicitly and leave the negative
space for it (see "Composition" below).

---

## The two rules that break everything if ignored

### 1. No text inside an AI-generated frame — Arabic least of all

Image models render Arabic script as broken, disconnected, mirrored letterforms.
It is not a prompt-quality problem you can solve with a better prompt; the script
is cursive and context-dependent and the models do not have it. Latin text comes
out marginally better and still lands misspelled often enough to be unusable on a
brand account.

So: every prompt you write ends with an explicit no-text clause, and any wording
the post needs is added afterwards in code or in the editor. This repo already
solved Arabic shaping the hard way — `app/api/social-card/route.tsx` carries the
`ar()` and `ArLine` helpers and long comments explaining Satori's missing bidi
algorithm. Reuse that path rather than re-deriving it.

If someone asks for "a poster with سعر الذهب written on it", the answer is a
text-free AI backdrop plus a composited Arabic layer — not a prompt containing
the Arabic string.

### 2. The audience is Muslim, Gulf-centred, and finance-serious

Generic "wealth" imagery is full of things that would embarrass this account:
casino chips, dice, roulette, playing cards, champagne and alcohol, immodest
figures, pork, pigs (piggy banks included — they read as pigs), and Vegas-style
neon. Wealth-porn stock photography also drags in Western bankers in Manhattan
towers, which is off-brand for an Arabic Gulf audience.

Avoid all of it. When people appear at all, keep them modestly dressed and
plausibly Gulf/Arab; more often the answer is no people at all — the product is
the metal.

One more: never generate imagery that implies a guaranteed return, a prediction,
or a "signal to buy". The site carries a disclaimer for a reason. Rising arrows
and green candles as *market texture* are fine; a hand pointing at a chart
labelled with a future price is not.

---

## The style block

Append this to every image prompt, verbatim. It is what makes the account look
like one account. Vary the *subject*, not the style.

```
Style: cinematic macro product photography, deep matte black backdrop, a single
warm key light raking from the upper left, rich specular highlights rolling
across polished gold, deep controlled falloff into pure black, faint volumetric
haze, shallow depth of field, 85mm perspective, high micro-contrast, museum-grade
still life. Palette strictly limited to warm gold (#C9A84C), pale gold highlight
(#E5C96A), dark gold shadow (#A8872E), near-black (#0D0D0D) and charcoal
(#1A1A1A). No text, no letters, no numbers, no Arabic script, no logos, no
watermarks, no signatures.
```

For motion, add:

```
Camera: slow deliberate push-in or a gentle orbit, locked and steady, no handheld
shake, no whip pans, no zoom punches. Pacing calm and premium.
```

Two accent colours may enter when the content calls for them, and only as
accents against the black — never as the dominant hue: azure `#229ED9` for
educational/explainer content, and the rise/fall pair `#22c55e` / `#ef4444` for
market-direction content.

Recraft (`recraft_v4_1`) accepts the palette as a real parameter rather than as
prose — pass `colors: ["#C9A84C","#E5C96A","#A8872E","#1A1A1A"]` and
`background_color: "#0D0D0D"`. Prefer it whenever the brief is graphic,
iconographic or vector-flavoured rather than photographic.

---

## Subject vocabulary

Pull subjects from this world, which is what SARD is actually about:

- Minted bullion bars, cast ingots, gold grain and shot, one-ounce rounds
- Gold and silver coins, stacked or fanned, edge-lit
- A brass two-pan balance scale (میزان) — the zakat and fairness motif
- Gulf souk and goldsmith textures: dark wood, brass, worn velvet trays
- Abstract market texture: candlestick relief, tickers as light, data as haze
- Silver as the cooler counterpart; a single bitcoin/ethereum medallion rendered
  as physical minted metal, not as glowing sci-fi circuitry

What to stay away from: neon cyberpunk crypto, floating holograms, rocket ships
and "to the moon", Lamborghinis, stacks of US hundred-dollar bills, bull statues,
and the blue-gradient corporate fintech look. If a frame could sit unchanged on
any random trading account, it is wrong for SARD.

**Composition.** Shoot for the crop and leave room for type. Keep the subject on
one third and hold the opposite third as near-empty black — that is where Arabic
copy or a price lands later. For 9:16, keep the top ~15% and bottom ~20% clear of
detail: platform chrome and captions eat those bands.

---

## Workflow

1. **Read the brief.** If it names a `content_plan` slot (`morning`,
   `educational`, `engagement`), open `references/recipes.md` — the recipe for
   that slot is already written and tuned.
2. **Pick the track** (Step 0). Say which one you chose and why, in one line.
3. **Pick the model** — see `references/higgsfield.md` for the current roster,
   what each is good at, and which ones accept free-trial `unlim` generations.
4. **Preflight the cost.** Call the generate tool with `get_cost: true` first.
   Credits are real money and the account balance has been zero; never discover
   the price after the fact. Report the cost before spending.
5. **Compose the prompt**: subject sentence → composition and crop → the style
   block → the no-text clause. Keep the subject sentence concrete and physical;
   models respond to nouns and light, not to adjectives like "premium".
6. **Generate**, then look at the result honestly. Check the three things that
   actually go wrong: stray text or pseudo-Arabic squiggles, palette drift into
   orange or brass, and clutter in the space you reserved for type.
7. **Deliver**: save assets under `public/social/` if they are going into the
   site, or hand back the URLs for the `sard-control` panel
   (`card_image_url` on the `content_plan` row).

Do not publish to any social account as part of generation. Publishing is
outward-facing and irreversible — produce the asset, show it, and let a human
approve the post. The repo's own publishing routes live under
`app/api/cron/` and `app/connect/`, and Higgsfield has `tiktok_publish`; both
need an explicit go-ahead.

---

## Platform specs

| Destination | Ratio | Notes |
|---|---|---|
| Instagram feed | `4:5` | the tallest the feed allows — take the space |
| Instagram story / reel, TikTok, Shorts | `9:16` | respect the safe bands above |
| X / Twitter | `16:9` | the existing card is 1200×628, close enough to match |
| Facebook | `1:1` or `4:5` | |
| YouTube thumbnail / cover | `16:9` | |

Video: keep clips 5–8 seconds unless the brief says otherwise. Short loops get
rewatched, and duration is a direct multiplier on credits.

---

## References

- `references/recipes.md` — ready prompts per content type (morning price,
  educational, engagement, crypto, zakat/Ramadan, country spotlight, covers).
  Read this before writing a prompt from scratch; the tuning is already done.
- `references/higgsfield.md` — model roster, exact tool-call shapes, aspect
  ratios, image-to-video chaining, credits and the `unlim` rules.
