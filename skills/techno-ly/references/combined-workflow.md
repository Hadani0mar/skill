# Combined workflow: motion-reel × stageshow × brag (for every «تقني» video)

The user's verdict on earlier videos: «فيه نكهة تصميم AI» — sparkles, duotone icon tiles, glowing chips, captions
on every line, a logo intro, a follow button. This file is the merge of the three skills that fix it.
Read the three SKILL.md files too: `skills/motion-reel/`, `skills/stageshow/` (and its `references/craft.md`,
`references/motion.md`), and brag (`Hadani0mar/brag`, `skills/brag/SKILL.md`, creative laws).

## Who owns what
| Question | Skill | Rule |
|---|---|---|
| What happens, in what order | motion-reel | Everything happens inside the product. Opening = its home screen lightly blurred with the question; every query is typed in its real bar; the thing acted on lifts out of its own tile, is held big ~1 s, drops into a container in the brand's look; the full container is lifted onto the final screen; a blade cut opens on the closing line. Same entry method for every item. |
| How a screen looks | stageshow | 3–7 real strings per screen, the rest `Bar` placeholders; one icon family (Material Symbols for Google/Android products), filled at ≤14 px, never duotone tiles; no sparkle, wand, star or purple as "AI"; no emoji as icons; no invented logos (a letter in a coloured square); real logos only (m0usasvg / BrandMark); no ring+halo to point at the hero; words keep 12 px insets; one number gets to be big. |
| How things move | stageshow `motion.md` | Every motion has a cause; nothing pops (enter, stay mounted, exit); numbers roll last digit first; travel `cubic-bezier(.45,0,.1,1)`, arrival `cubic-bezier(.25,.8,.25,1)` .8–1 s; the payoff holds ~2 s; nothing sits still >3 s; the poster frame tells the story alone. |
| The opening, retention and reading time | channel hook rules + brag | Benefit in the first line/2–3 s, early visual proof, one specific reason to finish and a fulfilled payoff. Read `hooks-and-retention.md`. A short label ~0.8 s settled, a sentence ~0.3 s/word; fast in, then hold; show the real flow; no generic SaaS words. |
| Logos | m0usasvg | Any company or technology that is named gets its real logo on screen. |

## Sound
motion-reel: real foley only (key clicks for every typed character, a tap, a soft whoosh on the lift, a drop into
the container, a dagger whoosh for the blade, one deep hit at the start and the end), voice on top, effects ducked
8 dB under it, about −14 LUFS. **No music** unless the user asks (motion-reel has none). No ding, bubble, riser,
cartoon or React Bits "chime" sounds.

## Words on screen
Only the hook line (on its spoken words, then it shrinks into the product's bar) and the closing lines. The product
itself carries the middle (the typed question, the answer, the cited page). No caption pill under every step.

## Checks before sending
`motion_check.py` (≥ 60 % moving, no hold > 1.8 s but the end), loudness, stills of every beat, a contact sheet from
the final file. Voice files from AI Studio are 24 kHz: read their real sample rate before mixing.

Before rendering, check the first 3 seconds independently: the viewer benefit must be clear and visible.
Deliver every promised final step in this video; do not postpone the principal benefit to encourage completion.
