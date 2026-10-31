---
name: "motion-storytelling"
description: "موشن السرد القصصي: فيديوهات موشن عمودية عربية بـRemotion بسبعة أساليب (منشور الورق، نبض العلامة، ختم الشعار، الكاتب الجريء، أرشيف القصة، واجهة حية، حكاية مصوّرة) بمكونات وأصوات React Bits ورسومات unDraw، بخلفية بيضاء افتراضياً، ويسأل عن الأسلوب في كل مرة."
---

# موشن السرد القصصي — Motion Storytelling (Remotion)

Vertical (9:16) Arabic motion videos built in Remotion and rendered to MP4, with React Bits backgrounds, effects
and sounds in every video. Seven house styles, defined below as written specs (not clips to copy).
Style 1 is a narrator-led explainer where a character tells the story in a typed speech bubble beside app screens
rebuilt from the product's source; styles 2–4 are kinetic brand / typographic formats; style 5 is a researched
documentary reel about a person, company, tool, story or event, built from verified facts and the subject's real
visual identity; style 6 is a modern product launch film built from the app's real UI; style 7 is an illustrated
story with vector characters (unDraw) that build themselves piece by piece. First made for «المتمكن» (almutamakkin-expo-v3).

## ★ Global rule — React Bits in every video, every style
Every video this skill makes — whatever the style — is built with React Bits (section 13):
- **Sound:** all cues come from the React Bits sound library rendered to WAV (13b): transitions, typing, reveals,
  highlights, numbers, impacts, the ending, and a quiet bed. Synthesised numpy sound is a fallback only when the
  React Bits checkout is unavailable — say so in the delivery note if it happens.
- **Visuals:** at least one React Bits background or effect per video (ported frame-driven, 13a), plus React Bits
  text animations / components wherever the style has text reveals, counters, lists, cards or logos. Tint
  backgrounds to the video's palette (brand colour, style accent). Keep the style's own look on top; React Bits
  supplies motion, texture and depth, not a new identity.
- Pick pieces from the React Bits line in each style section and 13c; read the component's `.jsx` before porting.
- Keep `public/sfx/REACT-BITS-LICENSE.md` (copy of the repo LICENSE) in every project that uses them.

## ★ Global rule — white ground by default
- Every video starts on a **white ground `#ffffff`** (backgrounds, cards behind text, empty frames) unless:
  1. the user names a background colour for this clip → use it everywhere the white would have been; or
  2. the chosen style defines its own palette (styles 1–7 below) → the style keeps its colours, grounds included.
- Freestyle, invented or "you choose" looks, and any new style added later, default to white too; text then defaults
  to near-black `#141413`, and the accent comes from the subject's brand.
- React Bits backgrounds on a white ground: use light variants (low opacity, multiply/soft tints of the accent) so the
  ground still reads white. Say in the delivery note which ground was used and why.

## ★ Step 1 — always ask which style (every time, before anything else)
Ask with AskUserQuestion (header «الأسلوب»), even if the user used a style last time. AskUserQuestion takes at most
four options: offer the four that fit the request best (default: 1, 5, 6, 7 for a product/app; 2, 4, 6, 5 for a
brand or statement) and name the others in the question text (style 3, Logo Sting, is an add-on ending; the user
can pick any unlisted style via "Other"). If the user explicitly says "you choose", pick a style they have
not used yet and say which one in the first sentence. If the request itself names a story/person/company to tell
about ("اسرد لي قصة …"), that is style 5 — say so and start.

| # | الاسم | English | One line |
|---|---|---|---|
| 1 | **منشور الورق** | Paper Post | Narrator character + typed speech bubble, warm paper, black Plex Arabic, yellow marker, app screens. 60–75 s explainer. (sections 2–12) |
| 2 | **نبض العلامة** | Brand Pulse | Dark kinetic brand reel: grid floor, problem chips into a bin, liquid wipe to "clarity", orbit rings with neon-green line icons, pen-stroke words, waveform reveal. 15–25 s. (Style 2) |
| 3 | **ختم الشعار** | Logo Sting | 3–5 s end card: two-tone punch word with a bouncing dot, then logo build + tagline + contact lines typing. Standalone or appended to any style. (Style 3) |
| 4 | **الكاتب الجريء** | Bold Typer | Grey studio gradient, huge black Arabic typed with a block cursor, paragraph fade-in/out, lime pill "punch" word, full-screen blue card. 8–15 s. (Style 4) |
| 5 | **أرشيف القصة** | Story Archive | Researched documentary reel about a person, company, tool or event, built from verified facts and the subject's real visual identity (official logo, colours, product): hook → origin → turning point → proof → lesson/CTA. 30–40 s. (Style 5 — research first) |
| 6 | **واجهة حية** | Live UI | Modern launch film: dark stage with a dot grid and moving spotlight, the app's real UI in a 3D phone, then features fly into a bento grid and come alive one by one, pull-back, logo on Aurora. 30–40 s. (Style 6) |
| 7 | **حكاية مصوّرة** | Illustrated Tale | Storybook chapters: unDraw characters that build themselves piece by piece, recoloured to the brand, page-turn transitions, captions on cards, app UI cut-ins. 45–60 s. (Style 7) |

Then ask (same call, only if unknown) whether to include the narrator character: default **yes** for style 1,
**no** for 2–5 (in 2–5 it can appear small in a corner or only in the opening/closing beat).
Styles share the build pipeline (sections 3, 3b, 7, 8, 9, 10, 11, 13); only the look, scene grammar and timing change.

## 0. Template and character
The ready project lives in **`template/`** next to this file (in the GitHub repo Hadani0mar/skill; elsewhere it may arrive as `motion-storytelling-template.zip`) (fonts, icons, narrator image, all components,
offline renderer). If it is not in the session, ask the user to attach it (or their own character image);
unzip into a new folder and edit `src/theme.ts` + `src/scenes/*` for the new story.

## 1. Inputs (ask only what is missing)
1. **Story / product** + the one sentence the viewer must remember.
2. **Source of truth for UI** — repo + folder. Read the latest branch with recent commits, not only `main`
   (`git ls-remote --heads origin`, then `git fetch --depth 1 origin <branch>`). Take labels, tabs, section
   titles and colour tokens from the code. Names/numbers you invent are sample data and must be called so.
3. **Character** — the user's own image, or the default narrator (appendix A); optional in styles 2–5. Never a known copyrighted character.
4. **Reference posts** (optional) — match their font, palette and chrome; otherwise use the chosen style's defaults.
5. Format: 1080×1920, 30 fps (60 fps on request: twice the frames and render time; see section 10); length per style
   (1: 60–75 s, 2: 15–25 s, 3: 3–5 s, 4: 8–15 s, 5: 30–40 s, 6: 30–40 s, 7: 45–60 s). Narration language/dialect (default: the user's dialect).
6. Styles 2/3: logo file, tagline, contact lines, 3–4 pillar words. Style 4: the question + answer text, punch words.
   Style 5: only the subject (person / company / tool / story / event) + the angle or lesson the user wants; Claude does the research.

## 2. Style 1 — منشور الورق (Paper Post): visual language
| Element | Spec |
|---|---|
| Background | warm paper `#f3f2ee` + static feTurbulence grain (opacity .3) + soft white radial glow |
| Type | **IBM Plex Sans Arabic** (OFL) — Bold 700 headlines, Light/Regular body, Medium 500 bubble text |
| Highlight | one phrase per line on a yellow marker `#ffc95c` that swipes in right→left (0.35 s) once typed |
| Divider | thin "hook line": `M2 4 H{w} L{w-20} 22` stroke 3, drawn with dashoffset under every title |
| Chrome | handle on top centre (36 px); bottom row: green heart `#22b97c`, send icon, «شارك المنفعة», bookmark |
| Cover | icon in a rotating dashed ring + three 130 px lines, middle one on the marker, kashida allowed (المتمـــكن) |
| Text post | right-aligned bold title + light body typed, hook line below |
| App cut-aways | cards in the product's real tokens (radius 30, 2 px border, soft shadow, coloured right accent bar) — floating, no phone frame |
| React Bits | Noise (paper grain) over the paper; Counter/CountUp for numbers; AnimatedList / SpringCheck for lists; StarBorder or BorderGlow on the focused card; GradualBlur at the screen edges; sounds `keycap`/`thock` (bubble typing, every 2nd grapheme), `sweep`/`swish` (scene cuts), `glimmer` (marker swipe), `dot`/`notch` (cards), `chime` (outro) |

Identify a reference font by rendering candidates next to a crop of the reference (Playwright screenshot)
and comparing letter shapes (ق ي ح ة). Arabic fonts from google/fonts via sparse clone:
`git clone --depth 1 --filter=blob:none --sparse https://github.com/google/fonts && git sparse-checkout set ofl/ibmplexsansarabic`.

## Style 2 — نبض العلامة (Brand Pulse) — dark kinetic brand reel
**Feel:** agency showreel; fast, confident, one word per beat; problem → clarity → pillars → payoff.
**Palette:** near-black `#1e1e1e` with a faint 1 px grid (`#2e2e2e`, ~70 px cells, slight perspective/vignette);
pure black `#000` for orbit/finale; neon lime-green `#8cc63f` (light tint `#e6fdc8` for highlight boxes);
white `#fff`; studio grey gradient `#d1d1d1→#c5c6c4` for the "clarity" scene.
**Type:** geometric sans (Latin: Poppins Regular/Bold; Arabic: IBM Plex Sans Arabic or Alexandria). Lowercase,
mixed weights in one line ("come **alive**"), italic-bold for the key word. No narrator bubble by default.
**Scene grammar (≈20 s):**
1. *Title smash* (0–1.5 s): two-word title, top word green bold, bottom white light, printed on a black card that
   tilts in 3D and flies away into the grid floor (rotateX ~55°, scale → 0.1, translateZ) revealing the grid.
2. *The problem* (1.5–5 s): a white circle with a line-art trash bin pops (lid wobble + 3 motion strokes).
   Problem chips drop in one by one above it, stacked and slightly rotated (±3°): white pill, green pill,
   white pill (rounded 14 px, soft shadow, 28 px text). They then fall into the bin.
3. *Turn* (5–6 s): a green star slams down; a grey **liquid/gooey blob wipe** (SVG path morph or blurred metaball
   mask) floods the screen from the top.
4. *Clarity* (6–8 s): grey studio gradient; three centred lines "Then / *clarity* / enters." — the key word gets
   a lime highlight box that grows from a green **cursor arrow** which clicks it (scale 0.9 press); the whole
   block scales up 1.4× (push-in).
5. *Pillars* (8–12 s, ~1 s each): black, a huge glowing ring (radial gradient white→transparent) offset to the left,
   2 concentric thin white orbits with 4–6 white dots travelling along them; centre icon in **green line-art**
   (tag/BRAND, move-arrows, open book with stars, award ribbon …); a single word set **vertically** (rotated −90°)
   on the right: Identity → Movement → Story → Recognition. Between pillars the whole orbit rotates ~40°.
6. *Pen line* (12–14 s): a green ball drops and its trail draws a curvy stroke; words "This / is / where" pop in
   one at a time on the stroke's bounces (each word lands slightly off baseline, then settles).
7. *Waveform* (14–15.5 s): dark-green vertical capsules (audio bars) pulse; the word "BRAND" appears in a glitch/
   slice reveal (letters offset in horizontal strips, then snap).
8. *Payoff* → hand over to **Style 3 (Logo Sting)**.
**Motion rules:** hard cuts or liquid wipes only; snappy springs (damping 10–12) with overshoot; camera push-ins;
nothing static for more than 0.5 s; icons = green outline strokes drawn with dashoffset.
**React Bits:** Galaxy / Threads / Beams / LightRays behind the pillars and payoff (tinted to the accent), MagicRings or
Orb instead of the hand-made glow ring, GlitchText for the glitch reveal, ElectricBorder on the problem chips, MetaBalls
for the liquid wipe if it ports cleanly; sounds `braam` (title), `slam`/`stamp` (star), `whip`/`swoop` (cuts),
`thunder` or `zap` (glitch), `reveal` (payoff), `nebula`/`dread` bed.

## Style 3 — ختم الشعار (Logo Sting) — 3–5 s end card
**Feel:** clean payoff + contact card. Black `#000`, lime-green `#8cc63f`, white.
1. *Punch word* (0–1.6 s): two words centred, first light green, second bold white ("come **alive**").
   A green dot bounces in from above, lands as the full stop, rebounds once; a green cursor arrow flicks past;
   then the bold word recolours white→green (left→right wipe) and the dot drops away.
2. *Logo build* (1.6–2.6 s): logo symbol slides/rotates in from the left, the wordmark wipes in left→right behind
   a mask, sub-line (e.g. «DIGITAL SOLUTIONS» / tagline) fades up.
3. *Tagline*: one line above the logo; the first word gets a hand-drawn green ellipse drawn around it (dashoffset).
4. *Contact lines* (2.6–4 s): 2–3 centred lines (email, site, phone) **type out** left→right in white, staggered
   0.15 s; hold ≥ 1 s at the end.
Use it standalone (brand outro) or append to styles 1, 2, 4 or 5. Ask for logo file + tagline + contact lines.
On black, recolour a dark logo to white (keep accent colours) — the user's own logo only; third-party logos stay as published.
**React Bits:** ElectricLogo or a ShinyText-style sheen over the logo (overlay only), StarBorder around the contact block,
a faint Orb/LightRays behind; sounds `punchline` (dot lands), `emblem`/`herald` (logo), `keycap` (contact lines), `finale`.

## Style 4 — الكاتب الجريء (Bold Typer) — typographic explainer
**Feel:** a definition / statement typed live; minimal, loud type, two colour punches.
**Palette:** studio grey gradient (light centre band `#f3f3f3`, darker grey `#b2b2b2–#cacaca` towards top and
bottom, like a seamless backdrop); black text `#111`; electric blue `#004afd`; acid lime `#d8ff1a`.
**Chrome:** small circular logo badge (blue disc, 70 px) top-left; website/handle small at the bottom centre.
**Type:** heavy geometric Arabic, centred, tight leading (1.05): Alexandria 700–800 (or Tajawal/Cairo Black);
Latin: bold grotesk for "I CAN HELP!" and a condensed family (Barlow Condensed Regular/Bold) on the blue card.
Alexandria can draw a word-final ي without dots in some contexts — check the stills and reword if needed; give
masked lines `paddingBottom: 0.9em` so Arabic descenders and dots are not clipped.
**Scene grammar (≈10 s):**
1. *Question* (0–1.6 s): big two-line question (e.g. «ماهو / التسويق», 120 px, wide spacing) typed letter by letter
   with a **solid black block cursor** (a rectangle the height of the line) that moves ahead of the text;
   later it is deleted back the same way (backspace), block cursor eating the letters.
2. *Answer paragraph* (1.6–4.2 s): the full definition (6–10 short lines, 64 px) appears as a block: opacity
   0→1 while colour goes light grey→black (no per-letter typing); holds ~2 s; then fades back to grey and out.
3. *Punch* (4.2–5.6 s): "I CAN" in black + an acid-lime rounded pill that grows from the left and reveals
   **HELP!** inside it; exit = text slides up behind a mask line.
4. *Blue card* (5.6–7 s): hard cut to full-screen blue; two lines in white condensed type ("Social Media" regular /
   "**Management**" bold) slide up line by line from a mask; badge turns white.
5. Loop or chain the next question (repeat 1–4 per idea); end with Style 3 if a logo is wanted.
**Motion rules:** text reveals by typing, masks or opacity — no bouncing; cuts are hard; timing is metronomic
(every beat ~1.3–1.6 s). Arabic typing uses the grapheme typewriter (section 7) with the block cursor.
**React Bits:** TextType (cursor behaviour), DecryptedText/Shuffle for Latin punch words, Noise at low opacity on the
grey studio, Grainient or GradientBlinds (very subtle, blue) on the blue card, SpringCheck for lists; sounds
`keycap`/`thock`/`tab` (typing and backspace), `stamp` (hard cuts), `snap`/`notch` (pill grows), `whip` (blue card).

## Style 5 — أرشيف القصة (Story Archive) — researched documentary reel
**Purpose:** the user names a person, company, tool, story or event; Claude researches it, gathers its real
visual identity, and designs a 30–40 s documentary reel that tells the story and lands one lesson. The reference
clip taught the *method* — act structure, pacing, editorial tone — not a layout to copy. Every video should look
like the subject's own world (its colours, logo, product, era), not like the reference.

### 5a. Research (before any design)
1. Clarify only if the subject is ambiguous. Otherwise start.
2. WebSearch 8–15 queries (Arabic + English), WebFetch the best 3–5 pages; prefer primary/reputable sources.
3. Write `research/facts.md`: who/what, 4–6 dated milestones, the turning point, one short quote (≤ 15 words,
   exact wording verified), 2–3 concrete numbers/examples, the lesson. Each line ends with its source URL.
   Anything unverified stays out. Send the user the fact sheet in one short message, then keep building.
4. Deliver with a "Sources" list in the reply. Paraphrase; never paste long passages.

### 5b. Visual identity & real assets (gather alongside the research)
- **Brand kit file** `research/brand.md`: official logo(s), primary/secondary colours (hex), typeface if public,
  product look (UI colours, key screens), era cues. Read colours from the brand/press page or official repo
  (CSS variables, `tailwind.config`, design tokens, the official logo SVG) rather than guessing.
- **Where real assets come from (in order):**
  1. The subject's own **official brand / press-kit assets** (logo SVG/PNG, product shots, wordmark). Many
     companies keep them in their public GitHub repo — fetch with a sparse/blobless clone and
     `git ls-tree -r --name-only HEAD | grep -iE "brand|logo|press"` (e.g. Supabase:
     `apps/www/public/brand-assets/*.svg`). Follow the brand guidelines (clear space, approved colour variants
     only, no distortion).
  2. Official product imagery from the same official sources (screenshots, marketing images) for editorial use.
  3. Files the user attaches.
  4. Otherwise draw: typographic logos (name in the brand colour/typeface), SVG illustrations, React Bits effects.
  The shell can usually reach GitHub only (WebFetch reads pages but cannot save image files); if an official
  asset is not reachable, say so and ask the user to attach it.
- **People:** Claude does not download photos of real people from the web or place them in videos. For a person,
  use photos the user supplies (and confirms they may use), a silhouette, or a typographic portrait (name +
  dates + a signature quote). Say this once, plainly, when the subject is a person.
- Use real logos only as the subject's own identity in an editorial story about it; never imply endorsement,
  and don't redraw or alter a logo — use the official file or the plain name.

### 5c. Structure (adapt freely; keep the logic)
1. **Hook (0–4 s):** the subject's world in one image — logo/product reveal on its brand colour, or a year/number.
2. **Origin (4–12 s):** the problem/era; a dated beat or two; one human detail.
3. **Turning point (12–18 s):** the one decision or event, shown as a document/page/screen with the key
   phrase highlighted, or a before → after.
4. **Proof (18–26 s):** 2–4 numbers or milestones on a timeline/counter (CountUp, Counter, SplitFlapText…).
5. **Lesson + question / CTA (26–35 s):** one sentence the viewer keeps, then a question or call to comment.
**Look:** build the palette from `brand.md` (brand colour as accent on a neutral or dark ground); one display face
+ IBM Plex Sans Arabic for Arabic; a React Bits background tinted to the brand colour behind 1–2 acts
(section 13); film grain/Noise overlay for the archive feel when the story is historical.
**Motion:** cinematic — slow push-ins, rack focus, light leaks, precise line drawing, clean cuts; nothing bouncy.
**React Bits:** Silk / DarkVeil / LightRays / Topography tinted to the brand colour, Noise for archive grain, BlurText
for headlines, Counter/CountUp/SplitFlapText for numbers and dates, ShinyText sheen over the official logo (overlay
only), LogoLoop for partner/customer logos the subject publishes.
**Sound:** React Bits sounds — `suspense`/`nocturne` bed, `braam`+`reveal` on the logo, `swish` on camera moves,
`thock` when a highlight lands, `stamp` on the turning point, `tickertape`/`counter` on numbers, `emblem`+`chime` at the end.
**Documents & newspapers:** when dates/events are shown as a page (newspaper, report, blog), set them as real
paragraphs (Amiri/serif, justified, kicker + headline + body per item), let the camera travel down the page and
stop on each item, then sweep a highlighter (brand colour at ~55% or `#f6e94b`) over the date/event phrase with
`background-image: linear-gradient(to left, C p%, transparent p%)` + `box-decoration-break: clone` so it survives
line wraps. Give each item its own height so asides (screenshots, before/after boxes) never overlap the next item.
Use an invented masthead name — never imitate a real newspaper's name or design.

## Style 6 — واجهة حية (Live UI) — modern launch film
**Feel:** a premium tech launch; calm, precise, the product is the hero. No shakes, no flashes, no shouting type.
**Palette:** the app's own **dark theme tokens** (read them from the code) on a deeper stage (`#0c0b0a`-ish); one accent
(brand primary) plus a soft gradient of it for key words; status colours only inside the UI.
**Type:** a modern geometric Arabic for headlines (Readex Pro 500–700, tight tracking) and the app's own UI font inside
the screens. Headlines short (≤ 7 words), one per beat, BlurText reveals; key word in GradientText.
**Scene grammar (≈35 s):**
1. *Intro* (0–2.3 s): dot-grid field fades in under a spotlight; two-line promise («إدارة محلك، / بشكل جديد.»), second line gradient; a thin light line draws under it.
2. *Phone* (2.3–8.3 s): a phone (rounded 72 px, island) turns in from rotateY 38° to −8°; its screen is the app home rebuilt from the code (search, 4 stat cards, a short list, tab bar), items stagger in. Headline: one line about "all of it on one screen".
3. *Bento* (8.3–24 s): cards fly out of the phone into a 2-column bento grid (varied heights, 24 px gaps, radius 34, gradient surface). Each card first shows the app's **skeleton** state with a moving shimmer; then the spotlight moves to it, a rotating conic-gradient border lights it (StarBorder), the others dim to ~40 %, the headline swaps, and the card plays its feature (chips pop, bars drain, counters count, barcode draws and prints, a switch toggles, a chat question types and the answer streams). ~2 s per card.
4. *Pull-back* (24–29 s): the whole grid tilts back (rotateX ~32°, scale ~0.64) with a light sweep across it; «كل شي. / في تطبيق واحد.»
5. *Finale* (29–35 s): Aurora in brand colours rises, the logo mark draws, wordmark resolves from blur, tagline, a status pill (e.g. "connected to your system").
**Motion rules:** springs with no overshoot beyond 3 %, camera moves by easing (inOut cubic), everything staggers 4–6 frames; one focal animation at a time.
**React Bits:** DotGrid-style field + Spotlight, BlurText, GradientText, CountUp, StarBorder/BorderGlow beam on the focused card, Aurora for the finale; sounds `velvet` (intro), `swoop`/`sweep`/`glide` (camera), `notch`/`dot` (items), `focus` (card focus), `tink`/`snap`/`check`/`popover` (UI), `counter`/`data` (numbers), `keycap`/`tab` (chat typing), `halo`+`emblem` (logo), `calm` bed.

## Style 7 — حكاية مصوّرة (Illustrated Tale) — storybook chapters
**Feel:** a friendly picture book that explains a feature; warm, clear, human.
**Palette:** the brand palette on light grounds (white by default, a cream or blush tint per chapter), dark chapters in the brand ink for contrast; illustrations recoloured to the brand primary.
**Type:** Readex Pro (or the brand font) 700 headlines, 400 captions; the app font inside UI cards.
**Scene grammar (≈60 s):** 7–9 chapters, ~6–9 s each: hook (characters + role chips) → problem (illustration in a cream "page frame" on a dark chapter, warning chips fly out) → turn (big word on a React Bits background) → 4–5 how-it-works chapters (headline + real UI card from the code + illustration + caption card + toast) → outro (team illustration + logo + tagline). Chapter tag pill with number at the top, progress dots, caption card at the bottom.
**Transitions:** each chapter is a page that rises from the bottom with rounded top corners while the previous one shrinks and darkens.
**Illustrations:** unDraw (section 3b), built piece by piece (each top-level SVG element pops with a spring, 1–1.6 frames apart), then a slow float. On dark chapters put them on a cream card: unDraw's ink `#2f2e41` disappears on dark.
**React Bits:** Silk/Aurora on the turn chapter, BlurText captions, CountUp, Noise grain; sounds `unfold`+`swish` (page turns), `glimmer` (illustration builds), `blop`/`bubble` (chips), `keycap` (typing), `popover`/`tab`/`ding`/`ping` (UI), `stamp` (turn), `wand`+`emblem` (outro), `calm` bed.

## Adding a new style from a reference video
When the user sends a reference clip for a new style:
1. Probe it (`ffprobe` duration/size/audio), then contact sheets: whole clip at 1 fps (`fps=1,scale=180:400,tile=10x4`)
   and dense sheets (2.5–4 fps, cropped to the content area) for the busy parts. Sample the palette with PIL
   (quantize a crop of key frames). Identify fonts by rendering candidates next to a crop.
2. Name it in Arabic + English, then write it as a spec in the same format as styles 2–5: **Feel / Palette / Type /
   Scene grammar with timings / Motion rules / React Bits picks (visuals + sounds)** — the idea and method, never a
   frame-by-frame copy, and no copying of the reference's brand, logo or text.
3. Add it to the Step 1 table (only four can be options; list the rest in the question text), to 13c and 13d, and to
   Sources (as "Style N reference"). A new style defaults to the white ground unless its spec says otherwise.
4. Propose the updated SKILL.md to the user (full file) for saving.

## 3. Icons — real illustrated UI icons, never emoji
- **Primary: Microsoft Fluent UI System Icons — Color** (`fluent-color`, MIT, ~199 icons: database, cloud,
  laptop, phone, people, person-available, person-key, building, building-store, receipt, coin-multiple,
  savings, bot-sparkle, megaphone-loud, alert, calendar-clock, search-sparkle, scan-type, shield-checkmark,
  lock-shield, data-trending, image, pin, checkmark-circle, star, add-starburst, lightbulb-filament,
  chat-bubbles-question …). Style 2 uses single-colour green line icons instead (draw them as SVG strokes).
- **Gap fillers:** Icons8 Flat Color (`flat-color-icons`, MIT: package, print, shop, picture, sales-performance);
  Streamline Color / Plump Color (CC BY 4.0 — credit Streamline in the video description).
- Do **not** use Fluent Emoji / Apple / Noto emoji sets: they read as emoji, not product icons.
- Get the JSON from Iconify without npm:
  `git clone --depth 1 --filter=blob:none --sparse https://github.com/iconify/icon-sets && git sparse-checkout set --no-cone /json/fluent-color.json /json/flat-color-icons.json`.
- Extract only the icons used into `src/icons.json` (try `name-48, -32, -28, -24, -20, -16`; store `{body, w, h}`),
  render as inline SVG and **prefix gradient ids per instance** (Fluent Color gradients collide otherwise).

```tsx
// src/components/Icon.tsx
import icons from '../icons.json';
let n = 0;
const prefix = (b: string, p: string) => b.replace(/id="([^"]+)"/g, (_, i) => `id="${p}${i}"`)
  .replace(/url\(#([^)]+)\)/g, (_, i) => `url(#${p}${i})`).replace(/href="#([^"]+)"/g, (_, i) => `href="#${p}${i}"`);
export const Icon = ({name, size = 96}: {name: keyof typeof icons; size?: number}) => {
  const ic = (icons as any)[name]; const p = React.useMemo(() => `i${(n++).toString(36)}_`, []);
  return <svg width={size} height={size} viewBox={`0 0 ${ic.w} ${ic.h}`} dangerouslySetInnerHTML={{__html: prefix(ic.body, p)}} />;
};
```

## 3b. Illustrations — unDraw vector library (link it, never clone it whole)
Source: **https://github.com/balazser/undraw-svg-collection** — about 1,360 unDraw SVGs in `svgs/<name>.svg`, MIT repo of
unDraw art (free, no attribution required). Flat characters in the Storyset family; the primary colour is
`var(--primary-svg-color)`, so one replace recolours a whole illustration to the brand. Do not vendor the repo into a
project or skill: list names, fetch only the files you use.
1. **List the names** (no file contents downloaded):
   `git clone -q --depth 1 --filter=blob:none --no-checkout https://github.com/balazser/undraw-svg-collection /tmp/undraw && git -C /tmp/undraw ls-tree --name-only HEAD svgs/ | sed 's#svgs/##; s#\.svg$##' > /tmp/undraw-names.txt`
   (GitHub API alternative: `gh api "repos/balazser/undraw-svg-collection/git/trees/HEAD?recursive=1" --jq '.tree[].path'`.)
2. **Search** with English keywords and synonyms; names are kebab-case scenes:
   `grep -iE "team|people|co-work|meet" /tmp/undraw-names.txt`. Useful families: people/teams (`people`, `team`, `team-spirit`,
   `co-workers`, `selecting-team`, `meet-the-team`), access (`login`, `mobile-login`, `secure-login`, `access-denied`, `unlock`,
   `two-factor-authentication`, `switches`, `settings`), sharing (`share-link`, `message-sent`, `inbox`), money/shop
   (`finance`, `wallet`, `business-shop`, `online-shopping`, `successful-purchase`, `printing-invoices`), stock/logistics
   (`heavy-box`, `deliveries`, `delivery-truck`, `order-delivered`, `checklist`), success (`done`, `verified`, `well-done`).
3. **Fetch only the chosen files:** `git -C /tmp/undraw sparse-checkout set --no-cone svgs/team.svg svgs/login.svg && git -C /tmp/undraw checkout -q`
   (or `curl -sL https://raw.githubusercontent.com/balazser/undraw-svg-collection/HEAD/svgs/team.svg` where raw GitHub is reachable).
4. **Preview before choosing:** recolour (`s.replace('var(--primary-svg-color)', BRAND)`) and screenshot a contact sheet of
   12–24 candidates (Playwright, 6 per row, cream background); pick by pose and story fit, not by name.
5. **Animate:** split the SVG into its top-level elements (unDraw files are flat lists) and store `{vb, kids[]}` in
   `src/illus.json`; render each kid in its own `<g style={{transformBox:'fill-box', transformOrigin:'50% 100%'}}>` that
   springs from scale 0.55 / +26 px with opacity, `start + i*min(1.6, 34/kids)` frames — the picture builds itself.
   Then float it ±6 px on a slow sine. Characters' ink is `#2f2e41`: on dark grounds place them on a light card.

## 4. Story structure & timing (style 1; styles 2–7 use their own scene grammar above)
- 8–10 scenes, one idea each, 5–10 s per scene. Default arc: **Hook (cover) → Problem (text post) → How it
  works (diagram) → 4–5 feature screens → Team/support → Outro (logo + tagline)**.
- One narration line per scene, ≤ 18 words, typed in the bubble; one highlight phrase per line.
- Everything in `src/theme.ts`: `SCENES=[{id,start}]`, `END`, `TRANSITION=18`, `LINES=[{t0,t1,text,hl}]`.
- Write every time in **seconds** through one helper (`const s = (sec: number) => Math.round(sec * fps)`), never as raw
  frame numbers, so the same video renders at 30 or 60 fps without retiming.
- Typing speed per line: `cps = graphemes / max(1.5, t1 − t0 − 1.1)` so the line finishes ~1 s before it ends.
- TransitionSeries durations: `dur_i = (start_{i+1} − start_i)·fps + TRANSITION` (last: to END), so scene i+1
  still starts exactly at its `start`.
- Animate UI on the narration words: stagger cards 6–7 frames, counters count up (Easing.out cubic),
  a card pulses 1→1.045→1 when its word is typed, buttons press (0.93) with a ring ripple, toasts spring in.

## 5. Layout (1080×1920, style 1)
- Safe text area x 70–1010. Handle at y≈92, share row at bottom 92.
- **Narrator:** bottom-left. Big pose (cover/problem/outro) height 760, x 26, feet at y 1712; small pose
  (app screens) height 600, x 18, feet at y 1730. Blend poses with a spring at each scene start.
- **Bubble:** anchored right of the head (`x = left + w·0.86`, `y = top + h·0.2 − 70`) to x 1040; white,
  3 px black border, radius 34, Medium 44 px, line-height 1.55, 10 px flat offset shadow; tail drawn *after*
  the box (higher z-index) so its white fill covers the border.
- **Scene content zone:** y 170–940 with the big pose, y 170–1110 with the small pose. Titles at top 180, right 70.

## 6. Narrator rig (flat image → puppet; any style that includes the character)
- Remove the white background by flood-fill from the borders (min(R,G,B) > 238), blur alpha 0.8 px, crop
  to the bbox. Keep the original untouched.
- Paint out the drawn mouth with the skin colour, then draw the mouth as an SVG overlay in image space:
  closed = the original smile curve; talking = dark lip shape + pink tongue whose opening follows
  `0.25 + 0.75·random('m'+floor(frame/3))`, averaged over 3 frames, only while the line is typing.
- Blink every 100 frames for 4 frames: skin-coloured rounded rects over the eyes + a closed-lid curve.
- Idle: bob sin(2.2 s) 6 px, sway ±1.4° around the feet; hop 22 px + squash/stretch on each new line;
  entrance from x −560 with spring (damping 13); outro: two 48 px jumps. Ground shadow scales with the hop.
- Measure face boxes once on a 3× crop of the face. Default narrator values: appendix A.

## 7. Text effects
```tsx
// graphemes keep harakat with their letter; Arabic reshapes naturally as the string grows (typewriter look)
const MARK = /[ً-ٰٟۖ-ۭ]/;
export const graphemes = (t: string) => { const g: string[] = []; for (const c of t) { if (MARK.test(c) && g.length) g[g.length-1] += c; else g.push(c); } return g; };
```
- **Typewriter** (`text, start, cps, hl, caret`): show `graphemes.slice(0, n)`; caret 0.08 em that blinks every
  15 frames after done and hides 40 frames later; when the highlight phrase is fully typed wrap it in `<Marker>`.
  Style 4 variant: a solid block cursor (width 0.45 em, line height) and a backspace pass that removes graphemes.
- **WordsIn** for headlines: split on spaces, each word springs from y+50 and scale .85 (stagger 4), container `dir="rtl"`.
  Never split Arabic into inline-block letters (they disconnect) — see Remotion skill `arabic-text.md`.
- **Marker**: absolutely positioned yellow block `top 14% bottom 6% right 0 width p·100%` behind the text.
- **HookLine**: SVG path with `strokeDasharray=len`, `strokeDashoffset=len·(1−p)`.
- **Mask slide-up** (styles 2–5): each line inside `overflow:hidden`, text translates from 110% to 0 with Easing.out(cubic).
- **Vertical words** (style 2 pillars): `rotate(-90deg)` inside a zero-size anchor; keep them clear of orbit lines.
- More effects: port React Bits text animations (section 13a) — BlurText is a good default reveal for any style.

## 8. Transitions (vary them; RTL → new content enters from the left)
`@remotion/transitions`: `slide({direction:'from-left'})`, `wipe({direction:'from-top-left'})`,
`iris({width,height})`, `clockWipe({width,height})`, `fade()`; alternate `springTiming({config:{damping:200}})`
and `linearTiming`, 18 frames. Every scene paints its own background so wipes/iris don't show both scenes.
Chrome and Narrator live **outside** the TransitionSeries so they stay continuous across cuts.
Style 2: hard cuts + a custom gooey wipe presentation; style 4: hard cuts only; style 5: fades, light leaks, glitch bars.
Every transition gets a React Bits sound (`sweep`, `swish`, `whip`, `swoop`, `wipe`).

## 9. Sound bed
Always React Bits sounds rendered to WAV (section 13b), placed on the cut frames and mixed with numpy
(`render/mix.py`: load WAV, add at `frame/30*SR` with a per-sound gain, loop a bed with 0.6 s crossfades, normalise
to −1 dBFS). Fallback only if React Bits is unavailable — synthesise with numpy:
a 12 ms click (noise burst + 1.8–2.6 kHz ping) on every 2nd typed grapheme of the bubble and titles (amp .05–.09);
a 0.45 s lowpass-swept noise whoosh at each scene start; small pitch-drop pops on marker swipes; a very quiet
Cmaj7/Am7 sine pad switching every 8 s, faded in/out. Normalise to −1 dBFS peak.
If the user provides a voice-over, time `LINES` from it (faster-whisper word timestamps or silence detection)
and drive the mouth from the audio RMS instead; keep React Bits sounds under it at lower gain.

## 10. Build & render
**Normal:** `npx create-video@latest --blank` (or the template + `npm install`), `npx remotion add @remotion/transitions`,
install the Remotion agent skills (`npx skills add remotion-dev/skills`, or clone github.com/remotion-dev/skills
into `.claude/skills/`) and read `remotion-best-practices` → `remotion-markup` (arabic-text, transitions, fonts).
Fonts: local `@font-face` with `staticFile('fonts/…ttf')`, `font-display:block`. Then
`npx remotion render src/index.ts <Id> out/video.mp4` and mux the WAV (or add `<Audio>`).

**npm registry blocked (sandbox):** Remotion core/player/transitions/shapes/paths depend only on React.
1. `git clone --depth 1 --filter=blob:none --sparse https://github.com/remotion-dev/remotion` →
   `git sparse-checkout set packages/core packages/player packages/transitions packages/shapes packages/paths`.
2. Bundle with esbuild (globally available) aliasing `remotion → packages/core/src/index.ts`,
   `remotion/no-react → core/src/no-react.ts`, `@remotion/player → player/src/index.ts`,
   `@remotion/transitions[/fade|slide|wipe|iris|clock-wipe] → transitions/src/...`, `react/react-dom → global`.
3. Harness: mount `<Player component={Video} …/>` with a ref; expose
   `window.seek = f => {ref.current.seekTo(f); await 2×requestAnimationFrame}`.
4. Serve `public/` at `/` (staticFile resolves to `/file`) and the harness at `/__render/` with a tiny Python server
   (start it with nohup on its own port per project; never `pkill -f` a pattern that matches your own shell command).
5. Playwright: N pages in parallel (`f = idx; f += N`), `seek(f)` → JPEG q93 → ffmpeg
   `-framerate 30 -i f%05d.jpg -i sfx.wav -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -c:a aac`.
   ~2100 frames ≈ 3 min with 6 pages. The same `src/` renders unchanged with the real Remotion CLI.
   WebGL (ShaderLayer) works in headless Chromium's software GL; it is slower (≈ 5 min for 1000 frames), so budget time.
6. **Frame rate & speed.** Default 30 fps. 60 fps on request (smoother motion, 2× frames → about 2× render time).
   Above 60 brings nothing: phone players and Reels/TikTok/Shorts play 30–60 fps and drop the extra frames. Speed:
   more Playwright pages (one per CPU core), JPEG frames (q90–93), `-preset veryfast`, keep WebGL layers only where
   they show, render a 10-frame test before the full run; with the real Remotion CLI use `--concurrency` = cores.

## 11. Check before delivering
1. Contact sheet of 8–10 stills (one per scene at its busiest moment) + 3 mid-transition frames; look at them:
   overlaps with the narrator/bubble, text wrapping (orphans like a lone «اليوم،» → smaller size), safe area,
   clipped Arabic dots/descenders, text running off the edges.
2. Highlights land when typed; bubble never on screen without a line; mouth closed when not typing.
3. UI labels match the source code; sample data named as such in the delivery note. Style 5: every fact traced to a source,
   official assets used as published (no recolour/distortion), no web photos of real people.
4. The chosen style's palette, type and scene grammar are respected (compare against its section); with no style
   palette and no colour asked for, the ground is white.
5. React Bits used: at least one ported background/effect visible, and every sound cue is a React Bits sound.
6. Duration matches the style; audio peak ≤ −1 dBFS. Deliver the MP4 + a zip of the project (without frames).

## 12. Project layout
```
src/theme.ts            colours, SCENES, LINES, END, TRANSITION
src/icons.json          extracted Fluent Color / Flat Color icons
src/components/Icon.tsx Text.tsx (Typewriter, WordsIn, Marker, HookLine) Frame.tsx (Paper, BrandChrome)
src/components/Narrator.tsx  rig + bubble     src/components/Ui.tsx (SceneTitle, AppCard, Pill, pulse)
src/components/ShaderLayer.tsx   React Bits shader backgrounds, frame-driven
src/scenes/Intro.tsx (Hook, Problem, Outro)   src/scenes/AppScenes.tsx (diagram + product screens)
src/Video.tsx (FontFaces + TransitionSeries + chrome + narrator)  src/Root.tsx  src/index.ts
public/fonts/*.ttf  public/character.png  public/character-original.jpg  public/brand-mark.png
public/sfx/*.wav + REACT-BITS-LICENSE.md   React Bits sounds used by this video
public/brand/*          (style 5) official logo / product assets of the subject
render/build.mjs player-entry.tsx index.html serve.py stills.py render.py sounds-entry.js mix.py
research/facts.md + research/brand.md   (style 5) verified facts with sources + the subject's visual identity
```
For styles 2–5 a single `src/Video.tsx` with one component per beat and a `TIMELINE` map of `[from, to]` frames
(rendered with `<Sequence>`) works well; reuse the render/ harness.

## 13. React Bits — components, backgrounds, text effects and sounds
Source: https://github.com/DavidHDev/react-bits (docs https://reactbits.dev, agent index `public/llms.txt` in the
repo). Clone once: `git clone --depth 1 https://github.com/DavidHDev/react-bits` and read `public/llms.txt` to
pick components by description (Text Animations 33, Animations 38, Components 48, Micro 34, Backgrounds 63).
Code lives in `src/content/<Category>/<Name>/<Name>.jsx` (JS+CSS; TS and Tailwind variants in `src/ts-default`,
`src/tailwind`, `src/ts-tailwind`). Sounds: `src/sounds/js/<name>.js` (≈200 recipes) + the engine
`src/sounds/js/react-bits-sound.js`.
**Licence:** MIT + Commons Clause — free to use inside videos, apps and client work; do not sell or
redistribute the components or sounds themselves (keep only what the project uses; keep the licence notice).

### 13a. Porting rule: everything must be driven by the frame
React Bits components animate with requestAnimationFrame, CSS animations, GSAP, Motion or pointer input.
In Remotion none of that renders deterministically, so port each piece:
- **Shader backgrounds (most of the 63 are raw WebGL with no dependencies):** copy the fragment shader
  string(s) from the `.jsx` and run them in a frame-driven `ShaderLayer` (below). Replace the component's
  time accumulator with `uTime = frame / fps * speed`, set pointer/drag/wave uniforms to rest values, intro
  progress = `min(1, t / INTRO_SECONDS)`. Multi-pass shaders (bloom etc.): start with the glow pass off
  (`uGlow = 0`), add the extra pass only if needed. Tint them with the brand colour uniforms.
- **ogl / three components** (EvilEye, MicroSlats, PatternWaves, ColorBends, Hyperspeed…): extract the GLSL and
  use ShaderLayer, or bundle `ogl` from GitHub (`oframe/ogl`, no deps) and call `renderer.render` inside a
  `useEffect` keyed on the frame. Avoid three.js unless `@remotion/three` is installable.
- **Text animations** (SplitText, BlurText, DecryptedText, ShinyText, GlitchText, StrokeText, SplitFlapText,
  CountUp, TrueFocus, RotatingText, TextType…): read the component to learn the effect, then re-implement it
  with `interpolate`/`spring` per word (Arabic: per word, never per inline-block letter). Scramble/decrypt
  effects use `random(seed + frame)` for glyphs. GSAP/Motion timelines → explicit frame ranges.
- **Animations / components** (LogoLoop, Counter, ElectricBorder, StarBorder, Noise, GradualBlur, PixelTransition,
  CardSwap, Stack, OrbitImages, MagicBento…): same — keep the look (CSS, SVG, canvas drawing code), drive the
  state from the frame. Canvas-2D components: redraw the canvas in a `useEffect` on every frame.
- Canvas/WebGL capture: create contexts with `preserveDrawingBuffer: true`.

```tsx
// src/components/ShaderLayer.tsx — frame-driven full-screen WebGL2 shader (tested with React Bits Silk)
const VERT = `#version 300 es
in vec2 aPosition; void main(){ gl_Position = vec4(aPosition,0.0,1.0); }`;
export const ShaderLayer: React.FC<{frag: string; uniforms: (t: number, w: number, h: number) => Record<string, number | number[]>}> = ({frag, uniforms}) => {
  const ref = useRef<HTMLCanvasElement>(null); const st = useRef<any>(null);
  const frame = useCurrentFrame(); const {fps, width, height} = useVideoConfig();
  useEffect(() => { // compile once
    const gl = ref.current!.getContext('webgl2', {preserveDrawingBuffer: true})!;
    const sh = (t: number, src: string) => { const s = gl.createShader(t)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const p = gl.createProgram()!; gl.attachShader(p, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, frag));
    gl.bindAttribLocation(p, 0, 'aPosition'); gl.linkProgram(p);
    gl.bindVertexArray(gl.createVertexArray()); gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const loc: any = {}; for (let i = 0; i < gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i++) { const u = gl.getActiveUniform(p, i)!; loc[u.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(p, u.name); }
    st.current = {gl, p, loc};
  }, [frag]);
  useEffect(() => { // draw this frame
    const {gl, p, loc} = st.current; const c = ref.current!; gl.viewport(0, 0, c.width, c.height); gl.useProgram(p);
    for (const [k, v] of Object.entries(uniforms(frame / fps, c.width, c.height))) { const l = loc[k]; if (l == null) continue;
      if (typeof v === 'number') gl.uniform1f(l, v); else if (v.length === 2) gl.uniform2fv(l, v); else if (v.length === 3) gl.uniform3fv(l, v); else gl.uniform4fv(l, v); }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  });
  return <AbsoluteFill><canvas ref={ref} width={width} height={height} style={{width: '100%', height: '100%'}} /></AbsoluteFill>;
};
// Extract a shader: python re.search(r"const COMPOSITE = `(.*?)`;", src, re.S), then substitute ${SILK}-style includes.
// Silk example uniforms: uView [w,h], uTime t*0.5, uScale 1, uWave 1, uRipple 1, uFold 1, uColor brand rgb, uSheen .5,
// uDepth .5, uGlow 0, uNoiseIntensity 1.2, uLight [.3,.5,0], uStep [1/w,1/h], uPresence 1, uWaves 16 zeros, uPointer [0,0,0,.32].
```

### 13b. Sounds → WAV (offline, in Chromium)
`renderSound(recipe)` in `react-bits-sound.js` uses OfflineAudioContext, so it renders without playback:
1. Write `render/sounds-entry.js` that imports `renderSound` and the chosen recipes
   (`import sweep from '<repo>/src/sounds/js/sweep.js'`), converts the returned AudioBuffer to 16-bit PCM WAV
   (RIFF header + interleaved samples), and exposes `window.renderRB(name)` returning base64.
2. Bundle with esbuild (`--bundle --format=iife --alias:react=<global react>`), open it in Playwright, decode
   and save each WAV to `public/sfx/`.
3. Place them on the timeline: in Remotion `<Sequence from={f}><Audio src={staticFile('sfx/reveal.wav')} /></Sequence>`;
   offline, mix with numpy (read WAV, add at `frame/30*SR`, scale per sound) or ffmpeg (`adelay` + `amix`).
   Keep the peak ≤ −1 dBFS.
Good picks: transitions `sweep` `swish` `whip` `swoop` `wipe`; typing `keycap` `thock` `tab`; reveals `reveal`
`glimmer` `shimmer` `bloom` `appear`; impact `braam` `stamp` `slam` `thunder`; numbers `counter` `tickertape` `tally`;
success `chime` `ping` `finale` `emblem` `herald`; tension/beds `suspense` `nocturne` `dread` `nebula` `drift`;
UI `check` `popover` `notch` `dot` `snap`.

### 13c. Which pieces fit which style
- Style 1 (Paper Post): Noise (paper grain), GradualBlur, Counter/CountUp, SpringCheck, AnimatedList, StarBorder; sounds keycap, thock, sweep, glimmer, chime.
- Style 2 (Brand Pulse): Galaxy, Threads, Beams, MagicRings, Orb, LightRays, GlitchText, ElectricBorder, LogoLoop; sounds braam, whip, zap, reveal, nebula.
- Style 3 (Logo Sting): ElectricLogo / MetallicPaint-style sheen on the logo, ShinyText, StarBorder; sounds punchline, emblem, herald, finale.
- Style 4 (Bold Typer): TextType, Shuffle/DecryptedText, Noise, Grainient or GradientBlinds very subtle; sounds keycap, thock, stamp, snap, whip.
- Style 5 (Story Archive): DarkVeil, LightRays, Silk, Dither, Noise, Topography (tinted to the brand colour); text BlurText,
  TrueFocus, SplitFlapText, CountUp, StrokeText; components Counter, LogoLoop, CardSwap/Stack for photos the user supplies;
  sounds suspense, braam, reveal, swish, thock, tickertape, stamp, emblem, chime.
- Style 6 (Live UI): DotGrid + Spotlight, BlurText, GradientText, CountUp, StarBorder beam, Aurora; sounds velvet, swoop, focus, notch, snap, check, emblem, calm.
- Style 7 (Illustrated Tale): Silk/Aurora on the turn, BlurText, CountUp, Noise; sounds unfold, swish, glimmer, blop, popover, ding, wand, calm.

### 13d. Quick picker — React Bits by clip type (pick 1 background + 1 text effect + 1–2 components + a sound set)
| Clip type | Background (tested ports first) | Text effect | Components | Sounds |
|---|---|---|---|---|
| App explainer / feature walkthrough | Noise grain on white; Silk (light tint) for a turn | BlurText, TextType | Counter/CountUp, AnimatedList, StarBorder on the focused card | keycap, swish/sweep, glimmer, popover/tab, ding, chime |
| Ad / promo (short, punchy) | LightRays★ behind the hero and finale | DecryptedText (Latin), GlitchText, Slam-in | Counter, ElectricBorder chips | braam, slam/stamp, whip, thunder, zap, finale |
| Launch film / UI showcase | DotGrid + Spotlight, Aurora★ finale | BlurText + GradientText | StarBorder/BorderGlow, CountUp, skeleton shimmer | velvet, swoop/glide, focus, notch/dot, snap/check, emblem, calm bed |
| News / documentary / story | Aurora★ or Silk★ on dark beats, Noise | BlurText per word, highlighter | CountUp, LogoLoop ticker, progress bar | whip, keycap, coin/treasure, counter, unease, nocturne bed |
| Typographic statement | Grainient/GradientBlinds (very subtle) | TextType with block cursor, Shuffle | pill reveal, mask lines | keycap/thock, stamp, snap, whip |
| Brand reel / logo | Galaxy/Threads/Beams (harder ports), LightRays★ | GlitchText, ShinyText sheen | MagicRings/Orb, ElectricLogo | braam, reveal, emblem/herald, punchline |
| Illustrated story | Silk★/Aurora★ on the turn, Noise | BlurText captions | AnimatedList, CountUp, toast | unfold, swish, glimmer, blop/bubble, wand, calm bed |
★ = already ported and tested frame-driven in this skill (Silk, Aurora, LightRays: single-pass shaders). Prefer
single-pass shaders (one `FRAGMENT`/`COMPOSITE`, no `createFramebuffer`) — check with
`grep -c createFramebuffer <Name>.jsx`; multi-pass ones (Threads, Grainient, Beams, DarkVeil) need the extra pass.
On a white ground use backgrounds at low opacity or as tints; keep strong shaders for dark styles.

## Sources
- Remotion docs & API: https://www.remotion.dev/docs/ · https://www.remotion.dev/llms.txt · transitions: https://www.remotion.dev/docs/transitions
- Remotion agent skills: https://github.com/remotion-dev/skills (remotion-best-practices, remotion-markup/arabic-text.md, transitions.md, text-highlights.md)
- Remotion source (offline build): https://github.com/remotion-dev/remotion
- React Bits: https://github.com/DavidHDev/react-bits · https://reactbits.dev · agent index https://reactbits.dev/llms.txt · licence https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md
- ogl (lightweight WebGL): https://github.com/oframe/ogl
- unDraw SVG collection (illustrations, style 7): https://github.com/balazser/undraw-svg-collection · https://undraw.co
- Fluent UI System Icons (Color): https://github.com/microsoft/fluentui-system-icons · Iconify set: https://icon-sets.iconify.design/fluent-color/
- Icons8 Flat Color Icons: https://icon-sets.iconify.design/flat-color-icons/ · Streamline Color: https://icon-sets.iconify.design/streamline-color/
- Iconify icon-sets JSON: https://github.com/iconify/icon-sets
- IBM Plex Sans Arabic: https://fonts.google.com/specimen/IBM+Plex+Sans+Arabic · https://github.com/google/fonts/tree/main/ofl/ibmplexsansarabic
- Poppins: https://fonts.google.com/specimen/Poppins · Alexandria: https://fonts.google.com/specimen/Alexandria · Barlow Condensed: https://fonts.google.com/specimen/Barlow+Condensed
- Amiri: https://fonts.google.com/specimen/Amiri · Noto Naskh Arabic: https://fonts.google.com/noto/specimen/Noto+Naskh+Arabic · Playfair Display: https://fonts.google.com/specimen/Playfair+Display
- Gooey / metaball effect (style 2 liquid wipe): https://css-tricks.com/gooey-effect/
- Kinetic typography: https://brush.ninja/glossary/animation/kinetic-typography · https://wyzowl.com/kinetic-typography/
- A-roll / B-roll for explainers: https://www.knowlify.com/articles/a-roll-vs-b-roll
- 12 animation principles for motion design: https://www.netguru.com/blog/illustrators-eye-12-principles-of-animation
- Mouth rigs & lip sync: https://www.bloopanimation.com/mouth-rig-for-lip-sync/
- Motion-design transitions: https://schoolofmotion.com/blog/six-essential-motion-design-transitions-tutorial
- Style 1 reference: Arabic carousel posts by @tatweerdigital (paper, black Plex Arabic, yellow marker, hook divider, share row)
- Style 2 & 3 reference: "Branding Reel" by Coozmoo Digital Solutions (dark grid, orbit rings, neon-green, logo sting)
- Style 4 reference: fontbold.top typographic reel (grey studio gradient, heavy Arabic typed with block cursor, blue card)
- Style 5 reference: RIVINITY "positioning / Al Ries" reel (method only: research-led story, acts, editorial pacing)
- Style 6: invented for المتمكن («واجهة حية» launch film) · Style 7: invented for the المتمكن roles video («حكاية مصوّرة»)

## Appendix A — default narrator (boy with laptop, user-supplied art)
File: `public/character.png` in the template — 452×967 px, transparent background, original smile painted
out with skin `rgb(255,247,236)`. Untouched art: `public/character-original.jpg` (736×1307, white background;
crop used: x 120–572, y 124–1091). Rig coordinates in the 452×967 image space:
- Closed mouth: `M232 222 Q258 244 286 213` stroke #111 width 4, round caps.
- Talking mouth (o = 0..1): lip `M234 221 Q259 {226+4o} 284 216 Q262 {234+22o} 234 221 Z` fill #3b1d1a
  stroke #111 3.5; tongue ellipse cx 258 cy {226+10o} rx {10+3o} ry {3+4o} fill #e8837a.
- Blink: rects (198,171,31×45,r12) and (265,156,32×46,r12) in skin colour + lids
  `M202 196 Q213 203 225 195` and `M269 181 Q281 188 293 179` stroke #111 width 4.
- Bubble anchor: x = 0.86·w, y = 0.2·h. Head occupies roughly x 120–380, y 0–330.
- Look: black messy hair, black T-shirt, rolled blue denim shorts, white sneakers, grey laptop in the left hand,
  thick black outlines, flat colours — keep any new poses or props in this flat outlined style.