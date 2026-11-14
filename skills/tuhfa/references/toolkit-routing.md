# Toolkit routing — load per scene

All paths below are relative to the parent `skills/` directory in Hadani0mar/skill. This file is a
selection map, not a request to combine every framework in every film. Source modules retain their
instructions and notices; Tuhfa's current channel profile resolves aesthetic/provider conflicts.

| Need | Read | Integration |
|---|---|---|
| Arabic narrative, launch, phone presentation | `motion-storytelling/SKILL.md` | Existing nine styles; use the established style when already approved. |
| Channel identity, current film reference | `techno-ly/SKILL.md` + approved Edge Functions reference | Existing source-based UI, voice and ending take precedence. |
| Product / brand film | `motion-reel/SKILL.md` | Keep templates and review workflow; select shot techniques below. |
| Presenter / mascot | `mascot-explainer-video/SKILL.md` | Existing character poses, B-roll and voice workflow. |
| Phone, Window, UI, cursor | `stageshow/SKILL.md` + kit | Reuse actual kit geometry and readable native-size text. |
| Product shot recipes / camera staging | `video-shotcraft/SKILL.md`, `references/shots/` | Pick cards + demo source; do not adopt Ink Press or BGM by default. Demo media omitted. |
| HyperFrames production | `hyperframes/SKILL.md`, `hyperframes-cli/SKILL.md` | Own runtime, editable HTML, version-compatible CLI. |
| Reusable HyperFrames blocks | `hyperframes-registry/SKILL.md` | Fetch selected registry components; not all packages or fonts. |
| Continuous seams and purposeful motion | `motion-doctrine/SKILL.md`, `cut-the-curve/SKILL.md`, `seam-craft/SKILL.md` | Internal upstream techniques adapted as optional film grammar. Ledger + seam scripts are included. |
| Cursor-led action and captions | `oversized-cursor/SKILL.md`, `captions-overlay/SKILL.md` | Arabic whole words and actual voice clock; don't obscure UI. |
| GSAP timeline / SVG / performance | `gsap-core`, `gsap-timeline`, `gsap-plugins`, `gsap-utils`, `gsap-performance` SKILL.md | Use MotionPath/DrawSVG/MorphSVG/Flip only when appropriate; runtime has its own licence. |
| GSAP web / React | `gsap-react`, `gsap-frameworks`, `gsap-scrolltrigger` SKILL.md | Web-specific modules. ScrollTrigger is not the clock for a rendered video. |
| Motion choreography / meaningful easing | `motion-design/SKILL.md` | LottieFiles guidance; doesn't itself export Lottie or install lottie-web. Skip ambient decorative layers for this channel. |
| UI interaction critique | `design-motion-principles/SKILL.md` | Audit purpose, timing and accessibility; UI timing heuristics aren't a universal film duration limit. |
| Narration-driven HTML / camera / timing | `html-explainer-video/SKILL.md` | Use real word clock; existing Gemini narration replaces upstream Fil/ElevenLabs defaults. MIT foley kit included. |
| Technical isometric SVG/WebGL | `anatomy/SKILL.md`, `kit/`, `references/` | Technical inserts only when the mechanism is correct. Adapt live animation to the film clock; no automatic gallery publishing. |
| Audio onset check | `tuhfa/scripts/sync-check.mjs` | Assistive cue checker, not a speech aligner. Use numeric seconds, `--tol 100`. |
| Figma / media acquisition / reverse reference | `figma`, `media-use`, `reverse-any-video`, `style-sampling`, `remotion-to-hyperframes`, `slideshow` SKILL.md | Optional supporting workflows, require their own tools/assets. Do not migrate a working project by default. |
| Remotion official knowledge | installed `remotion-best-practices`, then create/markup/captions/render/studio as needed | Official external route; see runtime-adapters.md and lock. No unlicensed source redistribution. |

## Boundaries

- HyperFrames' internal text-beat-economics / brand-faithful overlays are not bundled. Use the channel
  profile for brand fidelity and this word clock + readable phrase beats for text timing; do not claim
  those two upstream modules were loaded. Seam scripts themselves are included.
- Keep real facts, real UI and truthful execution descriptions. A locally animated example is not a
  deployed live backend unless actually deployed. A package added to the repository is not installed
  runtime software until dependency setup succeeds.
- Keep original source files verbatim; place project adaptations in the film. `INTEGRATION.md` beside
  each imported skill explains its local use. Root `toolkit-lock.json` pins every copied file.
- Fetch React Bits, animdiagram and m0usasvg selectively from their own repositories. Preserve their
  asset/code licences; do not relicense external code or bundle entire repos here.
- Omit motion-graphics-skills (all rights reserved) and video-talkcraft (Noncommercial). Remotion
  standalone skills have no declared repository licence at the recorded revision; route to their
  official installed plugin / source on demand instead of redistributing the documentation.
