---
name: tuhfa
description: "تحفة — design and finish motion graphics, Arabic explainers, product videos and phone demonstrations by routing the existing channel skills plus Shotcraft, HyperFrames, GSAP, Lottie motion design, word timing and technical diagrams. Use for complete films or improving transitions, typography, sound sync and UI animation."
---

# تحفة — one film, selected skills

Read this file completely. Read [channel-profile.md](references/channel-profile.md) for @teqani.ly films,
then [toolkit-routing.md](references/toolkit-routing.md) and the selected source skills in full.
Load only the modules used in the project. Do not read every library or install every runtime.

## Resolve the brief

Treat the current user's request as authoritative, then the current channel profile, then the
chosen lead skill, then the imported technique. Preserve the existing approved film when editing.
Do not re-ask for a style, voice, mode or permission already established in the conversation.
Advance from plan through stills to final render within the authorized request; wait only for
missing required input or an explicitly requested review. Publishing is a separate requested action.

Do not import an upstream house style, paid provider, music bed, language or approval gate merely
because its template uses one. Do not assume an absent installed skill such as khaam-motion or
video-making exists: use it only after resolving and reading its actual SKILL.md.

## Select the lead

| Brief | Read first | Add only as needed |
|---|---|---|
| تقني tool explainer / phone demo | `../techno-ly/SKILL.md` and its approved Edge Functions reference | Stageshow, Shotcraft, real word clock, engine guide |
| Arabic story, news, typography, launch or product world | `../motion-storytelling/SKILL.md` | Stageshow, React Bits, diagram or 3D techniques |
| App ad / brand film | `../motion-reel/SKILL.md` | Shotcraft cards, motion principles |
| Character presenter | `../mascot-explainer-video/SKILL.md` | Stageshow B-roll and word-timed captions |
| Web UI motion / hero loop | `../stageshow/SKILL.md` | GSAP and design-motion-principles |
| HyperFrames film | `../hyperframes/SKILL.md`, `../motion-doctrine/SKILL.md` | CLI, registry, selected transition and caption modules |

## Build and finish

1. Research current facts, real product screens and source code. List concrete claims and their
   sources in project notes. Treat supplied screens as references; preserve real labels and geometry.
2. For TikTok/Reels/Shorts, first read `../studio-script/SKILL.md` and its `INTEGRATION.md`,
   with `references/hooks.md` and `references/script-rules.md`. Draft three distinct,
   editorially scored hooks and a useful re-hook; current channel identity overrides
   upstream voice/setup/publishing defaults. Write the spoken script, scene intervals,
   main visual and visible action per beat. Choose an engine the environment can actually run. Keep the approved renderer and voice
   for edits unless the requested change requires replacing them.
3. Get the real narration. Import real word timestamps with `scripts/word_clock.py`; if no aligner
   is available, place and review phrase boundaries against the audio and label timing approximate.
   Letter-count timing is for drafts. Never call guessed word boundaries exact.
4. Choose a small shot vocabulary. Read each selected Shotcraft recipe and its demo source before
   adapting it. Name the carrier/action at each transition; keep direction and momentum intentional.
   Make scenes perform: typing, validation, requests, results, counts, or staged reveals.
5. Build source-based UI using Stageshow. Fetch logos and UI glyphs from Hadani0mar/m0usasvg on demand.
   Inspect React Bits first for a suitable component; fetch/port only what is needed. Read
   praveenvijayan/animdiagram on demand for verified ordered flows; do not vendor that repository.
6. Drive every visible state from time/frame. Use [runtime-adapters.md](references/runtime-adapters.md)
   for Remotion, seekable HyperFrames GSAP, the offline phone stage, or a technical SVG/WebGL insert.
   Use one master clock; do not paste a wall-clock animation into a frame renderer.
7. Render stills from real code at scene starts, peak motion, text changes and transition midpoints.
   Inspect a contact sheet and a 360 px-wide phone preview. Check Arabic joining, labels, contrast,
   safe zones, occlusion, real logos, camera framing and follow-button states. Fix before final render.
8. Mix narration and licensed foley at the action timestamps. Run `scripts/sync-check.mjs` with a
   numeric cues file when appropriate. It is a heuristic for onset alignment/loudness jumps; review
   voice-dominated false positives and do not treat zero checked cues as a completed sync review.
9. For HyperFrames seams, author a vector ledger, stamp it, and run its seam gate at the actual FPS
   against the same runtime as the render. For other engines, inspect sampled frames/velocities;
   do not claim the HyperFrames runtime gate checked a Remotion film.
10. Export H.264/AAC, yuv420p, 1080×1920, 60 fps, faststart unless the brief says otherwise. Verify
    duration, FPS, dimensions, audio presence, clipping and the full ending from the final MP4.
    Correct any failed result, then deliver a direct downloadable video and the requested source.

## Resources and availability

- [toolkit-routing.md](references/toolkit-routing.md): exact module paths and scene-level selection.
- [channel-profile.md](references/channel-profile.md): current approved identity, voice and ending.
- [runtime-adapters.md](references/runtime-adapters.md): requirements, local commands and limits.
- [phone-stage.md](references/phone-stage.md): existing offline template instructions.
- [legacy-workflow.md](references/legacy-workflow.md): historical lessons; current profile wins conflicts.
- `scripts/word_clock.py`: checked Arabic-friendly timestamp import and stable repeated-word IDs.
- `scripts/sync-check.mjs`: upstream MIT onset checker; notice in `licenses/sync-check-MIT.txt`.
- Root `toolkit-lock.json`: pinned sources, copied files, hashes, licences and omitted demo media.

In a full Hadani0mar/skill checkout, siblings are under `skills/`. In a standalone personal Tuhfa
installation, resolve the checkout using [repository-source.json](references/repository-source.json).
If absent, use the GitHub connector to fetch the required SKILL.md and its referenced files from
the recorded repository/ref, or clone with the user's existing GitHub authentication. Never request
credentials in chat or assume sibling paths are present. Read `toolkit-lock.json` to obtain each
upstream revision. If a dependency cannot be obtained, state the missing module and use an available
engine; do not claim it was used.

END OF SKILL — tuhfa
