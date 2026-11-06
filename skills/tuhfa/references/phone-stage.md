# The phone stage — a tool explainer that holds attention (Nov 2026)

How the «تقني» tool explainers are built after the November 2026 rounds, what the user rejected and why, and the exact
layout numbers. The worked code is `template/src/films/notebook.tsx` (posted) and `template/src/films/jahiz.tsx`.

## 1. What happened, round by round

| Round | Look | Verdict | Lesson |
|---|---|---|---|
| Gemini Notebook v1 (`examples/videos/gemini_notebook_p1_v3.mp4`) | TV-head presenter, CRT squeeze, zap cuts, phone PIP | Posted. «الشخصية في البداية ضخمة» → presenter made smaller, everything kept inside TikTok safe zones | The character must never fill the first frame on TikTok |
| Notebook v2 (`examples/storyboards/unused_notebook_editorial_paper.jpg`) | Editorial paper, Kufam stamp «الحل», halftone wipes | Not used (superseded by the user's next brief) | — |
| Notebook v3 (`examples/storyboards/rejected_notebook_3d_world.jpg`) | motion-storytelling style 8, a three.js paper world, the Notebook arch as hero | **Rejected: «مشتت جدا»** | Many worlds + many camera cuts + cards all over = no focus. A tool explainer needs one place to look |
| Notebook v4 (`examples/videos/gemini_notebook_4k60.mp4`) | **The phone stage** (below) | **Approved and posted**, then extended with Word/Sheets/YouTube sources | One device, centred, for the whole film |
| JAHIZ (`examples/storyboards/jahiz_storyboard.jpg`) | Phone stage with two devices taking turns (phone ↔ dashboard), the order ticket ٤٧ as hero | Storyboard delivered, waiting for the voice | Two devices are fine if only one is on stage at a time and a moving object hands over between them |

Earlier rejections that still apply: the glitch/«rot» look («غير مريح في المشاهدة»), code-drawn copies of a reference
illustration («سيئة جدا»), music under the voice.

## 2. Research behind the phone stage

- Retention editing: a visual change every 1–2 s, cut dead air, put the payoff early (reelsbuilder.ai, 2026 playbook).
- Restraint: one well-placed effect beats a dozen scattered ones; emphasise a single beat (domer.io).
- From the most-used Claude Code motion skills: spring entrances, staggered reveals, exits faster than entrances,
  idle "breathing" on held elements, a layered background (base, glow, grain, vignette) (haidrrrry/claude-remotion-skill,
  cliptalk.pro gallery).
- TikTok accepts 4K uploads and 60 fps but plays 1080p; deliver a 4K master and a 1080p copy (postfa.st, filmora, 2026).

## 3. Layout (540 × 960 stage, scale ×2 or ×4 on capture)

- **Safe zones:** top 65 px, right 60 px, bottom 165 px (TikTok UI). Nothing that must be read goes there.
- **Bug:** channel mark + `@teqani.ly`, top-left 22/26 px, 30 px mark.
- **Headline:** `top: 84px; left: 30px; right: 64px`, Alexandria 800, 33 px (28 px when the line is > 21 characters),
  `nowrap`, ≤ 6 words. Words blur in 70 ms apart; the line blurs out over the last 180 ms of its phrase. One keyword
  coloured: green `#1f9d63` for the gain, red `#e5484d` for the pain. The first line is fully visible at frame 0.
- **Phone:** stageshow `Phone width={380} frame="pro"`, wrapper scale 0.8, centre (252, 562). Breathing: scale ±0.6 %,
  float ±2 px. Screens are drawn at 1080 × 2400 inside (`scr5__in`, scale 0.3641) with chat text at 54 px so it reads.
- **Step counter:** top-right, black square with the Kufam numeral plus four dashes (done = black, current = green).
- **Out-of-phone cards:** `Out` component — spring from the phone centre to (x, y) in 0.45 s, leave in 0.2 s.
- **Fly-ins:** source chips fly from off-screen into the phone (0.55 s ease-in-out, shrinking to 25 %).
- **Rings:** green circles from the phone while audio plays.
- **Cuts between app screens:** white flash at ≤ 50 %, 0.24 s.
- **End:** phone drops and fades (0.6 s); product mark card; channel mark + TikTok logo + handle. No follow request.

## 4. The film skeleton (≈ 30–40 s, voice-led)

1. **Hook (0–5 s):** the pain on the phone itself (a PDF racing to «٣٢٠ صفحة», a receipt «رقم ٤٧» + a blinking pager),
   with the voice's question as the headline. Other file types pile around the phone when relevant.
2. **The answer (≈ 1.5 s):** a circular reveal of the product inside the phone, or the product mark drawing on.
3. **What it is (5–8 s):** name card above the phone, chips at its sides (was-called, maker logo, «ببلاش»).
4. **Inputs (5 s):** sources fly in and land as rows in the app with green checks; a counter rolls («٥٠ مصدر»).
5. **Features ١–٤ (≈ 15 s):** each one a screen in the phone plus one card that comes out of it.
6. **Close (2–3 s):** the voice's last line as headline, mark, channel ending.

## 5. Facts checked for these films

- Gemini Notebook = NotebookLM renamed on 16 July 2026; free plan 100 notebooks, 50 sources each; audio and video
  overviews included (elephas.app, dupple.com, Oct 2026).
- Source types: PDF, Word (.docx), Google Docs/Slides/Sheets, CSV, PowerPoint, text, web links, YouTube, audio.
  **Excel (.xlsx) is not listed** → show Google Sheets for spreadsheets (aguidetocloud.com, 9to5google.com).
- JAHIZ: the screens are rebuilt from the project brief, not from a running site; «Demo Restaurant» and all numbers
  are examples. «مجاني ومفتوح المصدر» needs a public repo with an MIT LICENSE on the day of posting.

## 6. Sound map used (Kenney pack in `techno-ly/template/assets/audio/sfx`)

| Event | File | Gain |
|---|---|---|
| Page ticks in the hook | `interface/click_002..004` every 0.22 s | 0.35 |
| A chip/card pops | `interface/bong_001`, `ui/rollover2`, `ui/click2` | 0.5–0.7 |
| The big reveal | `impact/impactSoft_heavy_003` | 0.9 |
| Cuts | procedural noise whoosh (0.4 s) | 0.7 |
| Source lands | `interface/drop_002` + `ui/switch7` | 0.3–0.6 |
| Tap on a button | `ui/mouseclick1` | 0.8 |
| Correct answer | `interface/switch_002` | 0.7 |

Effects sum × 0.33 under the voice, ducked 45 % while the voice speaks, then loudnorm −14 LUFS (TP −1.5).
