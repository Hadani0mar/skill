# Pitfalls hit while making the «تقني» videos (and the fixes)

- **CSS class collisions between copied projects.** A `.chat {position:absolute; top:520px}` rule from an older
  video pushed the Gemini Notebook chat panel to a second grid row. Scope new classes or override
  (`.pnl.chat{position:relative;top:auto}`); measure suspicious elements with `getBoundingClientRect`.
- **Descendant selectors breaking components.** `.clock__in span {font-size:26px}` shrank the Counter digits;
  use `>` child selectors near components.
- **Counter rolling every place.** Only the lowest place rolls fractionally; higher places use
  `Math.floor(value/place) % 10`.
- **Inline SVG logos sharing class names** (`.cls-2`, `.st0`) recolour each other — prefix ids AND class names
  per instance (`ui.tsx` Logo does it).
- **Missing icon names throw** (`icon heart`) and blank the whole frame — check `fetch-assets.py` output for
  "missing icons"; m0usasvg names: `pin` (not map-pin), `wallet-balance`, `hand-coins`, `house`, `trash`.
- **Bidi:** keep number + unit together with NBSP; wrap Latin inside Arabic with `⁦…⁩`.
- **Beiruti narrow space:** words look joined — add `word-spacing: .12em`.
- **Measure loops:** guard `setState` in `useLayoutEffect` (≤3 re-measures per t) or React throws #185.
- **Tall page in a vertical window:** panels stretch and content sits at the top; use a page ~820 px wide in a
  landscape-ish window, aim the camera at specific elements, not whole panels.
- **Long tool runs get interrupted:** render in background jobs (`nohup … &`), poll with short sleeps; if the
  encode was cut, re-run only ffmpeg (frames are kept).
- **Network:** shells often reach only GitHub; Unsplash and company sites may be blocked — ask the user for photos
  and logos (they send them), or find them in GitHub repos. Don't fake logos with text tiles.
- **Design system attachments:** a design system selected in the app may belong to another product (e.g. the
  Almutamakkin platform); the channel videos keep the «تقني» identity — say so in one line.

## Added 4 Nov 2026 (Jev video)
- **Never encode by hand while `render.sh` is still alive.** `nohup render.sh &` can return early while the 4 `record.mjs`
  jobs keep running; a second `ffmpeg` to the same file corrupts it («Invalid NAL unit»). Wait for `pgrep -f "record.mjs frames"`
  to be empty, delete the old mp4, encode ONCE to a fresh name, then run `ffmpeg -i x.mp4 -f null -` to prove it decodes.
- **Stageshow `Window` outside a `Stage` has no frame** (tokens live on `.ss-stage`): set `--ss-canvas/--ss-chrome/--ss-radius-window/
  --ss-shadow-window` on `.ss-window` (see 06 `style.css`) or it renders as floating traffic lights.
- **m0usasvg icon names missing from the UI looks:** wallet, bolt, building, ticket, timer, alert-triangle (use `triangle-alert`),
  stopwatch, chart-bar, refrigerator. `arrow-right` exists but must be in the `fetch-assets.py` list or the whole frame throws.
- `record.mjs` must serve png/jpg/webp with image MIME types (patched in the template).
- Bidi: «70–500 ms», «68 ms», a colon before an Arabic word flip — wrap in `<bdi dir="ltr">` or reword.
- The Wikimedia Commons API is blocked from the sandbox: no Embarcadero/SF photo; say so instead of faking one.
- Always put the numbers' source on screen when it is the company's own claim; mark invented demo data «بيانات تجريبية».
