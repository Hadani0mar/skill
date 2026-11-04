#!/bin/bash
# bash scripts/render.sh  → out/final.mp4: the picture rendered muted, then public/mix.wav added, then a contact sheet.
# COMP=<composition id> and MIX=<wav> to change them.
set -e
cd "$(dirname "$0")/.."
COMP=${COMP:-BrandFilm}; MIX=${MIX:-public/mix.wav}; OUT=${OUT:-out/final.mp4}
PY=python3; [ -x .venv/bin/python ] && PY=.venv/bin/python
mkdir -p out
$PY scripts/assets_check.py || echo "  (render goes on, but fix the enlarged pictures before you send it)"
npx remotion render $COMP out/.silent.mp4 --codec h264 --video-bitrate 20M --image-format png --muted --color-space bt709 --log=error
if [ -f "$MIX" ]; then
  ffmpeg -y -v error -i out/.silent.mp4 -i "$MIX" -map 0:v -map 1:a -c:v copy \
    -bsf:v "h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0" \
    -c:a aac -b:a 256k -shortest "$OUT"
else
  cp out/.silent.mp4 "$OUT"; echo "no $MIX yet: delivered without sound (run: python3 scripts/mix.py)"
fi
rm -f out/.silent.mp4
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"); ROWS=$(python3 -c "import math;print(math.ceil(float('$DUR')*2/8))")
ffmpeg -y -v error -i "$OUT" -vf "fps=2,scale=216:-1,tile=8x${ROWS}" -frames:v 1 "${OUT%.mp4}_contact.png"
$PY scripts/motion_check.py "$OUT" --brand || [ $? -eq 2 ] || echo "  ! the motion check could not run (set up Python: see brand-film.md)"
# the delivered file's loudness and true peak (aim: speech at film.json mix.lufs, true peak at or below −1 dB)
ffmpeg -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | awk '/Summary/{s=1} s&&/I:/{print "loudness " $2 " LUFS"} s&&/Peak:/{print "true peak " $2 " dBTP"; if ($2+0 > -1) print "  ! the true peak is above -1 dB: lower the mix"}'
echo "✓ $OUT  +  ${OUT%.mp4}_contact.png"
