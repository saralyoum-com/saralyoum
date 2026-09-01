#!/usr/bin/env python3
"""
Generate an on-brand SARD still through the Freepik / Magnific Mystic API.

The point of this script is that the brand style block gets appended for you.
Consistency across posts is the whole objective of the falcon-eye skill, and a
style block that has to be remembered and pasted by hand is one that eventually
gets forgotten or paraphrased.

Stdlib only — no pip install, no MCP server, no node. Works anywhere python3 does.

Usage
-----
    export FREEPIK_API_KEY=fpsk_...

    # see the exact prompt and payload without spending credits
    python3 freepik_generate.py --prompt "A single polished gold bar on dark stone" \
        --ratio 4:5 --dry-run

    # generate and save
    python3 freepik_generate.py --prompt "A single polished gold bar on dark stone" \
        --ratio 4:5 --resolution 2k --out public/social/gold-bar.png

Freepik rebranded to Magnific in April 2026. Both hosts work and the script
picks whichever key it finds: FREEPIK_API_KEY (api.freepik.com) or
MAGNIFIC_API_KEY (api.magnific.com).
"""

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request

# Kept byte-identical to the style block in SKILL.md. If you change one, change
# both — a drifting style block silently splits the account's look in two.
STYLE_BLOCK = (
    "Style: cinematic macro product photography, deep matte black backdrop, a single "
    "warm key light raking from the upper left, rich specular highlights rolling "
    "across polished gold, deep controlled falloff into pure black, faint volumetric "
    "haze, shallow depth of field, 85mm perspective, high micro-contrast, museum-grade "
    "still life. Palette strictly limited to warm gold (#C9A84C), pale gold highlight "
    "(#E5C96A), dark gold shadow (#A8872E), near-black (#0D0D0D) and charcoal "
    "(#1A1A1A). No text, no letters, no numbers, no Arabic script, no logos, no "
    "watermarks, no signatures."
)

# Freepik names its ratios rather than taking "16:9". These five are confirmed
# against the API; anything else is passed through untouched so a newly added
# ratio still works, and the API's own validation error names the valid set.
RATIOS = {
    "1:1": "square_1_1",
    "4:3": "classic_4_3",
    "3:4": "traditional_3_4",
    "16:9": "widescreen_16_9",
    "9:16": "social_story_9_16",
    # Instagram's 4:5 feed crop is not confirmed in the docs. 3:4 is the nearest
    # tall ratio that definitely exists and crops to 4:5 cleanly.
    "4:5": "traditional_3_4",
}

POLL_INTERVAL_S = 3
POLL_TIMEOUT_S = 300


def resolve_auth():
    """Return (base_url, header_name, key), preferring whichever key is set."""
    key = os.environ.get("FREEPIK_API_KEY")
    if key:
        return "https://api.freepik.com", "x-freepik-api-key", key
    key = os.environ.get("MAGNIFIC_API_KEY")
    if key:
        return "https://api.magnific.com", "x-magnific-api-key", key
    sys.exit(
        "No API key found.\n"
        "Set FREEPIK_API_KEY (or MAGNIFIC_API_KEY) and try again.\n"
        "Get one at https://www.magnific.com/api — the API draws on the same\n"
        "credit wallet as a Freepik/Magnific subscription, so an existing paid\n"
        "plan may already cover it."
    )


def call(method, url, header_name, key, payload=None):
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header(header_name, key)
    if data:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        # The validation error body is the authoritative list of allowed enum
        # values, so surface it whole rather than summarising it away.
        sys.exit(f"HTTP {e.code} from {url}\n{body}")
    except urllib.error.URLError as e:
        sys.exit(f"Could not reach {url}: {e.reason}")


def build_prompt(subject, with_style):
    subject = subject.strip()
    if not with_style:
        return subject
    if not subject.endswith((".", "!", "?")):
        subject += "."
    return f"{subject} {STYLE_BLOCK}"


def main():
    p = argparse.ArgumentParser(
        description="Generate an on-brand SARD still via Freepik/Magnific Mystic.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    p.add_argument("--prompt", required=True,
                   help="The subject sentence. The brand style block is appended for you.")
    p.add_argument("--ratio", default="4:5",
                   help=f"One of {', '.join(RATIOS)} — or a raw Freepik ratio name. Default 4:5.")
    p.add_argument("--resolution", default="2k", choices=["1k", "2k", "4k"],
                   help="Output resolution. Default 2k.")
    p.add_argument("--out", help="Where to save the image. Defaults to ./falcon-eye-<task_id>.png")
    p.add_argument("--no-style", action="store_true",
                   help="Send the prompt bare, without the brand style block.")
    p.add_argument("--dry-run", action="store_true",
                   help="Print the resolved prompt and payload, spend nothing.")
    args = p.parse_args()

    prompt = build_prompt(args.prompt, not args.no_style)
    payload = {
        "prompt": prompt,
        "aspect_ratio": RATIOS.get(args.ratio, args.ratio),
        "resolution": args.resolution,
        "model": "realism",
    }

    if args.dry_run:
        print("--- resolved prompt ---")
        print(prompt)
        print("\n--- payload ---")
        print(json.dumps(payload, indent=2))
        print("\nDry run: nothing sent, no credits spent.")
        return

    base, header, key = resolve_auth()

    submit = call("POST", f"{base}/v1/ai/mystic", header, key, payload)
    task_id = (submit.get("data") or {}).get("task_id")
    if not task_id:
        sys.exit(f"No task_id in response:\n{json.dumps(submit, indent=2)}")
    print(f"Submitted. task_id={task_id}", file=sys.stderr)

    deadline = time.time() + POLL_TIMEOUT_S
    while True:
        if time.time() > deadline:
            sys.exit(f"Timed out after {POLL_TIMEOUT_S}s. Poll manually:\n"
                     f"  GET {base}/v1/ai/mystic/{task_id}")
        time.sleep(POLL_INTERVAL_S)
        res = call("GET", f"{base}/v1/ai/mystic/{task_id}", header, key)
        data = res.get("data") or {}
        status = (data.get("status") or "").upper()
        if status == "COMPLETED":
            break
        if status == "FAILED":
            sys.exit(f"Generation failed:\n{json.dumps(res, indent=2)}")
        print(f"  status={status or 'PENDING'}", file=sys.stderr)

    urls = data.get("generated") or []
    if not urls:
        sys.exit(f"Completed but returned no image:\n{json.dumps(res, indent=2)}")

    out = args.out or f"falcon-eye-{task_id}.png"
    parent = os.path.dirname(os.path.abspath(out))
    os.makedirs(parent, exist_ok=True)
    with urllib.request.urlopen(urls[0], timeout=120) as r, open(out, "wb") as f:
        f.write(r.read())

    print(f"Saved {out}")
    if len(urls) > 1:
        print("Additional images returned:")
        for u in urls[1:]:
            print(f"  {u}")


if __name__ == "__main__":
    main()
