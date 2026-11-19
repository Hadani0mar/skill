---
name: techno-ly
description: Make vertical Arabic motion-graphics videos for the TikTok channel «تقني» @teqani.ly — AI-tool explainers, tool lists, service promos — benefit-first hooks with an honest reason to finish (no logo intro), its ت logo as a corner mark, white/green house style, real product UI rebuilt in Stageshow windows/phones, React Bits motion and sounds, restrained action-timed foley and Gemini Voice narration, following the approved 13 Nov 2026 white/Kufam/60-fps reference. Also covers writing the TTS script and growing the TikTok account. Read this whole file and its references before writing anything.
---

> **Shared toolkit (14 Nov 2026):** For a combined motion/design task, read `../tuhfa/SKILL.md` and its `references/toolkit-routing.md` to select the additional modules. For @teqani.ly, the current user brief and `../tuhfa/references/channel-profile.md` take precedence over older house styles, voices, endings and repeated confirmation gates below. Preserve the approved template and accepted voice for edits.


# techno-ly — فيديوهات قناة «تقني»

This skill reproduces, step by step, the videos made for the TikTok channel **«تقني» (@teqani.ly)** on 3 Nov 2026
(see `examples/`). Another model following it must get the same look, pacing and quality.

**Reading gate (mandatory):** read this file to the END line, then `references/script-writing.md`,
`references/pitfalls.md` and `references/tiktok-growth.md`, then open `examples/README.md` and watch/inspect at
least `examples/06-supabase-edge-functions` (current approved reference) and its `src/scenes/`.
Keep `examples/05-gemini-notebook` and `template/src/App.tsx` as historical motion references.
Before writing code, reply with a short receipt: the 5 workflow stages below in your own words + the check word
from the END line.

## Current approved reference — 13 Nov 2026

The user approved the Edge Functions film: «ممتاز هذا الاسلوب المرغوب عندي».
Read [the approved style](references/approved-edge-functions-style.md) and start from
[06-supabase-edge-functions](examples/06-supabase-edge-functions/README.md) for new tool explainers.
Its pure white ground, Kufam typography, 60 fps, phone timing, MSA Gemini Voice and channel-only follow outro
supersede older conflicting defaults below. Current user instructions always take priority.
Do not add on-video «فيديو غير رسمي», «محاكاة تعليمية», source URLs or production notes by default;
keep example-data and implementation explanations in the project README.

## 0. What the channel is
- **Content:** explainers of the newest **AI tools** (lists like «3 أدوات…», then one full explainer per tool), in
  Arabic (current approved narration: Modern Standard Arabic; use Libyan when requested). Secondary: open-source code to try, and the paid service — websites/apps
  (e.g. online stores) and promo motion-graphics videos for any site/app/product.
- **Tone:** value first, with a specific, honest reason to keep watching. Deliver the promised result; never beg
  for follows. When free code or another offer is the main verified benefit, state it in the opening.
- **Brand:** logo = the letter **ت** built geometrically: a thick black bowl (reads as a smile) + two square
  "pixel" dots, left **black**, right **green #22c55e**, on white. Files in **`brand/`**: `taqni-mark-white.svg`
  (main, black+green on white — the one used in videos), `taqni-mark-green.svg` (avatar: white on green),
  `taqni-mark-black.svg`, and a 1080² PNG of each (same names). SVG geometry (viewBox 1080): bowl path
  `M300 470 C300 700 780 700 780 440` stroke 118 round caps, dots `rect 400/568,300 112×112 rx22`, group
  `translate(0 45)`. It builds
  (dots drop with a spring, bowl draws with stroke-dashoffset), **blinks** (green pixel squashes), sits as a
  corner **bug** (top-left, ~52 px) for the whole video.

## 1. Workflow (always in this order)
1. **Script first** (`references/script-writing.md`). Follow the user's requested language; use clear MSA for the
   approved 06 style. For Libyan reads, use angle-bracket tone tags for Google AI
   Studio TTS (`<curious>`, `<warm>`, `<excited>`, `<calm>`, `<amazed>`, `<breath>`, `<short pause>`, `<smile>`),
   English names transliterated (نوت بوك إل إم، بربلكسيتي…), plus an English **Scene** prompt. Research every
   product fact first (WebSearch; rename/feature checks) — e.g. NotebookLM was renamed **Gemini Notebook** on
   16 Jul 2026 (same site notebooklm.google). Never invent UI or numbers.
2. **Shots before render.** Build the scenes with placeholder times, render 12–18 stills
   (`node record.mjs stills 2,7.6,11,...` → `scripts/contact-sheet.py`), send the sheet, fix what the user says.
3. **Voice → timing.** Generate via the connected Gemini Voice API when requested, or use the user's WAV.
   Preserve approved narration when revising only the picture. `scripts/silences.sh voice.wav -38 0.15` lists pauses; map each
   speech chunk to a script phrase; inside a chunk place words by letter count. Write all cue times as absolute
   seconds in one `T` object (see template). Cut scenes on pauses.
4. **Sound.** Use foley only, unless the user asks for music. Reuse the repository's interface clicks,
   keyboard presses, soft slides and impacts. Place sounds only on visible actions, about 8–10 dB below the voice;
   aim around −14 LUFS. Keep one event list so retiming picture and effects stays synchronized.
5. **Render & deliver.** `scripts/render.sh <seconds> 6 out/video.mp4` (parallel Playwright frame capture at 2×,
   1080×1920, 60 fps for the approved reference, blank-frame check, ffmpeg H.264 veryfast CRF 18). Send the MP4 with a short note: what's
   in it, what is sample data, the weakest shot. Then advise on posting (references/tiktok-growth.md).

## 2. House style (fixed)
- 1080×1920, 60 fps; design at 540×960 CSS and scale 2×. **Pure white ground**. Use the approved 06 look
  without a dot grid, gradient or glow. Keep overlays clear of TikTok controls.
- Green: `#22c55e` / `#3ecf8e` for shapes, `#1f9d63` for text on white; ink `#111`.
- Fonts: **Kufam** for Arabic, **Inter** for Latin/UI, **JetBrains Mono** for code. Cairo and Beiruti belong to
  older examples. Keep complete Arabic words, RTL, natural spacing and unclipped dots.
- Motion: every frame is a pure function of `t` (no CSS transitions/animations). Word-by-word blur reveals
  (BlurText), springs with slight overshoot, scenes cut on voice pauses with **staggered** exits (old content fades
  + blurs out, then new comes in — never a muddy crossfade), varied transitions (push, slide, zoom-blur, 3D card
  flip, circular reveal from the pressed button).
- **UI walkthrough:** rebuild the named product from its current source and screenshots; preserve its real labels.
  Use a restrained cursor and purposeful camera pushes to the active control or a few key code lines. Introduce
  the tool before the phone. A phone may shrink to show a request/response beside the function, then return large
  for the result. Keep captions outside the device and give them their own space.
- Icons/logos only from **m0usasvg** (one restrained icon look; real brand logos). Real product photos and real payment
  logos when the user supplies them — never name-only placeholders.

## 3. Opening — benefit first and a reason to finish (updated 6 Nov 2026)
Read **`references/hooks-and-retention.md`** before scripting every new video; it takes precedence over older
recap-first scripts and instructions to postpone the principal benefit.
For topic-based TikTok explainers, also route script preproduction through `../studio-script/SKILL.md`
and its `INTEGRATION.md` to compare three distinct scored hooks and plan a useful mid-video re-hook.
Do not adopt the imported skill's voice, paid accounts, split-screen style or extra setup gates.
- **Frame 0 is already the story:** show the real result, product screen or relevant action with a readable hook.
  No logo build, recap, title card or empty first second.
- State the strongest verified viewer benefit in the first spoken sentence and within the first **2–3 seconds**.
  Show useful proof within roughly **3–5 seconds**. These are editing targets to test, not algorithm guarantees.
- Add one natural, specific reason to continue: «شوف كيف تخدم…» or «وفي الآخر نوريك [خطوة مفيدة محددة]».
  Deliver that step or result in the same video. Keep giving useful information throughout.
- Put the tool name and any necessary previous-video recap after the benefit. Do not hold the main useful
  information or authorized free-code offer until the ending.
- Keep the ت logo as a small corner mark / handle throughout. Silent videos communicate the hook visually;
  wordless formats keep a visual setup and resolution without unsolicited speech.

## 4. Ending — channel identity and a simple follow button (approved 13 Nov 2026)

- Finish the explanation on the narration, then show the ت logo, the real TikTok light-background logo and **@teqani.ly**.
- Add one restrained animated «متابعة» button: a short rise, one pointer press, then «تمت المتابعة» with a check.
  Clear the old label before the new one enters; never overlap the two. Match the click to its sound.
- Keep the outro on white. Omit extra slogans, source URLs, «فيديو غير رسمي», «محاكاة تعليمية» and production notes.
- This explicitly replaces the older prohibition on follow buttons. Do not add repeated spoken follow requests.

## 4b. How the skills combine (read `references/combined-workflow.md`)
Build every new video with **motion-reel** (beats, in-app world, foley), **stageshow** (anti-AI-look rules for the
UI), **brag** (hook and reading time) and **m0usasvg** (real logos). The older sections below (React Bits sparkle,
duotone icon tiles, chips, StarBorder) are kept for reference only; where they conflict, the combined workflow wins.

## 5. Scene toolkit (copy from template/ and examples/)
- `examples/06-supabase-edge-functions/` is the self-contained approved reference: separate Remotion scenes,
  full device/window kit, pinned dependencies, licensed fonts, FLAC voice/mix, cue list and runnable coupon example.
- `template/` = the historical NotebookLM video project: `src/App.tsx` (all scenes, the T timeline, measured
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
  brag music + SFX are already in `template/assets/audio/` (from `Hadani0mar/brag`); `benjitaylor/skills`
  (Stageshow, already in `kit/`).
- Never commit React Bits source or its rendered WAVs.

## 7. Delivery checklist
- Stills of every scene and mid-transition checked: no overflow, no clipped Arabic, no double exposure.
- Every on-screen claim is researched and true; sample data called sample data in the note.
- Text readable ≥ 0.3 s per word after it settles; captions inside x 24–516, y 60–900.
- Frame 0 is a strong settled frame (it becomes the TikTok cover).
- The benefit is clear by second 3; the opening shows useful proof; every promise used to encourage viewing
  is fulfilled before the ending. Revise the script and shot order if any check fails.
- MP4 + one-line creative angle + weakest shot + posting advice.

END OF SKILL — techno-ly · check word: «بكسل-أخضر»


