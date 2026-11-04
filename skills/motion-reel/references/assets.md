# Real assets

The biggest jump in quality came from dropping drawings altogether: their screens, their photos, their bag.

## Screens
- `node scripts/capture.mjs <url> public/screens/results_x.png --hide-fixed` → 360x640 at 3x = 1080x1920.
  `--hide-fixed` hides floating bars so the grid under them is visible. `--click "text=..."` closes a dialog
  (close it with its X; never grant location or log in). `--full` for a full page you will crop yourself.
- Search pages usually take the query in the URL (`/search?q=`). Capture every item the same day: results and
  their order change during the day, and the first tile you planned may be gone.
- If the web header differs from the app, build each results screen as: app header (from the home screen) +
  the web grid + the bottom bar, so every screen shares the same bar. Keep the bar in the same place everywhere.
- The home screen and the final screen often exist only in App Store screenshots: crop the phone content,
  scale to 1080 wide, fill the rounded corners with the header colour.

## Sharp header
The camera zooms 1.6x into the bar. If the header is an upscaled screenshot it will look soft. Rebuild it in code:
the bar as a rounded rect, the logo from their site (their PNG or SVG), the text in their font. Then prove it:
render yours at 50% over theirs, tinted, zoom in 2x, and move/resize until every letter sits on its twin.
Replace anything private (a city in "deliver to...") with something neutral.

## Product photos
- Read the product image URLs from the results page DOM; drop resize parameters (`?w=256`) to get the original.
- Many stores already serve transparent PNG/WebP. If not, remove the background (macOS: Preview's Remove Background,
  or a subject-cut tool) and check the edge on a dark background.
- Remove badges and stickers cleanly: mask exactly the sticker, fill only the pixels it covered.
- Crop to the object. Keep the full size; the product is shown big.
- `find_tile.py` gives where the photo sits inside its tile, so the cut-out lifts out of the exact same place.
  A score under 0.8 usually means a badge or button covers the photo; check the rect by eye.

## The container
- Best: the brand's own bag (their promo, site banners). If it is small, `scripts/upscale.py` (Real-ESRGAN 4x).
  If its bottom is cut by the frame in their promo, extend it: stretch a plain band under the logo (vertical
  wrinkles survive stretching), add rounded corners and a darker sealed edge.
- A basket: there is rarely a clean free photo. `node scripts/basket/render.mjs --body 17191b --label <brand hex>
  --logo public/brand/logo.png` renders a plastic hand basket in 3D, in two layers.

## Licences and respect
Brand screens and photos belong to the brand. Use them for a personal concept or with permission, never ship them
to others, and say "personal concept, not official" when a spec ad is published.
