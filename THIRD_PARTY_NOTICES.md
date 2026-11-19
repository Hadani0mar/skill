# Third-party notices — motion toolkit

Imported source files remain verbatim. Local integration notes and Tuhfa routing are additions.
The source instruction licence does not relicense runtime libraries, generated media, trademarks or fonts.
Revisions and file-level SHA-256 hashes are recorded in `toolkit-lock.json`.

| Source | Pinned revision | Licence | Included scope |
|---|---|---|---|
| [greensock/gsap-skills](https://github.com/greensock/gsap-skills/tree/aed9cfd3277740755f6bfc1155c7aa645403b760) | `aed9cfd32777` | MIT | gsap-core, gsap-frameworks, gsap-performance, gsap-plugins, gsap-react, gsap-scrolltrigger, gsap-timeline, gsap-utils |
| [LottieFiles/motion-design-skill](https://github.com/LottieFiles/motion-design-skill/tree/f9a8a041b85185ee4881b3471d3415e939aac772) | `f9a8a041b851` | MIT | motion-design |
| [kylezantos/design-motion-principles](https://github.com/kylezantos/design-motion-principles/tree/4a9ca879f24a361f4dca4174fe2da0f67b5ddee3) | `4a9ca879f24a` | MIT | design-motion-principles |
| [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes/tree/ff9c3b7619c6c46c3145b287914cd09b377174f9) | `ff9c3b7619c6` | Apache-2.0 | figma, hyperframes, hyperframes-cli, hyperframes-registry, media-use, remotion-to-hyperframes, reverse-any-video, slideshow, style-sampling, motion-doctrine, cut-the-curve, seam-craft, oversized-cursor, captions-overlay |
| [MengTo/Skills](https://github.com/MengTo/Skills/tree/3cc93458c4949c39a04e938ea7892a1d6d3d40bf) | `3cc93458c494` | MIT | html-explainer-video |
| [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy/tree/1482e8469b0a9e0d8cc18ea2740a01423d29ae80) | `1482e8469b0a` | MIT | anatomy |
| [Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft/tree/6700db2ba80572ebc777b99d72049679fed9840c) | `6700db2ba805` | Apache-2.0 | video-shotcraft |
| [iart-ai/javascript-animation-skills](https://github.com/iart-ai/javascript-animation-skills/tree/060f7467a6e5ae5b57c90c9cb1b3508c13b88e49) | `060f7467a6e5` | MIT | sync-check.mjs only |
| [remotion-dev/skills](https://github.com/remotion-dev/skills/tree/7e541aa4d7361dfaca0780a565a47307eb7bdfbb) | `7e541aa4d736` | not-declared-in-standalone-repository | External reference only; no copied files |
| [Melvynx/video-agent-skills](https://github.com/Melvynx/video-agent-skills/tree/f4542923f7f796a1fa0e544cbfc1109d5eec87d8) | `f4542923f7f7` | MIT | Original studio-script and 8 Markdown references, no editing engine or media |

## Retained notices and adaptation boundaries

- Studio Script: Copyright (c) 2026 Melvyn Malherbe (MIT), source license stored in `skills/studio-script/LICENSE.upstream`; only the 9 original Markdown files were imported, along with a separately authored `INTEGRATION.md`.

- Each imported skill includes LICENSE or LICENSE.upstream. HyperFrames/Shotcraft Apache-2.0 notices remain in their source files; local INTEGRATION.md explains adaptation.
- The MIT earshot sound kit bundled with html-explainer-video is Copyright (c) 2026 Leon Lin. Its original sounds/LICENSE.txt and kit.json are included. Channel routing uses restrained click/key/slide cues; bells/pop/riser files are not default creative choices.
- GSAP skills documentation is MIT. The GSAP runtime and optional plugins have their own terms; this bundle neither installs nor relicenses them.
- HyperFrames fallback Pixabay sounds and preset font binaries are not redistributed here. Their original credit documents remain for source context. Obtain any new assets under their own terms.
- Shotcraft screenshots, compiled galleries and Mixkit demo SFX are not included. The lock lists omitted tracked media; replace it with project-owned screens and appropriately licensed sound. The source template is not a ready-to-render unchanged demo.
- Anatomy generated example HTML/PDF and screenshot fixtures are omitted; source builders and kit are included. Its publish helpers must not be run unless publishing is requested.
- Remotion standalone skills has no LICENSE at the pinned revision. No documentation/source files were copied from it. Use the available official plugin or inspect its source on demand; runtime licensing remains separate.
- Existing Stageshow attribution, existing template font OFL notices and previously approved channel examples remain intact. The offline Tuhfa template is brought from the existing tuhfa-phone-stage branch without its large historical rendered videos.
- React Bits, praveenvijayan/animdiagram and Hadani0mar/m0usasvg remain selective external sources. Follow their individual code/asset licences and preserve notices in any film project.

## Not bundled

- imMamdouhaboammar/motion-graphics-skills: all rights reserved; no authorized copying/derivation.
- Vincentwei1021/video-talkcraft: PolyForm Noncommercial. It is excluded from this commercial-capable bundle.

## Updating

Review a new upstream revision, permissions and dependency changes before replacing files. Update the lock and
notices together, then run scripts/validate_toolkit.py and the relevant smoke tests. Do not auto-upgrade a
film project to match new skill documentation. No upstream code executes merely by importing these files.
