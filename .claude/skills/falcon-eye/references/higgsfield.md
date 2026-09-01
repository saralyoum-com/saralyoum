# Higgsfield mechanics

Everything here is about *how* to call the generator. The creative direction
lives in `SKILL.md` and `references/recipes.md`.

Model IDs move. If a call fails on an unknown model, or the brief is unusual,
run `models_explore` with `action: "recommend"` and a goal sentence rather than
guessing an ID — the roster below is a snapshot, not the source of truth.

---

## Account state — read this first

The connected Higgsfield account has been on the **free plan with 0 credits**.
Generation will fail or refuse until that changes, so check `balance` before
promising output, and tell the user plainly if the balance is the blocker rather
than letting a call fail cryptically. `show_plans_and_credits` shows the options.

Three models accept free-trial **unlim** generations when an allowance exists:
`nano_banana`, `kling3_0`, `seedance_2_0`. That matters when credits are short —
but spending someone's unlimited allowance is still spending something of theirs.
Leave `use_unlim` unset and let the server return its `unlim_choice` question,
then put that question to the user. Never pass `use_unlim: true` on your own
initiative, even to be helpful about credits.

---

## Image models

| Model | Use it for | Notes |
|---|---|---|
| `nano_banana` | the everyday workhorse — photographic bullion, coins, backdrops | budget, realistic, accepts refs, **unlim-capable** |
| `nano_banana_pro` | 4K output, or a frame that genuinely needs legible Latin text | more expensive; still not trustworthy for Arabic |
| `recraft_v4_1` | graphic, iconographic, vector or flat brand assets | takes the palette as real parameters — see below |
| `marketing_studio_image` | ad-shaped product compositions | commercial framing, less control over mood |
| `flux_2_pro_outpaint` | widening an existing frame to a new ratio | negative values crop instead; an all-crop request is free |

`recraft_v4_1` is the one place the brand palette stops being a suggestion:

```json
{
  "model": "recraft_v4_1",
  "prompt": "<subject sentence + style block>",
  "aspect_ratio": "4:5",
  "colors": ["#C9A84C", "#E5C96A", "#A8872E", "#1A1A1A"],
  "background_color": "#0D0D0D",
  "model_type": "standard"
}
```

Use `model_type: "vector"` for icon and logo-adjacent work, `"utility"` for flat
predictable product mockups.

## Video models

| Model | Use it for | Notes |
|---|---|---|
| `kling3_0` | the default for SARD motion | 3–15s, `9:16`/`16:9`/`1:1`, start+end frame, `sound: "off"` costs less, **unlim-capable** |
| `seedance_2_5` | longer or reference-heavy clips | 4–30s, omni-reference mode, native audio |
| `seedance_2_0` | reference-driven identity consistency, 4K | start/end frame, **unlim-capable** |
| `marketing_studio_video` | full TikTok/Reels ad formats | 12–15s, preset-driven, heavier |

For SARD's calm push-ins, `kling3_0` at 5s with `sound: "off"` is usually right:
the account's clips get captioned and scored later, so paying for generated audio
is waste.

---

## The mechanic that trips people up

`medias[].value` takes a **media_id or a job_id — never an https URL.**

- Web image → `media_import_url` → use the returned `media_id`
- Local file → `media_upload`
- A previous generation → use its `job_id` directly

That last one is how a still becomes motion, and it is the main production
pattern here. Generate the hero image first, judge it, and only animate the frame
you already like — animating a mediocre still just buys a mediocre video:

```json
{
  "model": "kling3_0",
  "prompt": "Slow deliberate push-in, locked camera, no shake. <style block camera line>",
  "aspect_ratio": "9:16",
  "duration": 5,
  "sound": "off",
  "medias": [{ "role": "start_image", "value": "<job_id of the approved still>" }]
}
```

An end frame as well as a start frame gives a controlled move rather than a
drift — worth it when the clip has to land on a specific composition for the
composited price to sit in.

---

## Batching

For 2–12 *different* prompts, use `generate_image_batch` / `generate_video_batch`,
then `jobs_wait`, then a single `show_generation_by_ids`. For 2–4 variants of the
*same* prompt, stay on the single tool and pass `count`. Getting this backwards
either floods the conversation with widgets or collapses a varied set into
near-duplicates.

A week of content is a batch. Generating Sunday's post on Sunday is how the look
drifts.

---

## Finishing tools

Prefer these over regenerating — they are cheaper and preserve the frame that was
already approved:

- `upscale_image` / `upscale_video` — 2K/4K delivery
- `reframe` — re-crop to another aspect ratio, e.g. one hero still into 4:5, 9:16
  and 16:9 for three platforms
- `outpaint_image` — extend beyond the original borders
- `remove_background` — cutouts for compositing over the site's own dark ground

`reframe` deserves special mention: one strong generation reframed three ways is
both cheaper and more consistent than three generations, and consistency is the
entire objective of this skill.

---

## Checking output

`show_generations` lists recent work; `show_generation_by_ids` fetches specific
jobs. Look at what came back before reporting success — the failure modes worth
catching are stray pseudo-text, palette drift toward orange or brass, and clutter
filling the negative space the composited Arabic was supposed to occupy.
