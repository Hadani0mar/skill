"""Track one small detail (a passenger window, a badge) through a plate, so a 50× dive lands on it without jitter.

    python3 scripts/track.py <plate name> --at <frame> --box x,y,w,h [--every 3] [--deg 2]

  <plate name>   a folder made by scripts/plate.sh (public/plates/<name>/0001.jpg …)
  --at, --box    a frame where the detail is clear, and its box in source pixels (open that jpg and measure it)
  --range a,b    frames to track (default: the whole plate)

How: template matching (cv2.matchTemplate) on a 4× upsampled search window around the last position, every Nth frame,
then a smooth polynomial over the frames. A raw track jitters by a pixel or two; at 50× that is a 100 px shake, so the
film reads only the polynomial. Writes src/track.json (what src/Film.tsx reads) and out/track_check.png (raw points
and the fitted curve: they must agree; if a point jumps, the detail was lost there: shorten the range).
"""
import argparse
import glob
import json
import os

import cv2
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument('plate')
ap.add_argument('--at', type=int, required=True)
ap.add_argument('--box', required=True)
ap.add_argument('--range', default='')
ap.add_argument('--every', type=int, default=3)
ap.add_argument('--deg', type=int, default=2)
ap.add_argument('--fps', type=float, default=200, help='the plate fps (plate.sh default: 200)')
a = ap.parse_args()

files = sorted(glob.glob(f'public/plates/{a.plate}/*.jpg'))
if not files:
    raise SystemExit(f'no frames in public/plates/{a.plate}: run scripts/plate.sh first')
n = len(files)
f0, f1 = (map(int, a.range.split(','))) if a.range else (1, n)
x, y, w, h = map(float, a.box.split(','))
UP = 4                                             # the detail is small: match on a 4× upsampled crop
img = lambda f: cv2.imread(files[f - 1], cv2.IMREAD_GRAYSCALE)


def crop(im, cx, cy, hw, hh):
    x0, y0 = int(max(0, cx - hw)), int(max(0, cy - hh))
    c = im[y0:int(min(im.shape[0], cy + hh)), x0:int(min(im.shape[1], cx + hw))]
    return cv2.resize(c, None, fx=UP, fy=UP, interpolation=cv2.INTER_CUBIC), x0, y0


ref = img(a.at)
tpl, tx0, ty0 = crop(ref, x + w / 2, y + h / 2, w / 2 + 2, h / 2 + 2)
off = (x + w / 2 - tx0, y + h / 2 - ty0)            # the box centre inside the template, in source px


def track(direction):
    # Passenger windows are identical and evenly spaced: a wide search jumps to the neighbour. So each step searches
    # only a small area around where the detail should be now (last position + its velocity).
    pts, cx, cy, vx, vy = [], x + w / 2, y + h / 2, 0.0, 0.0
    R = max(8.0, 0.7 * max(w, h))                      # how far the match may land from the prediction, in px
    rng = range(a.at, f1 + 1, a.every) if direction > 0 else range(a.at, f0 - 1, -a.every)
    for f in rng:
        im = img(f)
        px_, py_ = cx + vx, cy + vy
        s, sx0, sy0 = crop(im, px_, py_, w / 2 + 2 + R, h / 2 + 2 + R)
        if s.shape[0] < tpl.shape[0] or s.shape[1] < tpl.shape[1]:
            break
        r = cv2.matchTemplate(s, tpl, cv2.TM_CCOEFF_NORMED)
        _, score, _, (mx, my) = cv2.minMaxLoc(r)
        if score < 0.5:
            print(f'  lost the detail at frame {f} (match {score:.2f}): stopping this direction')
            break
        nx, ny = sx0 + mx / UP + off[0], sy0 + my / UP + off[1]
        if pts:
            vx, vy = 0.6 * vx + 0.4 * (nx - cx), 0.6 * vy + 0.4 * (ny - cy)
        cx, cy = nx, ny
        pts.append((f, cx, cy, score))
    return pts


pts = sorted(set(track(-1) + track(1)))
if len(pts) < a.deg + 2:
    raise SystemExit('too few points: check --at and --box')
P = np.array(pts)
cx_, cy_ = np.polyfit(P[:, 0], P[:, 1], a.deg), np.polyfit(P[:, 0], P[:, 2], a.deg)
res = np.hypot(np.polyval(cx_, P[:, 0]) - P[:, 1], np.polyval(cy_, P[:, 0]) - P[:, 2])
H0, W0 = ref.shape
json.dump({'plate': f'plates/{a.plate}', 'n': n, 'fps': a.fps, 'src': [W0, H0], 'box': [x, y, w, h],
           'x': [float(v) for v in cx_], 'y': [float(v) for v in cy_]}, open('src/track.json', 'w'), indent=1)

# the check image: raw points (dots) against the fitted curve, over the reference frame
os.makedirs('out', exist_ok=True)
vis = cv2.imread(files[a.at - 1])
fs = np.arange(P[:, 0].min(), P[:, 0].max() + 1)
curve = np.stack([np.polyval(cx_, fs), np.polyval(cy_, fs)], 1).astype(np.int32)
cv2.polylines(vis, [curve], False, (60, 200, 255), 2, cv2.LINE_AA)
for _, px, py, _ in pts:
    cv2.circle(vis, (int(px), int(py)), 2, (255, 120, 80), -1, cv2.LINE_AA)
cv2.rectangle(vis, (int(x), int(y)), (int(x + w), int(y + h)), (80, 255, 80), 1)
cv2.imwrite('out/track_check.png', vis)
print(f'✓ src/track.json: {len(pts)} points over frames {int(P[:, 0].min())}–{int(P[:, 0].max())}, '
      f'fit error mean {res.mean():.2f} px, max {res.max():.2f} px   (check: out/track_check.png)')
if res.max() > max(2.0, h * 0.3):
    print('  a point is far from the curve: the detail was probably lost there. Shorten --range or raise --deg to 3.')
