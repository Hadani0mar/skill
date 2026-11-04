# Sound: real foley, placed by the timeline

This is the app ad's sound. A brand film has its own levels, voice rules and the PA chime: references/brand-film.md §4–5.

## Where to get it
Free libraries with licences that allow use in videos (Pixabay sound effects, Mixkit). Search terms that worked:
- `iphone keyboard typing` → cut single clicks (key1..key4)
- `plastic bag` (a 3 to 5 s rustle) → bag_rise · `drop filled plastic bag` → bag_in · `picking up plastic bag` → lift
- `thin swoosh` → air · `soft luxury air whoosh` → dive · `whoosh dagger` or a short knife swoosh → dagger
- `deep impact` → deep · `low hit` → low · `cardboard box drop` → box1..box3 · `plastic box` knock → knock

Pixabay blocks plain downloads: open the sound's page in a browser, read the `cdn.pixabay.com/download/audio/...mp3`
URL from the page, then `curl -A "Mozilla/5.0" -e https://pixabay.com/ -o sfx/raw/name.mp3 "<url>"`.
Do not redistribute the files; each project downloads its own.

## kit.json
`{"bag_rise": {"file": "raw/plastic_bag.mp3", "near": 1.47, "dur": 0.55, "fade": 0.15}, ...}`
`python3 scripts/sound.py scan sfx/raw/x.mp3` lists the transients; put `near` on the one you want. The clip starts
on the real transient (files often begin with silence), peaks at -3 dB, and fades out. The haptic tap is generated.

## The rules
- No music unless the user asks. No bubble, ding, spring, riser, cartoon or UI chime sounds.
- A sound only where something visible happens. Layers are fine (a rustle plus a low thud when a product lands).
- The same timeline drives the picture and `scripts/sound.py mix`, so nothing drifts. Loudness about -14 LUFS.
- Very fast typing (under 65 ms a letter) gets shortened clicks so each letter is still heard.
- `python3 scripts/sound.py check out/final.mp4`: every cue should stand out in its band. Layered sounds and very
  fast typing show up as "masked" by design; check those by looking at a 5 ms envelope, not by ear alone.
- If the user liked a sound in an earlier version, keep that exact file. Do not "improve" it.

## Voice-over (only if the user wants a voice)
- One voice for the whole ad. Generate in ElevenLabs (the newest model) and let the user pick by ear; you cannot hear.
- Write the direction in English in square brackets after the line: `وش ناقص في البيت؟ [excited, proud]`.
  (Eleven v4 with a sheet of many lines: the tag goes before each line instead; see brand-film.md §4.)
  Descriptions like "slow and majestic" made it slow and theatrical; two words worked better.
- Write the dialect's vowels (Najdi: `وِشْ`، `يْجِيبْ`). A shadda often gets lost: write the letter twice (`يْوَصْصِلْ`).
- Use the user's words exactly. If a line sounds odd to you, ask; do not "fix" a brand line.
- Download as MP3: the takes are generated as MP3, so WAV adds nothing. Put them in `vo/` and set `voice` in config.json.
- `scripts/sound.py mix` puts the voice on top at a steady level and ducks the effects 8 dB while it speaks.
- Check the words with a local transcription (mlx_whisper or whisper) and their timing on the final file. A
  transcript cannot tell a shadda from a single letter; only the user's ear can.
