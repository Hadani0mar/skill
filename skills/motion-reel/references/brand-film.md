# Brand film: a spec ad from a brand's own films, logos and claims

Use this when the brand is not an app flow (an airline, a bank, a car, a hotel): one claim from their own site,
told inside one shape of their identity, with their official footage, a voice from the brand's world (a captain,
a concierge) and real sound. It came out of 13 rounds of human review on an airline ad (a loyalty programme whose
points never expire). Every rule below cost at least one round. The numbers are the approved film's, measured.

**Work from `template-brand/`, not `template/`** (the app template only knows search, bag and order):

```bash
brew install node ffmpeg                           # if missing
cp -R <this skill>/template-brand ./<project> && cd ./<project>
npm install                                        # Remotion (about 300 MB the first time)
python3 -m venv .venv && .venv/bin/pip install numpy opencv-python mlx-whisper   # macOS refuses a global pip install
.venv/bin/python scripts/demo_assets.py            # placeholders, so it renders before you have their files
npm run studio                                     # the starter film, live, with its sound
```

Claude Code does not keep an activated venv from one command to the next: run every script below as
`.venv/bin/python scripts/<name>.py` (render.sh and plate.sh find the venv themselves). mlx-whisper needs Apple
Silicon; elsewhere use openai-whisper. Its model (about 3 GB) downloads only with `--download`, after the user agrees.

| File | What it does |
|---|---|
| `src/film.json` | every time, text, colour, place, number, voice sentence and sound cue. Picture and sound read it. |
| `src/Film.tsx` | the starter film: the dive, the shape, the pill, the card, the places, the ending. Reshape it. |
| `src/lib/zoom.ts` | the log-space dive into a tracked detail, its speed, the dissolve point, the speed blur |
| `src/lib/shape.ts` | the shape (a stadium), and the area-preserving shrink into the brand mark |
| `src/lib/Roll.tsx` | the vertical roll for dates and an odometer for a growing balance |
| `src/lib/Ribbon.tsx` | a voice ribbon that moves only while the voice speaks |
| `scripts/plate.sh` | their film → a 200 fps frame plate (motion-interpolated) for slow motion and the dive |
| `scripts/track.py` | tracks one small detail through a plate → `src/track.json` + a check image |
| `scripts/voice.py` | `islands` (cut a take at its pauses, with the words), `check` (transcribe the cuts), `place` |
| `scripts/mix.py` | all sounds on the beats, measured loudness, the speaker colour, ducking → `public/mix.wav` |
| `scripts/assets_check.py` | the largest scale each picture is shown at: anything over 1.0× is an upscale |
| `scripts/render.sh`, `stills.mjs`, `motion_check.py` | render + contact sheet + motion % + loudness, exact stills |

The starter's beats, in order: the dive, the pill, the card built, the dates rolling with the sky (the last date is
the claim), the card docking low, three places (each arrives with a move, holds while its name is spoken, then its
points fall into the card), the card tipping edge-on into a line of light, the slit and the wide window with their
vehicle passing slowly, and the window closing into their mark. On placeholders it measures 56 % moving. Change the
beats, the texts and the pictures in `src/film.json`; change `Film.tsx` only when a beat itself must change.

## 0. Ask first (one short message, then wait)

- The brand, and the URL of the page that states the claim.
- The one claim, in their words. The shape of their identity to live in (a window, a card, a key).
- The voice: which character (a captain, a concierge), and which service; they generate it and send you the takes.
- Three places, products or moments to show, and their real numbers (fares, prices) or permission to use examples.
- The creator's handle and platforms for the small mark. Anything off-limits (people, music, prices).
- Spec (personal concept) or commissioned. A spec ad says «إعلان غير رسمي» on screen and in the post.

If the prompt already answers some of these, ask only what is missing, then show the storyboard.

## 1. The idea and the facts

- **One true claim from their own site**, said in their words. Open the page, read the FAQ, and quote it. The ad
  claimed «points never expire» because the programme page says it twice; it showed a digital card because the
  FAQ says there is no printed one.
- **Every number must be logical and sourced**: points were one per riyal spent, so a farther city earns more. An
  early version gave Madrid fewer points than Cairo and the human caught it. Take numbers from a fare search on the
  day (keep a screenshot) or their published earn table. If neither exists, ask, and say on screen they are examples.
- **Dates**: one date per sky change, growing: this month, then past a year, then several years («لا بعد سنة…
  ولا بعد سنين…»), and the last roll lands on the claim itself («ما تنتهي ∞»). Places and products must exist:
  check them on their site.
- **Mark it as unofficial in plain words**: «إعلان غير رسمي». Avoid translated phrasing like «تصوّر إعلاني».

## 2. Their assets only (ask before each download: file name, source, size)

- **Official films** from their site, press or media centre. Find the video links in the page source
  (`curl -s <page> | grep -oE 'https[^"]+\.(mp4|m3u8)[^"]*'`; if the page builds them with JavaScript, open it in a
  browser tool and read the network requests). An `.m3u8` stream downloads with `ffmpeg -i <url> -c copy film.mp4`.
  Prefer the largest file (4K when they have it). Make a contact sheet of every film and drop
  the shots with people (their crew is often off-limits for a creator).
- **Never upscale official footage beyond its own size except during a fast move.** The rejected opening was
  zoomed about 1.8×, even after a ×4 AI upscale, and called blurry. Start wide, with the whole vehicle small and
  sharp inside the shape (a downscale), and only enlarge while the camera is moving fast.
- **Slow motion**: their films are 24–30 fps. `bash scripts/plate.sh film.mp4 pass <start> <end>` interpolates to
  200 fps; play it at 0.25–0.3× (0.3× gives one plate frame per film frame at 60 fps), keep it a downscale
  (0.56–0.68× of 1920) and drift the crop slowly so it never sits still. Look at wing and tail edges frame by frame
  for warping. Official films hide shot changes near the ends of a shot: pick a range from the contact sheet.
- **The views through the shape** (skies, clouds, the sun) are frames from their own films, graded per beat
  (sunset, night, dawn). Never a flat drawn gradient. Places are their own destination photos, lightly graded.
  The window is tall (760×1330 on a 1080×1920 film), so a landscape 1080p frame is already enlarged 1.4× to fill
  it: take 4K frames (`ffmpeg -ss <t> -i film.mp4 -frames:v 1 public/sky/1.png`) and photo URLs without resize
  parameters, then run `scripts/assets_check.py`.
- **Vector logos** from their own site or toolkit. Never redraw a logo. Check letters that are rects or polygons in
  the SVG, not only paths (a wordmark lost letters this way).
- **Their typefaces**, if they publish them. If not, ask, and propose a free font close in feeling (for Arabic, a
  serif like Amiri or Noto Naskh for the closing line), and say so. Test every Arabic word you set: in some fonts
  the final ي hangs below the line box, and a mask or overflow on that element cuts its dots («ما تنتهى»). Give
  masked text 16 px of padding above and below (`Roll` does).

## 3. One stage, one camera

- **Pick one shape of their identity and never leave it.** The airline's window (their stadium oval) held the
  whole film: the sky through it, the cities through it, their plane through it, and at the end it shrinks (by
  area, `shrinkInto`) into their monogram.
- **The brand is recognisable in the first second**: their vehicle with its livery, their logo small in a corner
  from 0.35 s, their colours on the wall.
- **A zoom into a detail is one curve in log space**, accelerating then landing, never a fast zoom followed by a
  separate slow-down (called «not smooth»). Approved: 0.51× (whole plane) to about 53× in 1.6 s, cubic-bezier
  (0.45, 0, 0.2, 1) on log(scale), peak speed about 8 e-folds per second a third of the way in, a tiny creep during
  the wide hold, the detail gliding to the centre. The footage dissolves into the shape between 3.5× and 11×, at the
  fastest point, and three copies at the scales of a 1/240 s shutter give a blur that rises and falls with speed.
  Track the detail: `scripts/track.py <plate> --at <frame> --box x,y,w,h`. Passenger windows are identical,
  so the tracker searches only around the predicted position; check `out/track_check.png`.
- **Time passing: one change per beat.** One month per sky colour, not a flurry of dates. A soft vertical roll:
  0.5 s, travel 0.55 of the line height, blur peaking at 2.5 px; year digits 0.05 s apart, the month 0.12 s after.
  Not a split-flap: transparent flaps on glass read as garbled, overlapping glyphs.
- **A growing number**: only the changed columns roll, rightmost first, 0.07 s apart, 0.42 s each; the increase
  (+820) can rise beside it in their accent colour.
- **Each place arrives with a move** (through a cloud, a bank, a shade that drops and lifts), then holds still
  while its name is spoken, then its number falls into the card. A name said as the place leaves, or a number that
  lands before the name, reads out of sync: arrival at `places[i]`, still from +0.9 s, the number at `counts[i]`
  (about +1.7 s), places at least 2.3 s apart. `voice.py place` warns when a name falls outside its still moment.
- **Measure the motion**: `scripts/motion_check.py out/final.mp4 --brand` (render.sh runs it). Aim for 55 % of frames moving
  and no hold over 1.8 s except the final logo. The approved film measured 56 %: two holds of 1.6 and 1.7 s while
  the captain spoke and the card built, and 2.2 s on the end logo. Each move grows out of the last.

## 4. The voice (a character of the brand's world)

- **Write the script on the picture's beats, and leave no dead silence.** A two-second silence before the key line
  made it land «alone». The months became «لا بعد سنة… ولا بعد سنين… ما تنتهي صلاحيتها».
- **Register: announcement, not narration.** Poetic lines and tags like «slow, reflective» or «proud and weighty»
  turned the captain into a documentary narrator. One base tag on every line, the same delivery.
- **ElevenLabs Eleven v4 sheet** (the user prefers a detailed sheet: one line per sentence, each with its tag, all
  generated in one pass). For v4 the tag goes BEFORE the sentence; this overrides the app ad's rule in sound.md:
  `[airline captain announcement over the cabin speakers, steady even pace, polite and matter-of-fact] ضيوفنا الكرام، مساء الخير…`
  Settings: speed 1.00, stability 50, similarity 75. If a line sounds acted, raise stability to 65 and generate the
  whole sheet again. Write numbers as digits and keep the dialect's vowels.
- **Cut at the natural pauses**: `scripts/voice.py islands vo/take.mp3` (−45 dBFS, pauses of 0.3 s or
  more, each island with its words). Join islands into the script's sentences and never cut inside a sentence,
  even at a 0.4 s pause. Start early when the first letter is soft (ب، ل). `place` keeps 40 ms before and 80 ms
  after each sentence with 12 ms and 40 ms fades.
- **Pick the take by checks, then by ear**: `scripts/voice.py check` transcribes the cut sentences. Watch
  for dropped letters («القاهرة» heard as «الآهرة») and wrong words («متمنى», an extra «أن»). Mix sentences from
  several takes with `"take"` on a phrase.
- **Do not shorten the film to the voice.** Stretch or tighten shots so each sentence has its moment; move a
  sentence only to land a claim on its picture.
- **The speaker colour** makes any voice a captain (`mix.py` presets light, medium, strong). Medium won: band
  280–5000 Hz, a dip at 350 Hz, presence at 1.8 and 3.2 kHz, 4:1 compression, a soft clip, a small metallic echo
  (13, 29, 47 ms). Check intelligibility again after it.

## 5. Sound

- **Real sounds only, nothing cute** (no pings, pops, bubbles, coins, risers, no music or regular beat). The one
  chime allowed is the real airline PA two-tone before the captain speaks, through the same speaker colour
  (`"speaker": true` on its cue). After any timing change run `mix.py` again: the studio plays `public/mix.wav`.
- **What and where**: the engine hum inside the cabin, wind outside, a very low air for each place (sea at a pier,
  desert wind, a far city), soft deep pulses when things land, a real window blind, and a real airliner flyby
  slowed to 0.8× (`"rate": 0.8`, about 4 semitones lower) under the slow-motion pass. Search terms that found
  them: `airplane cabin chime`, `airplane cabin interior ambience`, `jet airliner flyby`, `wind high altitude`,
  `desert wind`, `ocean pier waves`, `distant city traffic`, `window blind`, `deep sub whoosh`, `soft air whoosh`,
  `low impact`. Pixabay and Mixkit allow use in videos; Pixabay needs its page open to read the download link (see
  sound.md). Final Cut Pro, if installed, has a large licensed library on the Mac itself.
- **Levels (measured, not by eye)**: speech −21 LUFS, measured after the speaker colour and normalised again;
  hits and whooshes −27 to −35 LUFS each, place beds −33 to −37, the hero flyby −28; effects and beds together
  about 5 LU under the voice; under the voice effects duck 7 dB and beds 4 dB (30 ms attack, 350 ms release);
  ceiling −1 dB. `mix.py` sets each cue to its `lufs` and prints the gap. This replaces sound.md's −14 LUFS for a
  brand film; if the channel has no house level, use −14 for speech and keep the same gaps.
- **If the film follows the creator's own recording, match everything to their level** and leave their
  voice untouched (the version with a dialogue was matched to the creator's −16.7 LUFS).

## 6. A short dialogue before the ad (creator + a character), optional

- **Cut on speech islands**: about 0.2 s before the creator's first word; the character's answer 0.25 s after the
  question; the creator's next line as the answer's tail ends (0 to 0.3 s); the announcement 0.7 s after their last
  word, with the chime between them.
- **Do not assume where the creator is looking.** A look down was the creator reading the script, not looking at
  the character. Keep the takes where they look at the camera.
- **A character on a shoulder**: measure the clothing's top edge per frame, put the near feet on the edge, lean
  about 60 % of the slope (clamped), keep clear of the face when they turn, and paint no shadow on a dark background
  (it reads as a pale smudge).
- **Captions word by word**, the call-to-action keyword boxed; that keyword triggers the comment automation.
- **Into the ad**: the brand's shape opens from the centre onto the ad's first frame (scale 0.12 → 1, cubic ease
  out, 0.8 s) while the room dissolves into their wall colour, sampled just outside the ad's shape. Keep the ad's
  own full-size shape out of that dissolve (a heavily blurred mask), or a ghost of it appears around the opening.
  A thin white rim fades as it opens.

## Deliver

The ad alone, the version with the dialogue if any, the voice sheet (script, tags and settings), the list of
sources and licences (`sfx/cues.txt` plus where each file came from), and a log of each round: what the human
said, in their words, and what changed.
