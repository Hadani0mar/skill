---
name: teqani-presenter
description: The default on-screen presenter of the TikTok channel «تقني» @teqani.ly — a 3D cartoon host (glasses, moustache, orange jacket) in two saved looks, holding a laptop or a phone, animated with LivePortrait from a pre-rendered pose bank (gaze camera/laptop/up, mouth shapes, blinks, smile), lip-moved from the voice-over, with Clawd (pixel Claude mascot) on his shoulder who hops up and unfolds into the floating laptop screen for the practical part. Covers the vertical layout, the calm Clawd→screen transition, word-timed Arabic captions, a designed Libyan Gemini voice, word timing, ElevenLabs SFX and the render/mix pipeline. Use for any channel video that needs a host talking to the viewer.
---

# teqani-presenter — الشخصية الأساسية لقناة «تقني»

**Status (26 Nov 2026):** the owner asked to adopt this character and its animation as the channel's
main presenter («اعتمد الشخصية وتحريكها في مستودع المهارة وخليها الاساسية»). Use it whenever a channel
video needs a host. The current brief still wins (e.g. a request for two new human characters).
Worked example: [`examples/install-as-app`](examples/install-as-app/README.md).

Read this whole file, then the example README, before building.

## 0. Two looks — choose per film (`PRESENTER_VARIANT`)

| Variant | Use when the film is about | Files | Notes |
|---|---|---|---|
| `laptop` (default) | desktop apps, coding, anything on a computer | `assets/character.jpg`, `assets/posebank/` | eyes sit behind reflective glasses → gaze reads mainly from the head tilt |
| `phone` | mobile apps, WhatsApp/TikTok/phone features | `assets/character-phone.jpg`, `assets/posebank-phone/` | made 26 Nov 2026 by editing the original with gemini-3-pro-image (ElevenLabs); blinks and pupils read clearly; the phone region is protected from LivePortrait (`protect` in `scripts/paths.py`) |

Set `PRESENTER_VARIANT=phone` for every script (render, posebank, lp). "Look down" (`L…` poses) means at the
laptop or at the phone; "look up" (`U…`) means at the floating screen. Each variant has its own face crop and
Clawd shoulder position in `scripts/paths.py`. With the phone look, the floating screen can be a phone-shaped
frame (portrait) so it mirrors what he holds.

## 1. What the owner asked for (keep these)

| Asked | How it is built |
|---|---|
| Animate the character; he looks at the viewer and his lips move | LivePortrait expression editing → pose bank; mouth driven by the voice RMS |
| He also looks at the computer / at the screen | gaze axis in the bank: camera ↔ laptop (down) ↔ screen (up) |
| A wide vertical plate; captions and animations above, he stays at the bottom | 1080×1920; face pasted into the original image, top extended with the image's own colours |
| Claude's character on his shoulder | Clawd redrawn as pixel art from clawd-pet's `static-base` grid (MIT) — crisp at every frame |
| A screen above him = reflection of his laptop | floating screen (bezel + glow) with a camera that zooms into the active UI |
| Don't show the screen at the start; he talks to the viewer first | hook = presenter only, close-up that pulls out |
| Clawd flies and turns into the screen, smooth and clear | **calm transition** (§4) — the first "pixel-block reveal with trails" version was rejected as noisy |
| Libyan voice, not Tunisian | designed Gemini voice `Teqani Libyan` (ar-LY) — ElevenLabs has no Libyan voice |
| Sound effects | six ElevenLabs SFX in `assets/sfx`, placed on visible actions, ducked under the voice |
| Strong hook / re-hooks; promote the **feature**, not the demo app | see §6 |

## 2. Files

```
assets/character.jpg          source image, laptop look (736×736, owner's character)
assets/character-phone.jpg    same host holding a phone (736×736)
assets/posebank/*.jpg         LivePortrait poses, laptop look (see names below)
assets/posebank-phone/*.jpg   the same pose set for the phone look
assets/sfx/*.mp3              impact, whoosh, typing, click, pop, counter (ElevenLabs, generated for the channel)
assets/fonts/                 Lalezar (captions), Vazirmatn (Latin/UI) + OFL licences
assets/icons/                 Claude + Apple marks copied from m0usasvg
assets/LICENSE-clawd-pet.txt  MIT notice for the Clawd grid
scripts/paths.py              all paths; PRESENTER_WORK, SCREEN_FRAMES, LIVEPORTRAIT env vars
scripts/lp.py                 LivePortrait parametric driver (no driving video)
scripts/posebank.py           renders camera↔laptop poses   (L000…L100 × M000…M100 × a/e/o, blinks, smile)
scripts/posebank_up.py        renders "looking up at the screen" poses (U050, U100)
scripts/clawd.py              Clawd pixel-art frames (blink, wave, hop, breath, eyes follow the gaze)
scripts/timeline_install_as_app.py   ONE timing file: anchors every event to a word of the voice
scripts/render.py             compositor (presenter + Clawd/screen states + captions + framing)
scripts/screen/install-as-app.html   the screen UI as a pure function render(t) with event times EV
scripts/screen/cap.mjs        screenshots the screen page per frame (2× DPR) with EV injected
scripts/mix.py                voice + SFX at event times, ducking
scripts/gemini_tts.py         Gemini 3.8 TTS through the documented `interactions` endpoint
scripts/align_pauses.py       phrase timing from the voice's pauses (Whisper fails on Libyan)
```

Pose names: `L{look*100}_M{mouth*100}_{vowel}_b{blink}_s{smile*100}` (look 0 = camera, 100 = laptop) and
`U{up*100}_M…_{vowel}_b{blink}` (up = the floating screen). The bank is already rendered: **a new film
never needs LivePortrait**; render.py only blends neighbouring poses (≈1.5 min for 45 s on 2 CPUs).

## 3. Pipeline for a new film

1. **Script** (Libyan, hook-first, §6). Keep the keywords that anchor events.
2. **Voice** — `GEMINI_API_KEY=… python3 scripts/gemini_tts.py part1.wav <voice> "<short style>" "<text>"`.
   Voice: the designed **Teqani Libyan** `voice_1nn9zk6feyri` lives in the owner's Gemini project (dies after
   1 year unused); if it is gone, recreate with `POST /v1beta/voices` (`type: prompted`, `language_code: ar-LY`,
   1–2 sentence description: man in his late twenties from Tripoli, Libyan Arabic, warm clear slightly deep voice,
   relaxed friendly delivery, calm pace). Rules from the docs: style ≤ one short phrase, no age/accent in style,
   inline tags in angle brackets (`<short pause>`, `<long pause>`), text verbatim. Generate in 2–3 parts with
   their own style, trim and join with 0.35 s gaps. Check peaks stay below −1 dBFS (the first try clipped).
   Never write the API key to a file; ask the owner to revoke it after the session.
3. **Word timing** — `align_pauses.py` splits the voice at pauses and spreads words by length. Inspect the
   printed phrase table; when a long sentence merges, pin phrase boundaries from `silencedetect` per part.
4. **Timeline** — copy `timeline_install_as_app.py`; change the `find([...])` anchors and the `EV` keys your
   screen needs. Everything (screen events, gaze, transition, captions, SFX) follows from it.
5. **Screen** — copy `screen/install-as-app.html`; build the real UI states inside `render(t)` reading `EV`.
   Dump `EV` to JSON, then `EVJSON=ev.json PAGE=my.html node scripts/screen/cap.mjs <frames> <dur> 30`.
6. **Stills first**: `SCREEN_FRAMES=<frames> ONLY=…  python3 scripts/render.py out` — check the hook frame,
   the transition, one frame per screen state, the ending.
7. **Render + mix**: full `render.py`, then `mix.py`, `loudnorm=I=-14:TP=-1.5`, H.264 CRF 21, AAC 192k.

## 4. The transition (approved direction: calm, clear)

On the line «شوف…» Clawd **hops once** from the shoulder to the screen centre (0.6 s, ease, slight arc, scale 1→2.2,
no trail). His body **flattens into a thin orange bar** while his eyes squeeze shut (0.28 s), the bar **opens
vertically into the screen** while the colour turns to the dark bezel and the glow fades in (0.38 s), then the
content fades in at 97→100 %. SFX: one soft whoosh on the hop, one pop when the bar opens. At the end of the
practical part the same steps run backwards and Clawd hops home. Do not bring back pixel-block reveals,
flashing blocks or trails — the owner called that version «سيئ… اسلوب تاني اقل تشويش».

## 5. Presenter behaviour

- Hook: camera gaze, close-up 1.22× that pulls out over 3 s, a 6 % push-in on the second line.
- During the practical part he looks **up** at the screen; on each re-hook line he turns back to the viewer.
- Mouth = voice RMS (open level) blended across mouth poses, vowels alternate a/e/o; blinks every 3–5 s;
  smile on the last line. Head gaze is the main cue: his eyes sit behind reflective glasses.
- Clawd on the shoulder: breathes, blinks, waves after landing; dark outline so he reads on the orange jacket.
- Captions: Lalezar, ≤ 3–4 words per chunk, word pop on its spoken time, accent words in Claude orange
  `#D97757`; Latin runs (Install as app) merged into one item. Previous chunk clears before the next starts.

## 6. Hook and script rules learned on this film

- Sell the **feature**, not the demo app: the first version opened on the debt-book app and was rejected
  («انت تروج للتطبيق مش للميزه»). Use a useful example (system monitor: RAM/storage/state) only as proof.
- First sentence: what the viewer can now do + where it lives («Claude توا يصنعلك برامج للكمبيوتر… ويركّبها على جهازك»).
  Second: an open loop / contrast («مش موقع، مش صفحة… برنامج بأيقونته في شريط القوائم»). Third: a promise («جملة وحدة بس»).
- Re-hook before the key click («توا… الحركة اللي ما يعرفهاش حد») and before the bonus («والأحلى؟ …»).
- End with a question for comments, no follow-begging. Only claims that are verified (date, plans, menu path).
- Libyan words only (توا، شن، ديرلي، ولّى، ببلاش). Re-check the channel ledger before reusing old endings.

## 7. Requirements

Python: numpy, opencv-python, Pillow with libraqm, ffmpeg. Screen capture: Node + puppeteer + Chrome
(`CHROME_PATH`, `NPM_TOOLS`). Only to re-render poses: PyTorch CPU + LivePortrait source
(`git clone https://github.com/KwaiVGI/LivePortrait`, weights `KwaiVGI/LivePortrait` on Hugging Face:
base_models + retargeting_models) at `$LIVEPORTRAIT`; ≈8 s per pose on 2 CPUs. LivePortrait and its weights
are not vendored here.

## 8. Performance of v4 and rules for the next film (read before scripting)

TikTok Accounts API, 26 Nov 2026 07:17 Tripoli, ~6 h after posting at 01:33 (early, overnight):
173 views · avg watch 10.4 s of 44.7 s · full watch 6.6 % · likes 16 (9.2 %) · saves 8 · shares 4 ·
comments 0 · new followers 1 · profile visits 0 · For You 90 % · followers 36 % of viewers.
Retention: 100 % → 82 % @1 s → 56 % @2 s → 41 % @3 s → 30 % @5 s → 20 % @10 s → 15 % @20 s → 14 % @30 s →
13 % @35 s → 7 % @44 s. 66 % of likes landed in the first 3 s, 24 % at 40–42 s. Owner-facing score 5.5/10.

What this means, applied to the next film made with this skill:
1. **Voice pace:** pauses ≤ 0.15 s and normal speed. The "natural relaxed pace" style plus long tags made
   the 3–5 s drop (0.7 s silence after «جهازك», slow «مش موقع… مش صفحة…»). Aim at ≈ 35 s, not 44.
   When joining TTS parts, also trim inner silences longer than 0.25 s.
2. **Hook frame:** don't leave the top half dark while he talks. Show one small result element that is not
   the screen (e.g. the «RAM 91 %» menu-bar pill popping up on «برنامج بأيقونته…»). The owner still wants
   no full screen at the start.
3. **Keep:** the practical part and the calm Clawd→screen transition lost almost nobody (20 % → 13 % over
   25 s); re-hooks neither lost nor added viewers — keep them short.
4. **Ending:** 13 % → 7 % over the last 8 s and 0 comments. After the comment question, add the channel
   ending (ت + TikTok + follow button) and suggest a pinned comment question.
5. **Posting:** not after midnight; re-read the post after 24 h (countries/reach arrive with 24–48 h delay).

END — teqani-presenter
