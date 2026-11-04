"""How much of a film is moving: % of frames with motion, and every hold longer than a second.

    python3 scripts/motion_check.py out/final.mp4            # an app ad: at least 60 % moving
    python3 scripts/motion_check.py out/final.mp4 --brand    # a brand film with a voice: at least 55 %

A frame "moves" when the top 1 % of its pixel difference from the previous frame is above 6 (12 fps, 160x90 grey;
keep these numbers so results compare with the references below).
References: the approved app ad measured 71 %; the approved brand film 56 % (two holds of 1.6 and 1.7 s while a
card builds under the captain's voice, and 2.2 s on the end logo). Premium motion pieces measure 66 to 75 %.
No hold may pass 1.8 s, except one that runs to the end of the film (the final logo).
"""
import subprocess
import sys

import numpy as np

FPS, W, H = 12, 160, 90


def measure(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', f'fps={FPS},scale={W}:{H},format=gray', '-f', 'rawvideo', '-'],
                         capture_output=True, check=True).stdout
    v = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)
    moving = np.array([np.percentile(np.abs(v[i] - v[i - 1]), 99) for i in range(1, len(v))]) > 6
    holds, r, start = [], 0, 0
    for i, m in enumerate(list(moving) + [True]):
        if not m:
            start = i if r == 0 else start
            r += 1
        elif r:
            holds.append((round(start / FPS, 2), round((r + 1) / FPS, 2)))   # a hold of r still steps spans r+1 frames
            r = 0
    return round(len(v) / FPS, 2), round(float(moving.mean()) * 100), holds


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args:
        print(__doc__); sys.exit(1)
    floor = 55 if '--brand' in sys.argv else 60
    dur, pct, holds = measure(args[0])
    print(f'{dur} s, moving {pct} % (aim: {floor} % or more), longest hold {max([d for _, d in holds], default=0)} s')
    for at, d in holds:
        if d > 1:
            print(f'  hold of {d} s at {at} s' + ('  (the end)' if at + d >= dur - 0.25 else ''))
    bad = [(at, d) for at, d in holds if d > 1.8 and at + d < dur - 0.25]
    if pct >= floor and not bad:
        print('OK')
    else:
        print('Too still: ' + ('; '.join(f'give the {d} s hold at {at} s a move' for at, d in bad) or f'only {pct} % moving'))
        sys.exit(2)
