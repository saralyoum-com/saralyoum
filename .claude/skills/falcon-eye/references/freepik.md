# Freepik / Magnific — the stills path

Freepik rebranded to **Magnific** in April 2026. Both hosts are live and take the
same account; only the header name differs. An existing Freepik API key carried
over, so a key issued before the rebrand still works against `api.freepik.com`.

| | Freepik | Magnific |
|---|---|---|
| Base URL | `https://api.freepik.com` | `https://api.magnific.com` |
| Auth header | `x-freepik-api-key` | `x-magnific-api-key` |
| Env var here | `FREEPIK_API_KEY` | `MAGNIFIC_API_KEY` |

Set whichever you have; the bundled script prefers `FREEPIK_API_KEY` and falls
back to `MAGNIFIC_API_KEY`, picking the matching host and header automatically.
Get or check a key at <https://www.magnific.com/api>.

---

## Credits — read before quoting a cost

The API draws on the **same credit wallet as the Freepik/Magnific subscription**
rather than a separate top-up. An existing paid plan may already cover this work
at no extra spend, which is what makes Freepik the cheaper default for stills
here. Premium has carried 240,000 credits a year, and an image costs roughly
50–400 credits depending on model and resolution — order-of-magnitude a few
thousand images a year, not a handful.

Those numbers move. Check the live plan before promising a volume, and never
quote a per-image cost from this file as if it were current.

Resolution is the main lever you control: `1k` for anything that will sit behind
composited type, `2k` for a hero, `4k` only when it will be printed or heavily
cropped. Going to 4k by reflex is the easiest way to burn a wallet.

---

## The API shape

Generation is asynchronous. Submit, get a `task_id`, then poll.

```
POST {base}/v1/ai/mystic
  headers: {auth header}, Content-Type: application/json
  body:    { "prompt", "aspect_ratio", "resolution", "model" }
  → { "data": { "task_id": "..." } }

GET  {base}/v1/ai/mystic/{task_id}
  → { "data": { "status": "COMPLETED" | "FAILED" | ..., "generated": ["https://..."] } }
```

Useful body fields beyond the basics: `webhook_url` replaces polling entirely,
and `structure_reference` / `style_reference` take base64 image data — the latter
is worth trying once a frame you love exists, as a second lever on consistency
alongside the style block.

**Aspect ratios are named, not numeric.** Confirmed values: `square_1_1`,
`classic_4_3`, `traditional_3_4`, `widescreen_16_9`, `social_story_9_16`. The
script maps `1:1`, `4:3`, `3:4`, `16:9`, `9:16` onto those and passes anything
else through untouched. Instagram's `4:5` is not a confirmed enum value, so the
script sends `traditional_3_4` — the nearest tall ratio that definitely exists,
which crops to 4:5 cleanly. If the API rejects a ratio it returns the full list
of valid values in the error body; the script prints that body whole, so trust
it over this file.

---

## Using the bundled script

`scripts/freepik_generate.py` is stdlib-only — no pip install, no MCP server, no
node. It exists mainly so the brand style block is appended mechanically instead
of being retyped, because a paraphrased style block is how an account's look
quietly splits in two.

```bash
export FREEPIK_API_KEY=fpsk_...

# see the resolved prompt and payload, spend nothing
python3 .claude/skills/falcon-eye/scripts/freepik_generate.py \
  --prompt "A brass two-pan balance scale in three-quarter view on matte black, one pan holding gold coins" \
  --ratio 4:5 --dry-run

# generate and save
python3 .claude/skills/falcon-eye/scripts/freepik_generate.py \
  --prompt "A brass two-pan balance scale in three-quarter view on matte black, one pan holding gold coins" \
  --ratio 4:5 --resolution 2k --out public/social/zakat-scale.png
```

Pass **only the subject sentence** to `--prompt`. The style block, the palette
and the no-text clause are appended for you. `--no-style` sends the prompt bare,
which is right when reproducing an external reference and wrong for anything
going on the account.

Always `--dry-run` first on a new prompt. It costs nothing and catches the
mistakes worth catching — a subject sentence that fights the style block, or a
ratio that resolved to something you did not intend.

---

## The Arabic rule applies here too

Mystic is a strong photoreal model and it still cannot write Arabic. Nothing
about switching providers changes the rule from `SKILL.md`: AI frames come out
text-free with negative space reserved, and Arabic wording is composited
afterwards through `/api/social-card`. Do not put an Arabic string in a Freepik
prompt any more than in a Higgsfield one.

---

## Handing a Freepik still to Higgsfield for motion

This is the pattern worth reaching for: Freepik makes the better still, Higgsfield
makes the better move. Generate the hero frame first, judge it honestly, and
animate only a frame you already like — animating a mediocre still just buys a
mediocre video at video prices.

The script saves a local copy deliberately, so the handoff never depends on how
long the provider keeps its result URL alive:

1. Generate with `--out public/social/hero.png`.
2. `media_upload` that local file to Higgsfield → returns a `media_id`.
   (If you still hold the remote URL, `media_import_url` works too.)
3. Pass it as the start frame:

```json
{
  "model": "kling3_0",
  "prompt": "Slow deliberate push-in, locked camera, no shake. Pacing calm and premium.",
  "aspect_ratio": "9:16",
  "duration": 5,
  "sound": "off",
  "medias": [{ "role": "start_image", "value": "<media_id>" }]
}
```

Remember that `medias[].value` never takes a raw https URL — always a `media_id`
or a `job_id`. That is the single most common failure in this handoff.

---

## The stock library

Beyond generation, the API exposes Freepik's stock photos, vectors and icons.
For SARD this is most useful for compositing pieces rather than whole frames —
a clean vector coin, an arrow set, a flag icon that is actually correct instead
of an AI's guess at one. That last point matters: the recipes deliberately avoid
asking a model for flags, and the icon library is the right way to get one when a
post genuinely needs it.

An official Freepik MCP server also exists, exposing search, download and Mystic
generation as tools. It is a reasonable alternative to this script if someone
prefers tool calls to a subprocess, but it needs a node install and the same API
key, and it does not append the style block — so the consistency guarantee would
move back into whoever is writing the prompt.
