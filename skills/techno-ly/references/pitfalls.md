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
- **Music licence:** brag's ende.app tracks have unverified licence terms — keep a music-free copy.
- **Design system attachments:** a design system selected in the app may belong to another product (e.g. the
  Almutamakkin platform); the channel videos keep the «تقني» identity — say so in one line.
