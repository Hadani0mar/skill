---
name: techno-ly
description: Make vertical Arabic (Libyan dialect) motion-graphics videos for the TikTok channel «تقني» @techno_ly — AI-tool explainers, tool lists, service promos — with the channel's fixed intro and outro, its ت logo, white/green house style, real product UI rebuilt in Stageshow windows/phones, React Bits motion and sounds, brag rules and music, timed to the user's AI-Studio voice-over. Also covers writing the TTS script and growing the TikTok account. Read this whole file and its references before writing anything.
---

# techno-ly — فيديوهات قناة «تقني»

This skill reproduces, step by step, the videos made for the TikTok channel **«تقني» (@techno_ly)** on 3 Nov 2026
(see `examples/`). Another model following it must get the same look, pacing and quality.

**Reading gate (mandatory):** read this file to the END line, then `references/script-writing.md`,
`references/pitfalls.md` and `references/tiktok-growth.md`, then open `examples/README.md` and watch/inspect at
least `examples/05-gemini-notebook` (the latest, best video) and its `src` in `template/src/App.tsx`.
Before writing code, reply with a short receipt: the 5 workflow stages below in your own words + the check word
from the END line.

## 0. What the channel is
- **Content:** explainers of the newest **AI tools** (lists like «3 أدوات…», then one full explainer per tool), in
  Libyan Arabic. Secondary, mentioned indirectly only: open-source code to try, and the paid service — websites/apps
  (e.g. online stores) and promo motion-graphics videos for any site/app/product.
- **Tone:** value first, never beg for follows. The follow reason is always "the next explainer is coming"
  and "comment the tool you want and we'll make a full video on it".
- **Brand:** logo = the letter **ت** built geometrically: a thick black bowl (reads as a smile) + two square
  "pixel" dots, left **black**, right **green #22c55e**, on white. Files in `examples/brand/`. It builds
  (dots drop with a spring, bowl draws with stroke-dashoffset), **blinks** (green pixel squashes), sits as a
  corner **bug** (top-left, ~52 px) for the whole video.

## 1. Workflow (always in this order)
1. **Script first** (`references/script-writing.md`). Libyan dialect, angle-bracket tone tags for Google AI
   Studio TTS (`<curious>`, `<warm>`, `<excited>`, `<calm>`, `<amazed>`, `<breath>`, `<short pause>`, `<smile>`),
   English names transliterated (نوت بوك إل إم، بربلكسيتي…), plus an English **Scene** prompt. Research every
   product fact first (WebSearch; rename/feature checks) — e.g. NotebookLM was renamed **Gemini Notebook** on
   16 Jul 2026 (same site notebooklm.google). Never invent UI or numbers.
2. **Shots before render.** Build the scenes with placeholder times, render 12–18 stills
   (`node record.mjs stills 2,7.6,11,...` → `scripts/contact-sheet.py`), send the sheet, fix what the user says.
3. **Voice → timing.** The user sends the WAV. `scripts/silences.sh voice.wav -38 0.15` lists pauses; map each
   speech chunk to a script phrase; inside a chunk place words by letter count. Write all cue times as absolute
   seconds in one `T` object (see template). Cut scenes on pauses.
4. **Sound.** React Bits sounds rendered to WAV (`scripts/render-rb-sounds.mjs`), brag keyboard presses for typing,
   optional brag music bed ducked under the voice (`mix.py`; licence of the music is unverified — offer a version
   without music). SFX peak ~10 dB under the voice.
5. **Render & deliver.** `scripts/render.sh <seconds> 6 out/video.mp4` (parallel Playwright frame capture at 2×,
   1080×1920, 30 fps, blank-frame check, ffmpeg H.264 veryfast CRF 18). Send the MP4 with a short note: what's
   in it, what is sample data, the weakest shot. Then advise on posting (references/tiktok-growth.md).

## 2. House style (fixed)
- 1080×1920 (stage 540×960 CSS, screenshot at deviceScaleFactor 2), 30 fps. **White ground**, faint grey dot grid
  (22 px), soft green radial glow at the top. Never dark.
- Green: `#22c55e` / `#3ecf8e` for shapes, `#1f9d63` for text on white; ink `#111`.
- Fonts: **Cairo** (house) or **Beiruti** (used in the store and NotebookLM videos) for Arabic, Inter for
  Latin/UI. Add `word-spacing: .12em` with Beiruti (its space is narrow).
- Motion: every frame is a pure function of `t` (no CSS transitions/animations). Word-by-word blur reveals
  (BlurText), springs with slight overshoot, scenes cut on voice pauses with **staggered** exits (old content fades
  + blurs out, then new comes in — never a muddy crossfade), varied transitions (push, slide, zoom-blur, 3D card
  flip, circular reveal from the pressed button).
- **Visual scan** for every UI step: the rest of the screen dims (box-shadow veil), a green beam sweeps down to the
  target, corner brackets snap on it, a short Arabic tag labels it, the camera zooms to it, the cursor clicks with
  a ripple. Above the window: a step header (green number badge + short Arabic title). Below the window: one
  caption line per step (BlurText, key word in green).
- Icons/logos only from **m0usasvg** (duotone green icons; real brand logos). Real product photos and real payment
  logos when the user supplies them — never name-only placeholders.

## 3. Fixed INTRO (start of every video)
Pick by video type, always ≤ 8 s, hook in the first 2 s:
- **Series episode** (a full explainer promised before): a silver Stageshow **Phone** plays real frames of the
  previous video (`public/prev/fXXXXX.jpg`, object-fit contain) with a black pill «من الفيديو اللي فات», caption
  «وعدناكم بشرح كامل لكل أداة» (كامل in green), then a chip «اليوم: الأداة الأولى» + the tool logo. Then zoom-blur
  into the hook.
- **Kinetic hook** (always, right after or as the opener): one big word at a time (≈110 px, weight 900) with a
  matching duotone icon in a 170 px rounded green-tint tile above it, progress ticks below; the words then collapse
  into a row of chips. Example: ارفع ↑ / محاضرتك 📄 / واسألها 💬 / تجاوبك ✦ / من الملف 📖 / بالمصدر ❝.
- **Lists / promos:** the ت logo builds and blinks, its green pixel grows into a big green tile with a rolling
  Counter (e.g. 0→3) while tool logos orbit it.

## 4. Fixed OUTRO (end of every video, ~10–14 s)
In this order, each on its voice phrase:
1. ت logo (90–170 px) builds and blinks.
2. «الجاي» card (white, green border): the next explainer's name (e.g. «شرح Perplexity»).
3. Comment box «شن الأداة اللي تبيها؟» — a tool name types in («اشرحولنا Cursor»), send press, the comment posts.
4. Card «فيديو كامل على طلبك» with a green play tile.
5. Follow button «تابع تقني» inside a **StarBorder** (light travelling around the border), press → «تتابع تقني ✓» +
   **ClickSpark** burst.
6. TikTok logo + **@techno_ly** pill. Hold ≥ 1.5 s after the voice ends.

## 5. Scene toolkit (copy from template/ and examples/)
- `template/` = the NotebookLM video project (best reference): `src/App.tsx` (all scenes, the T timeline, measured
  camera, scan, cursor, intro, outro), `src/rb.tsx` (frame-driven Counter, DecryptedText, ClickSpark, StarBorder —
  own re-implementations of React Bits effects), `src/ui.tsx` (Ico, Logo with id/class prefixing, BlurText, Pop),
  `src/anim.ts`, `src/style.css`, `kit/` (Stageshow, MIT), `record.mjs`, `build.mjs`, `mix.py`, `scripts/`.
- **Measured camera:** the page (820 px wide) is drawn inside the Stageshow Window viewport; every element with
  `data-target` is measured each frame (useLayoutEffect, ≤3 re-measures per t). Camera keys
  `{t, tg, z, cut}` ease (0.8 s) between targets; clamp to page bounds. Keep the window landscape-ish (512×470) so
  the page is not taller than wide, and put captions under it.
- Chat UIs: `justify-content: flex-end` so the newest message stays in view.
- Other examples: Supabase dashboard (light tokens) + two phones syncing (01), tool list with orbiting logos,
  feed, tested card, poster with scan (02), store with product cards, flying add-to-cart, cart drawer, delivery
  vs pickup, payment **dropdown with real Libyan wallet logos** (Sadad, MobiCash, Edfali, One Pay, LYPay, Moamalat
  cards, cash on delivery), circular-reveal success (04), Gemini Notebook walkthrough (05).

## 6. Setup on a new machine
- Node 18+, Python 3 + numpy + Pillow, ffmpeg, Playwright Chromium. Either `npm i esbuild react react-dom playwright`
  in `template/`, or point env vars at existing copies: `ESBUILD_MAIN`, `NODE_GLOBAL` (folder holding react,
  react-dom), `PLAYWRIGHT`.
- Clone sources: `Hadani0mar/m0usasvg` (sparse: `src/data` + the logo folders you need) → `scripts/fetch-assets.py`
  writes `src/assets.json`; `DavidHDev/react-bits` → `scripts/render-rb-sounds.mjs` writes `out/rbs/*.wav`;
  `Hadani0mar/brag` → music + keyboard SFX (`BRAG=../brag`); `benjitaylor/skills` (Stageshow, already in `kit/`).
- Never commit React Bits source, rendered WAVs or brag music to a shared repo.

## 7. Delivery checklist
- Stills of every scene and mid-transition checked: no overflow, no clipped Arabic, no double exposure.
- Every on-screen claim is researched and true; sample data called sample data in the note.
- Text readable ≥ 0.3 s per word after it settles; captions inside x 24–516, y 60–900.
- Frame 0 is a strong settled frame (it becomes the TikTok cover).
- MP4 + one-line creative angle + weakest shot + posting advice.

END OF SKILL — techno-ly · check word: «بكسل-أخضر»
