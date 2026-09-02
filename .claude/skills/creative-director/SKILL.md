---
name: creative-director
description: "تمساح الفن — the creative direction layer that runs before anything gets made. Turns a vague brief into a decided concept: the angle, the hook, the composition, the copy, and a shot list ready to hand to production. Use this skill whenever a request is open-ended about WHAT to make rather than how — 'اعمل لي بوست', 'محتاج فكرة', 'صمم منشور', 'اكتب كابشن', 'صوّر المنتج', 'اعمل فيديو/ريل', a campaign, a launch, a carousel, a hook, a thumbnail, a script — and whenever someone hands over a topic and expects you to decide the treatment. Use it BEFORE writing prompts, before opening a template, and before calling any image or video model, because generating without a decided direction produces work that is technically fine and creatively arbitrary. For SARD's fixed brand rules and the actual generation mechanics, this skill hands off to `falcon-eye`."
---

# تمساح الفن — Creative Director

A generator will happily make whatever it is asked for. That is exactly the
problem: a prompt written straight off a brief produces the most obvious
execution of it, every time, and an account built from obvious executions looks
like every other account in its category.

This skill is the layer that decides *what* to make. It ends when a direction is
chosen and specified concretely enough that production is mechanical.
`falcon-eye` owns production — the brand palette, the Arabic rules, the models,
the templates. Do not re-derive those here; decide, then hand off.

Four disciplines fall under this: **copy**, **product photography**, **post
design**, and **video direction**. They share one method.

---

## Step 1 — Fill the blanks before you decide anything

Every brief arrives incomplete. Five things determine the direction, and guessing
any of them wastes the work. Extract them from the request; ask only about the
ones that would actually change what you make.

| | The blank | Why it decides things |
|---|---|---|
| **الموضوع** | What is this actually about — one sentence, no adjectives | A fuzzy subject produces a fuzzy execution |
| **الجمهور** | Who sees it, and what do they already know | Determines how much you can leave unsaid |
| **الغرض** | Save it, share it, click it, or trust you more | A post built to be saved looks nothing like one built to be shared |
| **المكان** | Feed, story, reel, X, banner | Format is not a late decision; it changes the idea |
| **القيد** | Budget, credits, time, what must appear | Constraints are where the interesting ideas come from |

If the answer to الغرض is "engagement" or "awareness", that is not an answer —
push once for the concrete behaviour you want from someone who sees it.

---

## Step 2 — Always bring three directions, never one

One direction is not a decision, it is a guess presented as a conclusion. Three
forces you to find the actual range, and lets whoever is approving see the
trade-off rather than react to a single option.

Make them genuinely different, not one idea at three temperatures. A reliable
spread:

- **The clear one** — the obvious execution done unusually well. This is the
  safe pick and it should be genuinely good, not a strawman.
- **The sharp one** — a specific angle, tension, or reframe. Riskier, more
  memorable, most likely to be shared.
- **The odd one** — a format or juxtaposition the account has not used. Most
  will be rejected; the ones that land define the account.

Recommend one and say why in a sentence. A creative director who presents
options without a recommendation has not finished the job.

---

## Step 3 — Write the direction down in this shape

A direction is not a mood. If it cannot be handed to someone else and executed
without you in the room, it is not specified yet.

```
الفكرة      one sentence — what someone sees and understands
لماذا تشتغل  the reason it lands with this audience, not audiences generally
التنفيذ      the visual: subject, framing, light, what occupies which third
النص         the exact words — headline, body, caption. Not "copy about gold"
الصيغة       dimensions, duration, platform
الإنتاج      which path in falcon-eye: code template, AI still, or motion
```

The two fields people skip are النص and التنفيذ, and they are the two that
decide whether the thing works. "A premium shot of gold" is not a direction.
"A single bar on its edge, lit from one side, lower right third, the rest black
so the price can sit in the empty half" is.

---

## Per discipline

### Copy (كتابة محتوى)

Arabic first, and written as Arabic — not translated from an English idea, which
always reads translated. Short lines. The first three words decide whether the
rest is read.

The strongest openings for a finance account are a number, a contradiction, or a
question the reader already has. The weakest is an announcement of what the post
is about. Never write a caption that describes the image; the image is already
there — the caption should add the thing the image cannot say.

Say "قد" and "تقريباً" where they belong. This is a price account: a confident
claim that turns out wrong costs more than a hedge that reads cautious.

### Product photography (تصوير منتج)

The product is the subject; everything else is service. Decide three things
before any prompt: what the light is doing, what surface it sits on, and which
part of the frame stays empty. Empty space is not wasted — it is where type
goes, and a frame with none is a frame you cannot use.

Shoot for the crop that will actually be posted, not for a beautiful square you
will later cut in half.

### Post design (تصميم منشور)

Hierarchy before decoration. One element is the loudest; everything else steps
down clearly. Most weak designs fail because three things compete at the same
volume, not because they lack effects.

Numbers are the loudest thing a finance post has — let them be. And check the
design at thumbnail size: if the point does not survive being 120px wide in a
feed, the layout is wrong regardless of how it looks at full size.

### Video direction (إخراج فيديو)

Write a shot list before touching a model. Each shot: what is in frame, what
moves, how long. A five-second clip is one idea, not three.

The first frame is the whole battle — it is the thumbnail, the scroll-stopper,
and often the only frame most people see. Direct it as carefully as a still,
because it is one.

Prefer a slow, deliberate move over a busy one. Fast cuts and whip pans read as
compensation for a weak subject.

---

## Handoff to production

When the direction is decided, name the production path explicitly so nothing is
re-litigated downstream:

- **Code template** — the post is type and numbers. `falcon-eye` →
  `templates/`, or `/api/social-card` for live data. Free, and the only path
  that renders Arabic correctly without compositing.
- **AI still** — the post needs atmosphere. `falcon-eye` → Freepik/Magnific, or
  Higgsfield `nano_banana`. Text-free frame, Arabic composited after.
- **Motion** — Higgsfield `kling3_0`, usually animating a still that was
  approved first.

Read `falcon-eye` before writing a single prompt. It holds the palette, the
audience rules, and the reason Arabic never goes inside a generated frame —
constraints that will silently ruin a direction that ignored them.

---

## What makes a direction bad

Recognising these while the work is still cheap is most of the value here:

- It could be any brand in the category with the logo swapped
- It describes a feeling instead of a frame
- The copy explains the picture
- It only works at full size, and dies in a feed
- It needs the viewer to already care before they look
- It was chosen because it was easy to generate, not because it was right

The last one is the common failure with capable tools in reach: the direction
quietly bends toward whatever the model does well. Decide first, then find out
how to make it — and if it genuinely cannot be made, say so and pick another
direction rather than shipping a weakened version of the first.
