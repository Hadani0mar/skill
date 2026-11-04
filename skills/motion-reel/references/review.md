# Review

## Before a full render
`node scripts/stills.mjs out/stills <times...>` renders exact frames, motion blur included. Take 20 to 30 times that
cover every beat: the question mid-flight, typing, the dive, the pop, the hold, the drop at the mouth, inside the
basket, the pour, the lift, the final screen, the cut, the ending. Make a contact sheet and look at each frame.

## After the render
- The contact sheet from the final file (render.sh makes it): the file is what people see, not the preview.
- Zoom into every hard cut: the frame before and after. Look for the container's bottom showing, a cropped logo,
  a product with a missing piece, a doubled bar, text passing unreadably over dark banners (give it a white halo).
- `python3 scripts/sound.py check out/final.mp4`.

## The human
Send the video and ask nothing else. Every note is an instruction: fix exactly that, in their words, and say what
you changed. When a note is a question ("is that right?"), answer it plainly, then fix. When they approve a detail
(a sound, a transition), write it down and never change it again.

## Checklist before delivery
- Opening: their home screen, lightly blurred, logo whole. The question readable the whole way into the bar.
- The bar matches theirs. Every search is typed. The cart counts up.
- Each product: out of its own tile, whole, held about a second, same entry method as the others.
- Nothing hangs on top of the bag. The bag's bottom only shows when it is lifted.
- The blade is visible against the screen. The cut comes after the final screen.
- Closing line and handle inside safe margins; nothing touches an edge.
- No music, no childish sounds; the start and the end are clean.
- 1080x1920, 60 fps, H.264, AAC, about -14 LUFS (a brand film: speech −21 LUFS, see brand-film.md §5).
- `python3 scripts/motion_check.py out/final.mp4`: OK (at least 60 % moving, no hold over 1.8 s but the end).
