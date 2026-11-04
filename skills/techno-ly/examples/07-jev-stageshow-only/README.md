# 07 — Jev explainer built with Stageshow ONLY (4 Nov 2026)
84.5 s, 1080×1920 (design 360×640 @3x), SFX only, no voice, no music. Order = problem → solution → reply → who is Jev.
No techno-ly template / motion-reel / brag: one `Stage`, one `script(a: Act)`, kit parts only (Window, Row, Avatar, Meter, Count, Badge, Card, Thread/Bubble, BrandMark).
Logos/icons come from m0usasvg (not a skill); company images from the company's own pages.

## How the film is made
`record.mjs` opens the page with `?record=1` → `installVirtualClock({fps:30})` (kit/clock.ts) → steps the clock one frame at a time,
screenshots each frame, and stops when the script sets `data-done`. `mix.py` builds the SFX track from `out/sig.json`
(the per-frame state signature the recorder samples): scene change = switch, typed text = key presses, rows/people/money = clicks/drops.
Needs the full upstream `scripts/` (the 184-file lite zip lacks `jumps-core.mjs`, so `film.mjs` cannot run there).

## Gate status — NOT passed (honest)
`node scripts/film.mjs <url> --gate` → `rehearsal failed: 34 line(s)`. Known causes, to fix in a second pass:
all 11 scenes are mounted at once (hidden by opacity) so `spills its slot` fires on stacked layers → mount only the active scene;
`framing:` on the first Window (nearly square, off-centre) → bleed/crop it; `uneven padding` on two Cards; Count `jump/settle snap`
(use a fixed-width slot); `kit override` lines from the Phone CSS in the lite kit; scene 8→9 cross-fade is muddy → wait between scenes.
Chat quirk: `Bubble` is sized when it mounts, so type nothing into it — use `typing` dots, then set the full text.
