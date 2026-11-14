---
name: motion-reel
description: Make a motion ad for an app or store from its real screens and real product photos, or a brand film from a brand's own films, logos and claims (an airline, a bank, a car), rendered from code in Remotion with real foley sound and an optional voice. Use when the user asks for an app ad, a product reel, a launch video, a spec ad for a brand, or "an ad like the ones in the motion guide".
---

> **Shared toolkit (14 Nov 2026):** For a combined motion/design task, read `../tuhfa/SKILL.md` and its `references/toolkit-routing.md` to select the additional modules. For @teqani.ly, the current user brief and `../tuhfa/references/channel-profile.md` take precedence over older house styles, voices, endings and repeated confirmation gates below. Preserve the approved template and accepted voice for edits.


# Motion reel: an app ad from the real product

The ad happens inside the real app: someone searches, the product lifts out of its own tile, it goes into a bag
(or gathers in a basket that pours into the bag), the full bag is lifted onto the order screen, a blade cuts it,
and the closing line lands with the creator's handle. Everything is real: screens, product photos, the brand's bag.

This came out of six rounds of human review on a real ad. The rules below are what those rounds taught. Follow
them before your own taste.

## 0. App flow or brand film?

If the brand's story is not "search, add, order" in an app (an airline, a bank, a car, a hotel), make a **brand
film** instead: read `references/brand-film.md` and work from `template-brand/` (its own film, voice, mix,
tracking and render scripts, and its own setup). From this file, only these still apply: the storyboard before
building (§4), the stills step and fixing the human's notes in their words (§7; render with template-brand's own
render.sh, not sound.py), and the hard rules about edges, the creator's handle, no invented claims, no music, and
Remotion. There is no short version unless asked.

## 1. Ask first (one short message, then wait)

- The app or store: name and URL, and the App Store link if there is one.
- 3 to 6 products to search for, in the order they should appear.
- The opening question and the closing line (for example «وش ناقص في البيت؟» and «أنت اطلب، واحنا نوصل»).
- A voice-over or text only? If a voice: which service, and will they pick the voice by ear.
- The creator's handle and platforms for the last frame.
- Anything off-limits: music, people, prices, claims.
- Is this a personal concept (spec) or for the brand itself? A spec ad must say so when published.

## 2. Set up once

```bash
cp -R <this skill>/template ./<project-name> && cd ./<project-name>
npm install                          # Remotion, Playwright, three.js (about 500 MB the first time)
npx playwright install chromium      # or skip it: the scripts fall back to the Chrome already installed
brew install ffmpeg                  # if missing
python3 -m venv .venv && source .venv/bin/activate   # macOS Python refuses a global pip install
pip install numpy opencv-python pillow mlx-whisper   # mlx-whisper checks a voice (Apple Silicon; else openai-whisper); its model is ~3 GB, ask first
```

Work only inside the project folder. Never edit the skill's own template.

## 3. Real assets (details: references/assets.md)

1. **Screens**: `node scripts/capture.mjs <url> public/screens/<name>.png --hide-fixed` captures the phone view at
   exactly 1080x1920. One home screen, one results screen per product, one final screen (order tracking or
   confirmation, often only in the App Store screenshots). Capture on the day you render: results change.
2. **Products**: the store's own photo at full size (read the image URL from the page, drop the resize parameters).
   Transparent PNG, cropped to the object. Remove stickers and badges cleanly. Never draw a product.
3. **Container**: the brand's own bag photo if it exists (their promo, their site). Upscale small ones with
   `scripts/upscale.py`. For the basket beat use `node scripts/basket/render.mjs --label <brand hex> --logo <logo.png>`.
4. **Fonts**: the app's real font. Prove it: overlay your text on their screenshot and match the size by eye at 2x.
5. **Measure** every coordinate for `src/config.json` (references/config.md): the search bar, where its text ends,
   the hint to hide, each product's tile (`python3 scripts/find_tile.py <screen> <photo>`), each + button.

## 4. Storyboard before building (references/storyboard.md)

One self-contained HTML page (every image inlined as base64, so it opens anywhere), one card per beat, on the real
screens. Send it and wait for OK. A note on the storyboard costs minutes; the same note on a video costs a render.

## 5. Build

```bash
python3 scripts/timeline.py     # config.json → src/timeline.json (film) + src/timeline_short.json (short cut)
npm run studio                  # live preview: the user can scrub and name the exact second
```

- Put `into: "bag"` items first, then `into: "basket"` items. The basket pours into the bag at the end.
- Change pace only in `scripts/timeline.py`. The picture and the sound both read the timeline.
- Product-specific design goes in `config.json`; only change `src/Ad.tsx` when a beat itself must change.

## 6. Sound (references/sound.md)

Real foley from free libraries, no music: iPhone key clicks, a plastic bag rustle, a filled bag landing, a bag being
lifted, a soft air whoosh, a dagger whoosh for the cut, cardboard landing in a basket, one deep hit at the start and
the end. Describe each file in `sfx/kit.json`, then:

```bash
python3 scripts/sound.py kit && python3 scripts/sound.py mix
```

Never: bubble, ding, spring, riser, cartoon sounds. The user will call them childish, and they are.

Voice-over, if asked: one voice, the user picks the takes by ear, the files go in `vo/` and `voice` in config.json.
Then run `scripts/timeline.py` again: the words on screen land on the spoken words (references/sound.md).

## 7. Review, then show the human

```bash
node scripts/stills.mjs out/stills 1.5 3.2 5.0 ...   # exact frames before any full render
bash scripts/render.sh && bash scripts/render.sh short
python3 scripts/sound.py check out/final.mp4
python3 scripts/motion_check.py out/final.mp4     # at least 60 % moving, no hold over ~1.8 s but the end
```

Look at every still yourself: text readable, logo not cropped, nothing touching an edge, every product whole.
Then look at the contact sheet from the final file. Then send the video and fix exactly what the user says,
in their words, before anything you'd prefer to fix. Details and the checklist: references/review.md.

## Hard rules (each one cost a round of review)

- **Never leave the app.** Every background is their screen, sharp or lightly blurred. Never a plain colour.
- **The opening is their home screen, lightly blurred**, so people know the brand in the first second.
- **Their search bar must match 100%**: their font, its size, its place. Type inside it, not over it.
- **Zoom from the bar's outer edge** so the logo never leaves the frame.
- **Real photos only.** A drawn tomato looks primitive; a 3D one looks fake. Use the store's photo.
- **Each product gets its moment**: out of its tile, big, held about a second, then it goes. Fast is not better.
- **Physical truth**: what drops into a bag disappears inside it. Nothing hangs on top. The bag takes the weight.
- **Every item enters the same way.** No sliding in from the side, no violent throws: one clear method.
- **Every search is typed.** Pages never just appear.
- **The blade cut comes after the order screen**, and it opens onto the closing line.
- **No music unless asked. No childish sounds.**
- **Nothing touches the frame edges.** Platforms crop the sides and cover the bottom.
- **The creator's handle stays on, small, for the whole film** (`ending.mark`), so a stolen re-upload still credits them.
- **No invented screens, prices or claims.** The product's own words only.
- **Remotion, not a hand-rolled frame renderer**: the user watches it live and a render takes about a minute.

## Deliver

`out/final.mp4`, `out/final_short.mp4`, both contact sheets, and a short log of each review round:
what the user said and what changed. If it is a spec ad, say in the post that it is a personal concept, and do not
ship the brand's assets to anyone.

