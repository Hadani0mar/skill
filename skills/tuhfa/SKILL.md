---
name: "tuhfa"
description: "تحفة — master motion skill: designs any motion video type by combining all motion skills (motion-storytelling, motion-reel, stageshow, khaam-motion, mascot, techno-ly, video-making) with m0usasvg logos and icons. Includes the offline phone-stage engine (60 fps / 4K) and the Nov 2026 lessons."
---

# Tuhfa «تحفة» — every motion skill, one workflow

Tuhfa is the conductor. It does not replace the other skills: it picks the right ones for the brief, gives them one
shared workflow, one asset source and one quality bar, and resolves their conflicts. Any motion type, any style.

Read this file to the end. Then read the skills the routing table names for the chosen type, in full (each has its
own reading rule: motion-storytelling and techno-ly end with an END line you must reach).

## 0. The sources

| Source | Where | Gives |
|---|---|---|
| **motion-storytelling** | `Hadani0mar/skill` → `skills/motion-storytelling` | Nine Arabic vertical styles in Remotion (منشور الورق، نبض العلامة، ختم الشعار، الكاتب الجريء، أرشيف القصة، واجهة حية، حكاية مصوّرة، عالم المنتج، عرض الهاتف), React Bits in every video, unDraw, three.js. |
| **motion-reel** | `skills/motion-reel` | App ads inside the real product, brand films (`template-brand/`), storyboard before build, stills, the director's pass, real foley, the handle on the whole film. |
| **stageshow** | `skills/stageshow` (benjitaylor/skills, MIT) | Faux product UI that reads as real: `Phone`, `Window`, `Notification`, `Thread`/`Bubble`, `Row`, `Card`, `Count`, cursor walkthroughs; framing and anti-AI-look rules. |
| **khaam-motion** | installed skill `khaam-motion` | Eight looks (editorial explainer, showreel, ASCII terminal, pixel art, one-line, risograph, Jazari notebook, ink in water) plus the user's own; hooks; Arabic typography and fonts; the three user gates; procedural/Openverse sound; deterministic canvas renderer. |
| **mascot-explainer-video** | `skills/mascot-explainer-video` | A character presents (A-roll), app UI cutaways (B-roll), one-word-per-line kinetic captions synced to a voice-over. |
| **techno-ly** | `skills/techno-ly` | Everything for the channel «تقني»: hook-first openings, the ت mark, the ending (ت + TikTok logo + handle), Libyan-dialect TTS scripts, growth playbook. Mandatory for any video posted on the channel. |
| **video-making** | installed skill | Render hygiene: one full render per request, encode per scene, rename on success, stills before render. |
| **tuhfa template** | `skills/tuhfa/template` | The offline phone-stage engine (no npm needed): React 19 + esbuild from the machine, stageshow's kit (`cp -R ../stageshow/kit kit`), m0usasvg icons/logos in `src/assets.json`, every frame a pure function of `t`, Playwright capture at any fps and scale (60 fps / 4K), numpy foley mixer. Two worked films: `src/films/notebook.tsx` (Gemini Notebook, posted) and `src/films/jahiz.tsx` (JAHIZ storyboard). Read `references/phone-stage.md` first. |

### The logos repo and the icons repo: m0usasvg (`Hadani0mar/m0usasvg`)
One repository holds both, in two separate places. They are the only source for logos and icons in any video.
- **Brand logos (مستودع الشعارات):** `public/icons/<slug>/` — about 7,600 brands. Files per brand: `default.svg`
  (full colour), `mono.svg`, `wordmark.svg`, and for some `dark.svg`, `light.svg`, `color.svg`, badges as
  `<slug>-badge/default.svg`. Examples: `whatsapp`, `facebook`, `meta`, `twitter`, `x`, `apple`, `app-store`,
  `tiktok`, `yahoo-badge`, `wikipedia`, `google`, Libyan payments when present. Use the real file; never redraw a
  logo, never a letter in a coloured square.
- **UI icons (مستودع الأيقونات):** `src/data/ui/sets/*.json` — about 1,200 glyphs (slug, tags, `nodes` on a 24 grid:
  `launch`, `social`, `agents`, `space`, `wave-2/3/4`…) with seven looks in `src/data/ui/looks/` (outline, duotone,
  fill, glass, glass-outline, depth, offset). Rendered SVGs come from `pnpm ui:build` → `public/ui/<slug>/<look>.svg`;
  offline, draw the nodes directly (the template's `glyphs.py` + `src/icons-shim.tsx` do this, and also stand in for
  `lucide-react` so the stageshow kit uses m0usasvg icons). The channel's house icon look is **duotone green**.
- **Fetching:** `git clone --depth 1 --filter=blob:none --sparse https://github.com/Hadani0mar/m0usasvg`, then
  `git sparse-checkout set public/icons/<slug> … src/data/ui`. Find a slug with
  `git ls-tree -d --name-only HEAD:public/icons | grep -i <name>`.

## 1. Route the brief

| The brief | Lead skill | Add | Engine |
|---|---|---|---|
| An ad for an app or store, inside the real product | motion-reel | stageshow (header/UI rebuilt), m0usasvg logos | Remotion (motion-reel template) |
| A brand film (airline, bank, car) | motion-reel `brand-film.md` | khaam look, m0usasvg logos | Remotion (`template-brand`) |
| A story, history or documentary («اسرد لي قصة…») | motion-storytelling style 5 (أرشيف القصة) | stageshow for any screen, khaam look, motion-reel review | Remotion, or the tuhfa engine offline |
| A tool explainer / walkthrough | techno-ly (channel) or motion-storytelling style 6/9 | stageshow walkthrough with visual scan, m0usasvg icons | Remotion |
| A list of tools | khaam `explainer-reel-system.md` | m0usasvg logos per tool, React Bits | khaam renderer or Remotion |
| A character presents the product | mascot-explainer-video | stageshow B-roll, khaam captions | Remotion |
| Kinetic typography / a statement | motion-storytelling style 4 (الكاتب الجريء) or 2 | khaam Arabic rules | Remotion or khaam |
| A logo sting / end card | motion-storytelling style 3 (ختم الشعار) | m0usasvg logo | any |
| A product launch film | motion-storytelling style 6 | stageshow, React Bits | Remotion |
| A 3D product world | motion-storytelling style 8 | khaam `cinematic-toolkit.md` | Remotion + three.js |
| Numbers, a chart, a data story | khaam editorial-explainer | stageshow `Chart`/`Count` | either |
| A news reel | motion-storytelling style 5 or 2 | real sources on screen, m0usasvg logos | either |
| A showreel / "show what you can do" | khaam `showreel` | anything | khaam renderer |
| A web hero loop or bento (not a video file) | stageshow | m0usasvg icons | stageshow kit (filmed with its `film.mjs`) |
| Any video for the channel «تقني» | techno-ly, always on top of the row above | its ending and ت mark | as the row says |

No row fits: take the closest, say which in Gate A, and offer khaam's styles or the user's own references.
Ask the style question the lead skill requires (motion-storytelling always asks which of its nine styles).

## 2. One workflow for every type

1. **Gate A — the plan, one message, in the user's language (Libyan dialect for this user).** Facts researched first,
   sources at the end of the reply. Three hooks from different khaam families, one recommended. The script as a table:
   time · on screen · picture (name the kit parts, logos and icons per beat). The look. Sound plan. Narration yes/no
   (AI Studio voice-over script for techno-ly videos). The handle. Use tappable questions, always in the user's language.
2. **Gate B — the storyboard:** 6–15 stills rendered from the real code (not mockups), labelled with numbers only.
3. **Build, review silently, Gate C:** the full film with sound, ready to post.

## 3. Engines (choose by what the machine allows)

- **Remotion** (motion-storytelling, motion-reel, techno-ly, mascot templates) when `npm install` works.
- **The tuhfa engine** (`template/`) when npm is blocked or the film is mostly UI: React 19 + esbuild from the machine
  (`/opt/npm-tools/node_modules`), stageshow's kit copied into `template/kit`, `lucide-react` aliased to `shim/`,
  each film a component `App({t})` drawn as a pure function of `t` (helpers in `src/anim.ts`), `window.__seek(t)`
  stepped per frame by `record.mjs` (any FPS, any scale), timing tables at the top of the film file, foley from
  `audio/mix.py` at the same seconds. Commands in §7.
- **khaam's canvas renderer** for pure typography, ASCII, pixel or drawn styles.
State the engine in Gate A; a style never forces an engine the machine can't run.

## 4. Rules every video keeps (the strictest of all skills)

- **Real things only:** real screens or stageshow rebuilds of them, real product photos, logos from m0usasvg, icons
  from m0usasvg, facts with sources. No invented claims, prices or users.
- **Hook:** frame 0 already shows the subject and moves; ≤ 7 words on screen; works muted; paid off (khaam `hooks.md`).
- **Arabic:** whole words, RTL, no letter-spacing, dots never clipped, Latin inside Arabic in one run, one numeral form,
  a single word alone on a line is a fault. Max two Arabic families; fonts with licences (Google Fonts, or a sparse
  clone of `google/fonts` when blocked).
- **UI (stageshow):** use the kit part, never a lookalike; design the phone at native width (~380) and scale the
  object; root `className="ss-stage"` with the brand's `--ss-accent`; fill every screen (real rows, then quiet filler);
  3–7 real strings per screen; stamps and badges never cover a name.
- **Ground:** white by default (motion-storytelling, techno-ly) unless the chosen style sets its own (archive paper,
  dark showreel…).
- **Sound:** a sound only where something visible happens; no bubble, ding, spring, riser; no music unless asked
  (techno-ly's soft music bed is the channel's exception); voice on top, effects ducked; about −14 LUFS.
- **Identity:** the creator's handle small on the whole film; channel videos end with the ت mark + TikTok logo + handle
  and never beg for follows; real companies get «فيديو غير رسمي» and sources on the end card.
- **Render hygiene (video-making):** stills before any full render, one full render per request, write to a temp
  name and rename on success, deliver a light encode (H.264, CRF 22–24, ≤ 12 Mb/s, AAC 192k, faststart) and keep the master.

## 5. Review (one pass for every type)

From the final file: a contact sheet (2 fps), a strip around the fastest move, a 360-px phone test. Score 1–10: the
first 2 s, readability on a phone, motion, composition, brand accuracy, Arabic joining, sound sync. Hunt: a word
alone on a line, a covered name, an empty band on a screen, an off-model or redrawn logo, a cut flash that floods
the frame, text swapping inside a moving shape, a hold with nothing moving. Fix the three worst, re-render, look
again. Scores find faults; only the user approves. Then the lead skill's own checklist.

## 6. Stageshow inside a film (lessons from the first build)

- **Design the phone at its native size and scale the object:** `<Phone width={380}>` inside a wrapper with
  `transform: scale(1.4–1.6)`. A 520-wide Phone renders iOS-size content that is unreadable at 1080.
- **Tokens need a stage:** give the root `className="ss-stage" data-theme="light"` and set `--ss-accent` to the
  brand colour, or bubbles and accents come out blank.
- **Fill every screen** (stageshow: no void under a list): real rows first, then quiet filler rows (a disc + two
  bars of varying width); a chat gets a header, older filler bubbles and a composer; a home screen a full grid and dock.
- **Readable at phone size:** inside the phone use CSS `zoom` (1.3–1.6) on the content block that carries words.
- **Restyle, don't rebuild:** bubbles, cards and rows are the kit's, recoloured with a scoped `<style>` (e.g.
  WhatsApp's `#d6f3bd` sent bubble), never replaced with a lookalike div.
- **Stamps never cover a name:** place them on the card's free corner, and check in a full-size still.
- **The phone's era:** the kit has modern frames only. Say so in the plan when the story is older than the device.
- **Arabic captions:** the `Caption` component pops words right→left, one span per word; a line that mixes Latin
  (`What's up`) goes in one run (`whole`) so bidi orders it; no guillemets around Latin inside Arabic (they flip).

## 7. The tuhfa engine, step by step (the real files)

```
cd skills/tuhfa/template && cp -R ../../stageshow/kit kit
export ESBUILD_MAIN=/opt/npm-tools/node_modules/esbuild/lib/main.js NODE_GLOBAL=/opt/npm-tools/node_modules \
       PLAYWRIGHT=/opt/npm-tools/node_modules/playwright/index.mjs        # or a normal npm install
FILM=notebook node build.mjs                                            # src/films/<FILM>.tsx → dist/
node record.mjs stills 0,2,5.5,13,23.8,37                               # out/stills/t<sec>.png (2x) → Gate B
FPS=60 DSF=4 STEP=2 OFF=0 node record.mjs frames 0 37.56 out/f4k &      # 2160×3840, two workers
FPS=60 DSF=4 STEP=2 OFF=1 node record.mjs frames 0 37.56 out/f4k & wait
python3 audio/mix.py                                                    # → out/nb8_raw.wav
ffmpeg -i out/nb8_raw.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -ac 2 out/mix.wav
ffmpeg -framerate 60 -i out/f4k/f%05d.jpg -i out/mix.wav -c:v libx264 -preset veryfast -crf 20 -maxrate 32M -bufsize 64M \
       -pix_fmt yuv420p -profile:v high -level 5.2 -r 60 -c:a aac -b:a 192k -shortest -movflags +faststart out/tmp.mp4 \
       && mv out/tmp.mp4 out/film_4k60.mp4
ffmpeg -i out/film_4k60.mp4 -vf scale=1080:1920:flags=lanczos -c:v libx264 -crf 18 -maxrate 16M -bufsize 32M -r 60 \
       -c:a copy -movflags +faststart out/film_1080p60.mp4
```
- **Stage:** 540×960 CSS px. `DSF=2` gives 1080×1920, `DSF=4` gives 4K. `record.mjs` loads the fonts before the first frame.
- **A fix after the full render:** re-capture only the changed time ranges into the same frame folder (same names overwrite), remix, re-encode. A 13 s fix at 4K60 took ~4 min on 2 CPUs; the full 37 s film ~9 min.
- **Timing:** `scripts/silences.sh voice.wav` (ffmpeg silencedetect) gives the phrase boundaries; put them in the film's `T` and `HEAD` tables. No ASR needed.
- **Sound:** `audio/mix.py` reads `audio/voice.wav`, places the channel's Kenney SFX (`skills/techno-ly/template/assets/audio/sfx`, override with `SFX=`) at the same seconds as the picture events, adds a procedural noise whoosh on cuts, ducks effects under the voice; then loudnorm to −14 LUFS. No music.
- **Assets:** `scripts/fetch-assets.py <m0usasvg> <icon,icon,…> <key=slug,…>` writes `src/assets.json`; logos are used by key (`pdf`, `word`, `sheets`, `yt`, `gh`, `tt`, `nblm`, `goo`…).

## 8. Lessons from November 2026 (full log in `references/phone-stage.md`)

- **One stage, one device at a time.** The 3D «عالم المنتج» version of the Gemini Notebook film was rejected as «مشتت جدا»: too many worlds, cameras and cuts. The approved version keeps one phone in the centre for the whole film; everything happens on its screen or flies in and out of it.
- **The voice line is the headline.** Above the phone, ≤ 6 words, blur-in word by word, one keyword in colour (green = what the tool gives you, red = the pain). It replaces bottom captions.
- **A numbered step counter (١–٤)** over the feature section keeps people watching to the end.
- **Out-of-phone cards** (the cited page, the podcast player, the mind map, the quiz) scale out of the phone's centre and leave faster than they came.
- **A hero object travels** (the ticket ٤٧ in JAHIZ, the source files in Notebook) and ties the shots together.
- **Restraint:** one strong effect per beat, a visual change every 1–2 s, exits faster than entrances, idle breathing on the phone, cut flashes at ≤ 50 %.
- **Facts on screen are researched and true.** Gemini Notebook accepts Word, PDF, Google Sheets and YouTube but not Excel directly, so the film shows Google Sheets. Example data inside the screens is called example data in the plan.
- **The user's standing preferences:** Libyan dialect; no music (voice + SFX only); no «فيديو غير رسمي»; no comment request when he says so; handle `@teqani.ly`; deliver 60 fps (4K master plus a 1080p copy; TikTok accepts 4K but plays 1080p).

END OF SKILL — tuhfa