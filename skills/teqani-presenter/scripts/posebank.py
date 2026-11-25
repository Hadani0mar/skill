"""Render the presenter pose library once: look (camera->laptop) x mouth opening x vowel, plus
blinks and a smile. Any later video is assembled from these frames by blending neighbours."""
import os, sys, cv2, numpy as np, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import CHAR, POSEBANK

LOOKS = [-1, -.5, 0, .25, .5, .75, 1]
MOUTHS = [0, .2, .4, .6, .8, 1]
VOWELS = {'a': dict(), 'e': dict(eee=8), 'o': dict(woo=6)}
OUT = str(POSEBANK)

def ctl(L, M, v='a', blink=0, smile=0):
    c = dict(pitch=9 * L + 1.2 * M, yaw=-2 * L, pupil_y=-8 * L, eyes=-12 * blink, mouth=42 * M, smile=smile)
    for k, val in VOWELS[v].items(): c[k] = val * M
    return c

def name(L, M, v='a', blink=0, smile=0):
    return f'L{int(L*100):+04d}_M{int(M*100):03d}_{v}_b{blink}_s{int(smile*100)}'

def jobs():
    for L in LOOKS:
        yield (L, 0, 'a', 0, 0)
        yield (L, 0, 'a', 1, 0)
        for M in MOUTHS[1:]:
            for v in VOWELS: yield (L, M, v, 0, 0)
    for L in (0, 1):
        yield (L, 0, 'a', 0, .35)

if __name__ == '__main__':
    from lp import Face
    os.makedirs(OUT, exist_ok=True)
    f = Face(cv2.imread(str(CHAR))[:, :, ::-1].copy())
    J = list(jobs()); t0 = time.time()
    for k, j in enumerate(J):
        p = f'{OUT}/{name(*j)}.jpg'
        if os.path.exists(p): continue
        im = f.render(**ctl(*j))
        cv2.imwrite(p, np.clip(im, 0, 255).astype(np.uint8)[:, :, ::-1], [cv2.IMWRITE_JPEG_QUALITY, 93])
        print(k, len(J), round(time.time() - t0), flush=True)
    print('DONE', flush=True)
