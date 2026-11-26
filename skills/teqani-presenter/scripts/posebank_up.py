"""Extra poses: looking UP at the floating screen (U = 0.5, 1)."""
import os, sys, cv2, numpy as np, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import CHAR
from posebank import MOUTHS, VOWELS, OUT
UPS = [.5, 1]
def ctl(U, M, v='a', blink=0):
    c = dict(pitch=-9 * U + 1.2 * M, yaw=0, pupil_y=10 * U, eyes=-12 * blink + 3 * U, mouth=42 * M)
    for k, val in VOWELS[v].items(): c[k] = val * M
    return c
def name(U, M, v='a', blink=0): return f'U{int(U*100):03d}_M{int(M*100):03d}_{v}_b{blink}'
if __name__ == '__main__':
    from lp import Face
    f = Face(cv2.imread(str(CHAR))[:, :, ::-1].copy())
    J = []
    for U in UPS:
        J += [(U, 0, 'a', 0), (U, 0, 'a', 1)] + [(U, M, v, 0) for M in MOUTHS[1:] for v in VOWELS]
    t0 = time.time()
    for k, j in enumerate(J):
        p = f'{OUT}/{name(*j)}.jpg'
        if os.path.exists(p): continue
        cv2.imwrite(p, np.clip(f.render(**ctl(*j)), 0, 255).astype(np.uint8)[:, :, ::-1], [cv2.IMWRITE_JPEG_QUALITY, 93])
        print(k, len(J), round(time.time() - t0), flush=True)
    print('DONE', flush=True)
