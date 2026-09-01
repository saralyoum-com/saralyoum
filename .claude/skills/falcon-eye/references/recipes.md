# Prompt recipes

Ready subject sentences for the content SARD actually publishes. Each one is the
*subject half* of the prompt — append the style block from `SKILL.md` before
generating, and add the no-text clause. Vary a recipe by swapping the concrete
noun (the metal, the coin, the surface), not by rewriting the lighting.

A recipe is a starting point, not a cage. If the brief is genuinely new, build
the subject sentence the same way these are built: one physical subject, one
light direction, one surface, one stated empty region.

---

## Slot: `morning` — the daily price post

The number itself comes from `/api/social-card`. What the AI supplies is the
backdrop or the reel opener that carries it.

**Still backdrop (4:5 or 1:1)**
> A single polished one-kilogram gold bullion bar resting on brushed charcoal
> stone, angled away from camera into the lower right third, edge catching the
> key light. The entire left half of the frame falls into clean empty black with
> only a faint gradient — deliberate negative space.

**Reel opener (9:16, 5s)**
> Extreme macro of gold grain and small cast nuggets settling on a dark stone
> surface, one warm light source, dust motes drifting through the beam. Camera
> pushes in slowly. Centre of frame stays uncluttered.

**Weekly variation.** `lib/social.ts` rotates country groups by weekday — Gulf,
North Africa, Levant, Maghreb. When the post is country-flavoured, let the
*surface* carry it rather than adding flags: pale desert stone for the Gulf,
warm terracotta and zellij-like geometry for the Maghreb, dark walnut for the
Levant. Keep the metal and the light identical so the set still reads as one
account.

---

## Slot: `educational` — explainer and financial-literacy posts

Azure `#229ED9` is allowed as an accent here, matching the card design. These
posts carry the most text afterwards, so reserve more room than feels necessary.

**Concept backdrop (4:5)**
> A brass two-pan balance scale in three-quarter view on matte black, one pan
> holding a small stack of gold coins, the other empty and lifted. Lit from upper
> left, long soft shadow to the right. Upper third of the frame left as clean
> black.

**Carousel background set (1:1, generate as a set of 3–4 variants)**
> A near-empty black field with a single gold element entering from one edge —
> a bar corner, a coin rim, a thin rule of gold light — placed differently in
> each frame. Minimal, editorial, generous emptiness at centre.

Ask for variants with `count: 2–4` on one call rather than several separate
calls; that is what `count` is for and it keeps the set visually consistent.

**Karat / purity explainer**
> Three gold bars of visibly different warmth and tone — deep saturated, mid
> warm, pale — standing upright in a row on dark stone, evenly lit, shallow depth
> of field falling off toward the back. Ample black above.

---

## Slot: `engagement` — polls, questions, prediction posts

`GoldPredictionPoll.tsx` and the poll-result cron drive these. The visual should
pose tension, not answer it.

**Poll / prediction (4:5)**
> A single gold coin balanced upright on its edge on a dark reflective surface,
> caught mid-stillness, one warm light from the left throwing a long reflection
> toward camera. Everything else black.

The upright coin is the house motif for "undecided" — reuse it deliberately so
followers learn to recognise a poll before reading a word.

**Result reveal (4:5)**
> The same coin, now fallen flat and settled on the dark surface, reflection
> tightened, light unchanged.

Direction accents (`#22c55e` rise, `#ef4444` fall) may tint the *falloff* or a
faint rim, never the metal itself.

---

## Crypto — bitcoin, ethereum

The house rule is physical metal, not sci-fi. SARD treats crypto as an asset
class beside gold, and the imagery should say that.

**Bitcoin (4:5 or 9:16)**
> A single minted physical coin bearing an abstract geometric relief, struck in
> warm gold, resting at an angle against a dark stone block. Macro, edge-lit,
> heavy depth of field falloff. No symbols or characters on the coin face —
> abstract relief only.

**Ethereum**
> Same, in cool polished silver with a faceted angular relief catching a narrow
> highlight.

Note the "abstract relief only" clause. Asking for the actual ₿ or Ξ glyph
invites the model to render text, which is where the frame falls apart. If a real
symbol is needed, composite it later as a vector.

---

## Zakat and Ramadan

Seasonal and the most culturally sensitive set — `app/api/cron/nisab` and
`reminder-zakat` drive the calendar. Restraint reads as respect here; skip the
lanterns-and-glitter cliché.

**Nisab / zakat (4:5)**
> A brass balance scale in even symmetry on deep black, both pans carrying a
> small equal measure of gold coins, lit softly and frontally, calm and still.
> Wide clean margins on all sides.

**Ramadan seasonal (9:16)**
> Deep black field with warm gold light falling through a fine geometric mashrabiya
> screen from the left, casting an interlocking pattern across dark stone. A small
> stack of gold coins sits at the lower right, mostly in shadow. Serene, restrained,
> no crescents, no lanterns, no glitter.

---

## Country spotlight

Sixteen country pages exist under `app/gold/[code]`. Do **not** ask the model for
flags or maps — it renders both wrong, and wrong flags are the kind of mistake
that gets screenshotted. Carry the country in the architecture and surface
instead, and let the composited Arabic name do the naming.

> Gold bars stacked on a pale limestone ledge, warm low sunlight raking across a
> softly blurred modern skyline of pale towers in the far background, heavily
> defocused. Foreground metal sharp, background reduced to tone and shape.

Swap the background register per region — pale towers for the Gulf, dense
sand-coloured old city for North Africa, mountain haze for the Levant — always
defocused far enough that no landmark is identifiable.

---

## Covers, banners, channel art

**X / YouTube banner (16:9)**
> A wide field of matte black with a low horizon of gold grain along the bottom
> edge, one warm light grazing from the right, the upper two thirds empty and
> unbroken.

**Profile / avatar backdrop (1:1)**
> Tight macro of a polished gold surface with faint mill lines and a single soft
> specular sweep across the diagonal. Abstract, no object, no depth cues.

Banners are the one place where emptiness is the whole design — the logo and
handle go on top, and `public/logo.png` already exists for that.
