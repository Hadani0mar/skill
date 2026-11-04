# config.json, field by field

All coordinates are pixels on the 1080x1920 screens in `public/screens/`. Paths are relative to `public/`.
Measure, never guess: open the screenshot, zoom in, read the pixel (or let a script find it).

## fonts
`[{family, file, weight}]`. Use the app's real font for `bar.font` (prove it with the overlay test in assets.md).
A display font for the question and the closing line.

## opening
- `screen`: their home screen (App Store screenshots are a good source; crop the phone out and scale to 1080 wide).
- `question`: 2 to 4 words. It appears word by word, then shrinks into their search bar in place of its hint.
- `size` (default 120), `blur` (default 6 px: light, the brand must stay recognisable).

## bar (the search bar, same place on home and results screens)
- `rect`: the white bar `[x0, y0, x1, y1]`.
- `textEdge`: x where typed text starts (the right edge in RTL, the left edge in LTR). Take it from their own hint text.
- `textCenterY`: the vertical centre of their hint text.
- `fontSize`: their size. Overlay yours on theirs until the letters sit on each other.
- `hint`: the box covering their hint text (and any typed query on results screens). Painted with `fill`.
- `ink`, `caret`: typed text colour and the caret colour (the brand colour).
- `zoom` (default 1.6): the close-up on the bar. The outer edge stays fixed so the logo stays in frame.
  If the header looks soft at this zoom, rebuild it in code (assets.md, "Sharp header").

## items (in order; bag items first, then basket items)
- `id`, `query` (typed exactly as a user would), `image` (transparent PNG of the product).
- `screen`: the results screen for this query.
- `tile`: where the product photo's object sits on that screen. `python3 scripts/find_tile.py screen.png original.png`.
- `plus`: centre of that tile's + button (the tap lands there, and the button is kept when the photo leaves).
- `into`: `"bag"` or `"basket"`. Optional: `heroBox` (size when it holds big, default 600), `plusR`, `tileFill`, `holePad`.

## cart (optional)
`{x, y, color}`: the badge on their cart icon. It counts up with every item.

## bag
- `image`: the brand bag, front view, transparent PNG, bottom included (it is lifted out at the end).
- `rim`: y of the mouth's lowest point, in the image's own pixels.
- `scale`: on-screen size (0.68 makes a 1116 px wide bag 760 px). `rest`: `[centre x, top y]` on screen.
  Keep the bag's bottom below the frame while items drop in.
- `opening`: the mouth between the handles as `[x0%, x1%, y0%, y1%]` of the image.

## basket (only if some items go `into: "basket"`)
From `node scripts/basket/render.mjs`: `back`, `front`, `size` [1600,1250], `rimFront` (printed by the script).
`scale`, `left`, `top` place it on screen (0.5 at 140,1150 sits it low and centred).

## final
The order screen the bag is lifted onto (tracking, confirmation). `holdSec`: how long it stays before the cut.

## slash
`color` of the blade mark and `trail` colour. On a light app use a dark mark; a white one disappears.
`path`: optional SVG path in a 24x24 box centred on 0,0 (default: a four-point star).

## ending
`lines` (1 or 2 big lines), `accentWord` (coloured `accent`), `sub` (one small line), `handle`, `platforms`
(`instagram`, `tiktok`, `snapchat`, `youtube`, `x`). It sits on the final screen, blurred and dimmed.
`mark` (default on when there is a `handle`): the handle and platform icons, small at the bottom for the whole film, so
a re-upload still carries them. They fade out when the big accounts arrive. `false` turns it off.
`sizes` (optional): a size per line, e.g. `[112, 170]` when the second line is the answer and should land bigger.

## voice (optional)
`open` and `close`: paths to the approved voice-over files (for example `vo/open.mp3`), or empty for none.
With them, `scripts/timeline.py` measures the files: each word of the opening question appears on its spoken word,
each ending line appears when the voice starts saying it, and the film is long enough for the voice to finish.
If a word lands wrong, set `openWords` to the word starts you measured, in seconds from the start of the file.
