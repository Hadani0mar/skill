#!/bin/bash
# bash scripts/plate.sh <their film> <name> [start s] [end s] [fps]
# Their film → public/plates/<name>/0001.jpg … at <fps> (default 200, motion-interpolated), so a slow-motion pass or a
# dive plays one plate frame per film frame without judder (official films are 24–30 fps; a 60 fps film slowed 4×
# repeats each frame 8 times). Play it at 0.25–0.3× (0.3× is one plate frame per film frame at 60 fps).
# Look at the edges of the wings and the tail frame by frame: if they warp, use less slow motion.
# Official films hide their shot changes near the ends of a shot: pick a range without a cut on the contact sheet.
# If film.json has a block with "plate": "plates/<name>", its "n" (frame count) and "src" (size) are filled in.
set -e
cd "$(dirname "$0")/.."
IN="$1"; NAME="$2"; SS="${3:-0}"; TO="${4:-}"; FPS="${5:-200}"
[ -z "$NAME" ] && { echo "usage: bash scripts/plate.sh <film.mp4> <name> [start] [end] [fps]"; exit 1; }
PY=python3; [ -x .venv/bin/python ] && PY=.venv/bin/python
read SW SFPS < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,r_frame_rate -of csv=p=0:s=' ' "$IN")
echo "source: ${SW} px wide, $SFPS fps → $FPS fps"
[ "$SW" -lt 1920 ] && echo "  ! the source is only $SW px wide: anything shown bigger than that is an upscale. Look for a larger file."
rm -rf "public/plates/$NAME"; mkdir -p "public/plates/$NAME"
# scale first (never up), then interpolate: interpolating 4K frames is slow and gains nothing
ffmpeg -y -v error -ss "$SS" ${TO:+-to "$TO"} -i "$IN" \
  -vf "scale='min(1920,iw)':-2:flags=lanczos,minterpolate=fps=$FPS:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" \
  -q:v 2 "public/plates/$NAME/%04d.jpg"
N=$(ls "public/plates/$NAME" | wc -l | tr -d ' ')
ffmpeg -y -v error -i "public/plates/$NAME/%04d.jpg" -vf "select='not(mod(n\,25))',scale=240:-1,tile=8x8" -frames:v 1 "public/plates/$NAME.contact.jpg"
$PY - "$NAME" "$N" <<'PYEOF'
import re, sys, cv2
name, n = sys.argv[1], int(sys.argv[2])
h, w = cv2.imread(f'public/plates/{name}/0001.jpg').shape[:2]
p = 'src/film.json'; s = open(p).read()
s2 = re.sub(r'("plate": "plates/' + re.escape(name) + r'", "n": )\d+', lambda m: m.group(1) + str(n), s)
s2 = re.sub(r'("plate": "plates/' + re.escape(name) + r'", "n": \d+, "src": )\[[^\]]*\]', lambda m: m.group(1) + f'[{w}, {h}]', s2)
if s2 != s:
    open(p, 'w').write(s2); print(f'  film.json: plates/{name} has {n} frames, {w}x{h}')
PYEOF
echo "✓ public/plates/$NAME: $N frames  (contact sheet: public/plates/$NAME.contact.jpg)"
