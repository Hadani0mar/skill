"""Is any picture shown bigger than its own pixels? (the human calls that «blurry», even at 1.8×)

    python3 scripts/assets_check.py

Reads src/film.json and every picture it uses, and prints the largest scale each one is shown at in src/Film.tsx:
skies and places fill the window box (the window + 12 %) and are pushed up to 1.06 × 1.1 by the drift and the bank;
the pass plate is shown at pass.scale of a 1920 px frame; the opening plate only below 1× before its dissolve.
Anything over 1.0 is an upscale: find a bigger file (a 4K frame of their film: ffmpeg -ss <t> -i film.mp4
-frames:v 1 sky.png; a photo URL without its resize parameters).
"""
import json
import sys

import cv2

F = json.load(open('src/film.json'))
hx, hy, hw, hh = F['shape']['hero']
BW, BH = hw * 1.12, hh * 1.12
PUSH = 1.06 * 1.1
bad = 0


def size(p):
    im = cv2.imread('public/' + p)
    if im is None:
        raise SystemExit(f'missing: public/{p}')
    return im.shape[1], im.shape[0]


def report(name, scale):
    global bad
    flag = 'ok  ' if scale <= 1.0 else 'UP  '
    bad += scale > 1.0
    print(f'{flag}{scale:4.2f}×  {name}')


for p in F['skies'] + [pl['img'] for pl in F['places']]:
    w, h = size(p)
    report(f'{p} ({w}x{h})', max(BW / w, BH / h) * PUSH)
if F['pass']['n'] > 1:
    w, h = F['pass']['src']
    report(f'{F["pass"]["plate"]} ({w}x{h})', max(F['pass']['scale']) * 1920 / w)
for p in [F.get('logo'), F.get('monogram'), F.get('cardLogo')]:
    if p and not p.endswith('.svg'):
        w, h = size(p)
        print(f'      {p}: {w}x{h} (a logo should be vector, or at least 2× the size it is shown)')
print('All pictures at or below their own size.' if not bad else f'{bad} picture(s) enlarged: they will look soft.')
sys.exit(1 if bad else 0)
