#!/usr/bin/env bash
# Parallel frame render + encode. usage: scripts/render.sh <seconds> <jobs> <out.mp4>
# Runs N record.mjs jobs in the background (each owns a time range), waits, checks for blank frames, encodes with out/mix.wav.
set -e; END=$1; J=${2:-4}; OUT=${3:-out/video.mp4}
node build.mjs && python3 mix.py && rm -rf out/frames && mkdir -p out
step=$(python3 -c "print($END/$J)")
for i in $(seq 0 $((J-1))); do a=$(python3 -c "print(round($i*$step,3))"); b=$(python3 -c "print(round(($i+1)*$step,3))"); nohup node record.mjs frames $a $b > out/rec_$i.log 2>&1 & done
total=$(python3 -c "print(round($END*30))")
while [ "$(ls out/frames 2>/dev/null | wc -l)" -lt "$total" ] && pgrep -f "record.mjs frames" >/dev/null; do sleep 15; done; sleep 5
python3 -c "
import os,sys;n=$total;m=[i for i in range(n) if not os.path.exists(f'out/frames/f{i:05d}.jpg') or os.path.getsize(f'out/frames/f{i:05d}.jpg')<30000];print('blank/missing frames:',m[:10]);sys.exit(1 if m else 0)"
ffmpeg -v error -y -framerate 30 -i out/frames/f%05d.jpg -i out/mix.wav -c:v libx264 -preset veryfast -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration -of default=nw=1 "$OUT"
