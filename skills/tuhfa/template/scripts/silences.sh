#!/usr/bin/env bash
# Print the speech chunks of a voice-over (gaps between pauses). Map each chunk to a script phrase.
# usage: scripts/silences.sh voice.wav [noise_db=-38] [min_pause=0.15]
f=${1:-voice.wav}; n=${2:--38}; d=${3:-0.15}
ffprobe -v error -show_entries format=duration -of default=nw=1 "$f"
ffmpeg -i "$f" -af silencedetect=noise=${n}dB:d=$d -f null - 2>&1 | grep -oE "silence_(start|end): [0-9.]+" | paste - - | awk '{printf "pause %.2f-%.2f\n", $2, $4}'
