# Code-rendered post templates

Brand-exact social posts authored as HTML and screenshotted to PNG. No AI model,
no API credits, and — the part that matters most for this account — **Arabic that
renders correctly**, because a real browser has a bidi algorithm and shaping
engine where image models and Satori do not.

This is the path to reach for whenever a post is type and numbers rather than
atmosphere. Use `references/recipes.md` and a generator only when the post needs
a photographic or cinematic frame.

## What's here

| File | Purpose |
|---|---|
| `morning-post.template.html` | The daily gold-price post, 1080×1080 |
| `build.py` | Inlines the fonts and logo into a template |
| `shoot.py` | Screenshots a built template at its exact canvas size |
| `subset.py` | Rebuilds the subset fonts (only needed if new glyphs appear) |
| `fonts/*.woff2` | Tajawal Bold + ExtraBold, subset to the glyphs in use |

## Producing a post

```bash
cd .claude/skills/falcon-eye/templates
python3 build.py morning-post.template.html /tmp/post.html
python3 shoot.py /tmp/post.html /tmp/post.png
```

Edit the numbers, date and country rows directly in the template's markup — they
are plain text nodes, deliberately not wired to an API, so a post can be produced
without the site running.

## Why the templates carry placeholders

The committed template holds `__FONT_BOLD__`, `__FONT_XBOLD__` and `__LOGO__`
rather than the base64 itself. Fully inlined it is 60KB of unreadable payload;
with placeholders it stays a diffable 8KB, and `build.py` fills them in a second.

The fonts are subset to only the glyphs the design uses — 116KB of TTF becomes
14KB of woff2. If you add copy that introduces new characters, re-run
`subset.py`, which reads the template and keeps exactly what it finds.

## Rules learned the hard way

**Never position text by pixel coordinates when Arabic is involved.** Country and
currency names vary in width, and a pixel-placed column collides with its
neighbour the moment a longer name appears. Lay rows out with flex and let the
text size itself.

**Wrap anything mixing Latin, digits and symbols in `direction:ltr`.** In an RTL
root, bidi-neutral characters migrate to the visual end of the run: `@sardhahab`
renders as `sardhahab@`, and a `+` before a percentage lands after it. The chips,
the price, the handle and the domain all carry an explicit `direction:ltr` for
this reason. Where a string mixes scripts and order matters, split it into
explicit spans in a flex container rather than trusting the algorithm to guess.

**Prefer arrows and colour over `+`/`−` signs** for market direction. They carry
the same meaning, cannot be reordered by bidi, and read better at a glance.

## On Adobe Express

The template is authored to Adobe's HTML-import contract — intent-based root
class, `hz:slide-selector`, fixed dimensions with matching `data-canvas-*`, no
animation, self-contained assets — so it is ready to import as an editable
document whenever that becomes available.

It is not available on this account today: `export_html_to_express`,
`find_fonts` and `get_fontkit_embed_url` all return an entitlement error even
though the session is a full (non-guest) Adobe account. Enabling it is documented
at <https://developer.adobe.com/adobe-for-creativity/>.

Two consequences worth knowing when that changes:

- Fonts stay embedded as base64 `@font-face` rather than migrating to Adobe
  Fonts, since the font services are gated by the same entitlement. Tajawal is
  the site's own font file, so this is the more faithful option regardless.
- Build the Express variant with a **solid** gold price, not the gradient. The
  gradient uses `background-clip:text` with `color:transparent`; if Adobe's
  static renderer drops that property the headline number renders invisible.
  A slightly less rich fill cannot fail that way.
