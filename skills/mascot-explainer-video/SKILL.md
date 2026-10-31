---
name: "mascot-explainer-video"
description: "Make a character-hosted product explainer: a mascot presents (A-roll), cuts away to app UI rebuilt as animated components (B-roll), kinetic captions highlight one word per line, synced to an uploaded voice-over."
---

# Mascot Explainer Video — فيديو شرح بشخصية + شاشات تطبيق

A short vertical (or wide) explainer where ONE character talks to camera, then the picture cuts away to the product's
real UI rebuilt as code components that move exactly on the spoken words, then back to the character for the next idea.
Captions appear word by word and one key word per line takes the brand accent. Built in Remotion (React) and rendered
to MP4, with the user's voice-over on top.

Use when the user asks for: a mascot / presenter explainer, "character explains then shows the app", a product demo
with a talking character, kinetic captions with a highlighted word, or gives a character image and/or a voice file.

## Inputs (ask once, only what is missing)
1. **Product + one core message** — what must the viewer remember? Read it back in one sentence.
2. **Character image** (optional) — PNG/SVG of the mascot. No image → design a mascot from the brand logo (see Character).
3. **Voice-over file** (optional) — WAV/MP3/M4A. No file → write the script first (Script), the user records/generates it.
4. **The app's source or screenshots** — the UI is rebuilt from the real code (labels, tokens, components). Never invent a
   screen that pretends to be the product; sample data is fine and must be called sample data in the delivery note.
5. **Format** — 9:16 1080×1920 (default, Reels/Shorts), 16:9 1920×1080, or 1:1. 30 fps.

If the user says "just make it", use defaults and say which ones you picked.

## The format: A-roll / B-roll
- **A-roll = the character** (carries the story). **B-roll = the UI cutaways** (proves it). Audio stays continuous over both:
  the picture cuts away, the voice never cuts.
- Coverage: B-roll ~40–60% of runtime. Keep the character on screen for the hook, the questions and the ending.
- **One idea per scene, one sentence per beat.** Alternate: character line → screen beat → character line → screen beat.
- Cut in the pauses of the voice, never mid-word.

## Script (when there is no voice yet)
- 130–150 spoken words per minute → 30 s ≈ 65–75 words, 45 s ≈ 100 words.
- Structure (pick one):
  - **Hook → Problem → Solution → How it works (3 beats) → CTA** (default for products)
  - **Problem–Agitate–Solve** (pain-led)
  - **Before–After–Bridge** (transformation)
  - **Question → Answer** chain: character asks, screen answers (best fit for this format)
- Short sentences (≤15 words), active voice, conversational, read it aloud.
- Mark the ONE highlight word per line with ⟨ ⟩. Mark where each line plays: [character] / [screen: name].
- Write numbers as words for TTS. For Arabic: deliver a fully diacritised (تشكيل) copy for TTS, dialect spelled as spoken
  (شِنُو، هَكِّي، نِقُولَّك). Ask for one file per line (01.mp3…) or one file with ~0.5 s pauses between lines.

## Timing from the voice file (the voice is the clock)
Try in order, stop at the first that works:
1. **faster-whisper** (`pip install faster-whisper`, `word_timestamps=True`) → per-word start/end.
2. **ElevenLabs connector** `creative_transcribe_audio` (upload → finalize on a flow → transcribe → poll) → per-word times.
3. **Offline fallback (always works):** detect pauses, then align the script's punctuation to them:
   ```bash
   ffmpeg -i voice.wav -af silencedetect=noise=-32dB:d=0.14 -f null - 2>&1 | grep -oE "silence_(start|end): [0-9.]+"
   ```
   - Speech chunks = gaps between silences. Each comma/ellipsis/full stop in the script ≈ one pause.
   - Line boundaries = the longest gaps (≥0.4 s). Anchor from both ends: short dramatic lines ("ومش بس هكي…") show up as
     3 tiny chunks; list items ("نفد، حرج، منخفض") as one chunk per word — use those as fixed points.
   - Word times inside a line: spread over that line's chunks by letter count.
   - Say in the delivery note that timing was aligned from pauses, not recognised.
- **Mouth from the audio, not from a sine:** per-frame RMS envelope → 0..1 → mouth openness.
  ```bash
  ffmpeg -i voice.wav -ac 1 -ar 16000 -f s16le - | python3 -c "import sys,numpy as n,json;a=n.frombuffer(sys.stdin.buffer.read(),n.int16)/32768;h=16000//30;r=[float(n.sqrt((a[i:i+h]**2).mean())) for i in range(0,len(a),h)];m=max(r);print(json.dumps([round(x/m,3) for x in r]))" > public/mouth.json
  ```
  Map envelope → 4 mouth shapes (closed / small / mid / open) with a little smoothing (avg of 3 frames).

## Character
**A. User gives an image (PNG/SVG):**
- Best: ask for separated parts (body, head, eyes, mouth set, arms) — a cut-out puppet rig. If they send one flat image:
  - Body = the image; animate it as a whole: idle bob (sin, 6–10 px), slight rotate (±2°), squash & stretch on landing
    (keep volume: scaleX up when scaleY down), anticipation dip before big moves.
  - Draw eyes/mouth as overlays on top of the face area (measure the face box from the image once): blinking eyelid shapes
    and a mouth that opens from mouth.json. Match colours to the image.
  - Never redraw or "improve" a copyrighted/known character; the user's own mascot only.
- Remove the background if needed (`sharp` / alpha), keep the original file untouched.

**B. No image → mascot from the brand mark:** turn the logo's main shape into a body (e.g. a database cylinder, a box,
a bubble), white eyes + pupils, blush, a mouth, two simple arms (stroke + round hand), and the logo's accent element as a
prop (speech bubble with dots that pulse while talking). Flat vector, brand navy + one accent.

**Acting (pose-based, like a Joysticks 'n Sliders rig):** a small library of poses — idle, wave (hello), point (question),
think (hand to chin), surprised (eyes 1.2×), cheer (both arms up). Blend between poses with springs. Blink every ~3.3 s
(0.13 s). Bubble dots and a 4–8-frame delayed follow-through on arms = secondary action.

## Kinetic captions (the coloured word)
- One typeface family; weight carries hierarchy: ExtraBold for the caption, the highlight word in the accent colour with a
  marker swipe underneath (width 0→100% over ~0.35 s) and a small scale bump on its spoken time.
- Words enter on their own times: spring from y+40 px and 0.85 scale. Exit the whole line 0.25 s after it ends.
- Character scenes: big caption (≈80–90 px at 1080 wide) above the mascot. Screen scenes: smaller caption (≈56–60 px) on top.
- Safe area on 9:16: keep text inside x 60–1020, y 140–1500.
- AE equivalent: Text Animator → Fill Color, Range Selector Units = Index, Based On = Words.

## UI cutaways (simulate, don't screen-record)
- Rebuild only what the line needs as React components with the app's real tokens (colours, radii, fonts, spacing) and
  real labels from the source. Mock data via props. Components float on the canvas — NOT inside a phone frame.
- Enlarge the UI ~2× so text reads on a phone (body ≥30 px, numbers ≥54 px at 1080 wide).
- Animate on the words: cards stagger in (0.15–0.2 s apart), counters count up during the spoken number, a status badge
  pulses (scale 1→1.35→1 over 0.35 s) when its word is said, a filter chip turns on, a button presses (scale 0.93 for
  4–6 frames) with a ripple, a bottom sheet springs up from below.
- One focal motion at a time; everything else holds still (staging).

## Motion rules (After Effects craft → Remotion)
| AE technique | Rule | Remotion |
|---|---|---|
| Graph Editor / Easy Ease | never linear; S-curve speed graph | `interpolate(..., {easing: Easing.bezier(.2,.8,.2,1)})` |
| Overshoot / bounce | small overshoot then settle; decaying oscillation | `spring({frame, fps, config:{damping: 12–15}})` |
| Follow-through / overlap | secondary parts finish 4–8 frames after the main part | delay child springs by 4–8 frames |
| Stagger / offset | layers start one after another | `delay = i * 4–6 frames` |
| Anticipation | small opposite move before the main move | 3–5 frame dip before a pop |
| Squash & stretch | keep volume | scaleY = 1−a, scaleX = 1+a |
| Arcs | natural moves follow curves | move x/y with different easings |
| Secondary action | blink, bob, bubble dots | always-on idle layer |
| Motion blur (UI moves) | only on fast moves | skip in flat cartoon parts |

Timing reference (30 fps): text reveal 15–25 frames ease-out · lower-third in 12–18 · scene transition 10–20 ease-in-out ·
logo 30–60 · hold any readable text ≥ 1.25 s.

## Transitions (pick per cut, vary them)
- **Bubble iris / circle wipe:** the screen opens from the mascot's speech bubble (clipPath circle 0 → 2300 px, 0.45 s, io ease).
- **Match cut:** the highlighted word flies into the UI element it names (the word "ناقص" lands as the "نفد" chip).
- **Mask / matte reveal:** a card shape expands to become the next scene.
- **Zoom-through:** push into a UI number until it fills the frame, cut to the character.
- **Push / slide:** next scene pushes the old one off (same direction for the whole video).
- **Hard cut on a pause** — the default; dissolve only to show time passing.
- Exit of a screen: scale 1→0.94 + fade 0.3 s, then the character pops back with a spring.

## Motion-graphics menu (combine 2–3, not all)
Character animation · UI/UX animation · kinetic typography · infographic (counters, bars, donuts on numbers) · icon
animation · logo sting · minimal flat 2D · 2.5D/isometric cards · mixed media (real screenshot + vector) · whiteboard/doodle
annotations (arrows, circles drawn on the UI). Default for app explainers: character + UI + kinetic type + one infographic beat.

## Build (Remotion)
```bash
npx create-video@latest --blank   # TypeScript
npm i @remotion/media @remotion/transitions
```
- `src/Root.tsx`: `<Composition id="Explainer" fps={30} width={1080} height={1920} durationInFrames={Math.ceil((voiceEnd+1.8)*30)} />`.
- `public/`: `voice.wav`, `mouth.json`, `timing.json` ({lines:[{t0,t1,text,hl:[words],scene}], words:[[t...]]}), character image, logo, fonts.
- Scenes as `<Sequence from={sec*fps} durationInFrames={...}>`; inside, `useCurrentFrame()` starts at 0.
- Audio: `<Audio src={staticFile('voice.wav')} />` from `@remotion/media`.
- All motion derived from the frame (no `useState`, no `Math.random` — use `random('seed')`).
- Fonts loaded before render (local @font-face or `@remotion/google-fonts`). RTL: `direction: rtl` on text containers.
- Render: `npx remotion render Explainer out/explainer.mp4`.

**If npm is blocked in the session:** build the same scenes as one HTML file with a frame-based `seek(t)` (same
`spring`/`interpolate` maths), screenshot each frame with Playwright (JPEG q92, 30 fps) piped to ffmpeg per scene, join
with the concat demuxer, mux the voice with `-c:v copy`. Tell the user why, and that the code ports to Remotion by swapping
the helpers for Remotion imports.

## Scene template (per line of the script)
| # | t0–t1 (s) | where | line (⟨highlight⟩) | animation on which word | transition out |
|---|---|---|---|---|---|
Fill it from timing.json before writing any component; show it to the user only if the request was ambiguous.

## Check before delivering
1. Render 6–8 stills at the busiest moments; look at them (overlaps, text overflow, safe area, legibility at phone size).
2. Every cut lands in a pause; every highlight lands within ±3 frames of its word.
3. Mouth closed during silences; no caption on screen when no one is speaking.
4. The UI labels match the source; sample data is labelled as such in your note.
5. Video length = voice length + 1–2 s end card. Audio peak ≤ −1 dBFS.
Deliver the MP4 with one line on how timing was obtained, what is sample data, and the weakest shot.

## Sources (study these)
- A-roll / B-roll and cutaways: https://www.knowlify.com/articles/a-roll-vs-b-roll · https://knowlify.com/kb/b-roll-vs-a-roll · https://www.creatoressentials.com/glossary/a-roll/
- Mascot presenters: https://videoai.me/blog/how-to-make-vox-style-explainer-with-mascot
- Kinetic typography: https://brush.ninja/glossary/animation/kinetic-typography · https://pexo.ai/tutorial/how-to-make-a-kinetic-typography-explainer-video · https://hera.video/blog/kinetic-typography-video-generator-guide · https://wyzowl.com/kinetic-typography/
- AE word highlight (Range Selector by words): https://forums.dataclay.com/post/481 · https://helpx.adobe.com/en/after-effects/using/examples-resources-text-animation.html
- Easing / Graph Editor / overshoot: https://www.ledet.com/?p=367429 · https://mtmograph.com/blogs/tools/the-bounce-and-overshoot-animation-trick-every-motion-designer-should-know · https://www.skillshare.com/classes/Animating-With-Ease-in-After-Effects/2128437497
- 12 principles for motion design: https://www.netguru.com/blog/illustrators-eye-12-principles-of-animation · https://www.fable.app/blog/12-animation-principles-every-aspiring-motion-designer-should-know · https://www.clipstudio.net/en/animation/12-principles/ · https://claudeskills.info/zh-hant/skills/dylantarre/animation-principles/video-motion-graphics/
- Character rigs & lip sync in AE: https://lesterbanks.com/?p=41702 · https://lesterbanks.com/?p=22633 · https://www.bloopanimation.com/mouth-rig-for-lip-sync/ · https://aescripts.com/learn/tnt-tuts---advanced-head-rig-in-after-effects-using-joysticks-n-sliders
- Transitions: https://schoolofmotion.com/blog/six-essential-motion-design-transitions-tutorial · https://speckyboy.com/after-effects-tutorials-transitions/ · https://www.miracamp.com/learn/video-editing/different-types-of-transitions-film
- Motion-graphics types & styles: https://www.b2w.tv/blog/types-of-motion-graphics · https://www.contentbeta.com/blog/motion-graphics-styles/ · https://www.manypixels.co/blog/motion-design/types
- Script length & structure: https://vivideo.ai/guides/how-to-write-a-video-script · https://truscribe.com/feeds/blog/explainer-video-script-template · https://agentskills.so/zh/skills/skill-zero-s-explainer-video-guide
- Simulated UI in code: https://dev.to/remocn/how-to-make-a-product-demo-video-in-react-ief · https://blog.logrocket.com/remotion-screen-recordings/
- Remotion API: https://www.remotion.dev/docs/ · https://www.remotion.dev/llms.txt · https://remotion.dev/docs/system-prompt
- Visual references to browse (stills of the style): Dribbble "SaaS explainer video" and "UI animation" tags, Behance "mascot animation", the Asana / Airtable / monday.com explainers studied in contentbeta.com above.