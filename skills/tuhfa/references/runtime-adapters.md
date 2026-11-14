# Runtime adapters and checks

## Requirements

Check local versions before choosing the renderer. Node 22+ covers the imported seam verifier; some
existing Remotion templates can use older Node. Python 3 is needed for word-clock import and mixing;
ffmpeg/ffprobe for media checks; a compatible Chromium/Playwright for browser capture. Install the
project's locked dependencies only when needed. Adding skill folders installs no npm packages.

## Remotion

Keep the existing project's pinned Remotion, React and bundler versions. Route to the available
official remotion-best-practices skill, then remotion-markup/captions/render/studio as needed.
Official source: https://github.com/remotion-dev/skills . Read current guidance in the installed
plugin or fetch only the needed files at the revision in `toolkit-lock.json`; do not copy the whole
source tree into this toolkit without a declared redistribution licence. For a user-requested
official install, upstream documents `npx skills add remotion-dev/skills`.

Use `useCurrentFrame()` and `frame/fps`, deterministic interpolation and deterministic randomness.
Port GSAP recipe math to frames where possible. GSAP effects inside Remotion need a tested seek
adapter that resets the timeline/state for arbitrary frame order; do not run a real-time ticker.
Never use ScrollTrigger, autonomous rAF or CSS transitions as the render clock.

## HyperFrames

Read hyperframes + hyperframes-cli before scaffolding or rendering; read motion-doctrine for seams.
Use the project-installed/pinned CLI for preview AND render. Keep the master timeline seekable.
Use `data-start` / duration / tracks and initial visibility as the actual runtime requires.

The copied doctrine comes from upstream repository-internal skills, not a promise that every
upstream private authoring tool is installed. It includes zero-npm-dependency seam scripts (Node 22+),
but the numerical gate still needs a compatible running HyperFrames preview and headless Chrome.
Prefer `--url` for the same pinned preview; the default --project fallback can resolve another CLI.

```bash
node skills/motion-doctrine/scripts/seam-stamp.mjs --ledger ledger.json --write index.html
node skills/motion-doctrine/scripts/seam-gate.mjs verify --ledger ledger.json --url http://localhost:5244 --fps 60
```

Read the ledger schema in motion-doctrine/references/seam-gate.md. Re-check edited boundaries after
voice retiming. Do not run the HyperFrames gate against Remotion. Treat it as numerical seam evidence,
not automatic proof of readability, narrative quality or accurate facts.

## Offline phone stage

Use Tuhfa `template/` + Stageshow kit when its existing build dependencies are available. Read
phone-stage.md and inspect build.mjs / record.mjs before running. Runtime paths are environment
specific; locate installed esbuild/React/Playwright rather than assume /opt/npm-tools exists.
Every film is `App({t})`, stage 540×960, DSF=2 gives 1080×1920. Retain the old worked films as examples,
but apply the current channel profile. A standalone personal skill may fetch this template from
Hadani0mar/skill instead of containing the large examples locally.

## HTML / technical inserts

html-explainer-video supplies frame-driven HTML helpers, local preview/render/check scripts and an
MIT sound kit. Upstream Fil MCP and ElevenLabs are optional provider routes; default to the current
Gemini Voice workflow or supplied audio. Do not add paid calls or regenerate accepted narration merely
to use this module. Anatomy is primarily interactive SVG/WebGL: expose a seek(t) adapter and replace
all live clocks, springs/rAF with deterministic state before rendering it into a film.

The Shotcraft source contains recipes and demo code; source screenshots/audio and built galleries
are omitted. Replace template assets with project-owned screens/foley. Its SFX sourcing helper is
included, but each newly downloaded sound still needs a usable licence. HyperFrames' Pixabay fallback
sounds and bundled Latin fonts are omitted; use the channel's licensed kit/Google Fonts. Never treat
an engine's code licence as the licence for every third-party image, sound or font.

## Voice and foley clock

Import reviewed real word timestamps (seconds) using Python stdlib:

```bash
python3 skills/tuhfa/scripts/word_clock.py aligned-words.json --duration 60 --out project/word-clock.json
# Use --format triples --out project/words.json for the upstream HTML engine's array format.
node skills/tuhfa/scripts/sync-check.mjs project/final.mp4 --cues-file project/cues.json --tol 100
ffprobe -v error -show_streams -show_format -of json project/final.mp4
```

word_clock accepts [[word,start,end], ...], a words list of objects, Whisper segments containing words,
or an ElevenLabs-style alignment object with character timestamps. Character data is grouped at
whitespace into full words, preserving Arabic. Inputs must be monotonic and in range; speaker-overlap
recordings require a deliberate reviewed merge first. Stable IDs w0001 etc distinguish repeated words;
`occurrences` provides their IDs. Keep times in seconds until the renderer converts with its actual fps.
Regenerated narration reopens scene timing, captions, seam review and sound cues.

The upstream sync checker ignores the opening second and final 0.6 s and may classify voice as an
onset. A zero-event report is not a pass for the whole film; manually inspect ignored regions.
