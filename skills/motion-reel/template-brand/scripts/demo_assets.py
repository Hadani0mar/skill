"""Placeholder pictures and sounds, so the starter film renders before you have the brand's files.

    python3 scripts/demo_assets.py

Makes: a plate of a plain airliner shape drifting past (public/plates/opening, 400 frames «at 200 fps») and tracks
one of its windows with scripts/track.py; a close pass (public/plates/pass); three skies and three places (sized for
the window: 1820 px tall, so they are never enlarged); a placeholder logo; two synthetic sounds.
EVERY ONE OF THESE IS A STAND-IN. Replace them with the brand's own films (scripts/plate.sh), their photos and their
logo, and real recorded sounds. A drawn gradient sky in the final film reads as cheap.
"""
import os
import re
import subprocess
import sys

import cv2
import numpy as np

rng = np.random.default_rng(7)
os.makedirs('public/plates/opening', exist_ok=True)
for d in ('public/sky', 'public/places', 'public/brand', 'sfx'):
    os.makedirs(d, exist_ok=True)


def grad(h, w, top, bottom):
    t = np.linspace(0, 1, h)[:, None, None]
    return (np.array(top)[None, None] * (1 - t) + np.array(bottom)[None, None] * t).repeat(w, 1).astype(np.float32)


def clouds(img, n, seed, alpha=0.35):
    r = np.random.default_rng(seed)
    m = np.zeros(img.shape[:2], np.float32)
    for _ in range(n):
        cv2.ellipse(m, (int(r.uniform(0, img.shape[1])), int(r.uniform(img.shape[0] * 0.3, img.shape[0]))),
                    (int(r.uniform(80, 260)), int(r.uniform(20, 60))), 0, 0, 360, 1, -1, cv2.LINE_AA)
    m = cv2.GaussianBlur(m, (0, 0), 25)[..., None]
    return img * (1 - alpha * m) + 255 * alpha * m


def save(path, img):
    img = img + rng.normal(0, 2.0, img.shape)        # a little grain: flat digital colour bands
    cv2.imwrite(path, np.clip(img, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])


# the plate: a sky and a plain fuselage with a row of windows, drifting left and bobbing slightly
sky = clouds(grad(1080, 1920, (235, 200, 160), (250, 235, 220)), 18, 1)       # BGR
for k in range(400):
    f = sky.copy()
    x0, y0 = 1500 - k * 0.9, 540 + 6 * np.sin(k / 70)
    pts = np.array([[x0 - 1100, y0 - 70], [x0 + 300, y0 - 70], [x0 + 420, y0 - 20], [x0 + 420, y0 + 20], [x0 + 300, y0 + 70], [x0 - 1100, y0 + 70]], np.int32)
    cv2.fillPoly(f, [pts], (238, 236, 234), cv2.LINE_AA)
    cv2.rectangle(f, (int(x0 - 1100), int(y0 + 40)), (int(x0 + 300), int(y0 + 70)), (140, 60, 50), -1, cv2.LINE_AA)
    for j in range(36):                               # windows 15×25 px
        wx = x0 - 1000 + j * 36
        cv2.rectangle(f, (int(wx), int(y0 - 30)), (int(wx + 15), int(y0 - 5)), (70, 60, 55), -1, cv2.LINE_AA)
    save(f'public/plates/opening/{k + 1:04d}.jpg', f)
# window 28 at frame 1 sits at x0 − 1000 + 28·36 = 1508 … 1523, y 510 … 535
subprocess.run([sys.executable, 'scripts/track.py', 'opening', '--at', '1', '--box', '1508,510,15,25', '--range', '1,300'], check=True)

# the pass: the same airliner, big and close, sliding by (played at 0.3× in the film)
os.makedirs('public/plates/pass', exist_ok=True)
for k in range(300):
    f = clouds(grad(1080, 1920, (200, 150, 110), (235, 205, 175)), 12, 5).copy()
    x0, y0 = 2300 - k * 4.0, 560
    cv2.ellipse(f, (int(x0), int(y0)), (1500, 150), 0, 0, 360, (238, 236, 234), -1, cv2.LINE_AA)
    cv2.rectangle(f, (int(x0 - 1500), int(y0 + 60)), (int(x0 + 1300), int(y0 + 110)), (140, 60, 50), -1, cv2.LINE_AA)
    for j in range(40):
        wx = x0 - 1300 + j * 70
        cv2.rectangle(f, (int(wx), int(y0 - 60)), (int(wx + 30), int(y0 - 10)), (70, 60, 55), -1, cv2.LINE_AA)
    save(f'public/plates/pass/{k + 1:04d}.jpg', f)
fj = open('src/film.json').read()
open('src/film.json', 'w').write(re.sub(r'("plate": "plates/pass", "n": )\d+', lambda m: m.group(1) + '300', fj))

# skies through the window (sunset, night, dawn) and three places
save('public/sky/1.jpg', clouds(grad(1820, 1040, (120, 110, 230), (90, 160, 250)), 14, 2))
save('public/sky/2.jpg', clouds(grad(1820, 1040, (60, 20, 20), (110, 50, 40)), 10, 3, 0.15))
save('public/sky/3.jpg', clouds(grad(1820, 1040, (200, 170, 140), (170, 190, 250)), 14, 4))
for i, (top, bottom, horizon) in enumerate([((230, 190, 120), (170, 120, 40), 1100), ((180, 210, 240), (90, 160, 210), 1180), ((160, 140, 120), (60, 60, 70), 1050)]):
    p = grad(1820, 1040, top, bottom)
    hz = np.arange(1040)
    if i == 2:                                        # a far skyline
        for b in range(30):
            x = int(rng.uniform(0, 1040)); w = int(rng.uniform(30, 90)); h = int(rng.uniform(80, 300))
            cv2.rectangle(p, (x, horizon - h), (x + w, 1820), (50, 45, 50), -1)
    else:
        y = (horizon + 25 * np.sin(hz / (90 + 40 * i))).astype(int)
        for x in range(1040):
            p[y[x]:, x] = (120, 100, 60) if i == 0 else (90, 160, 200)
    save(f'public/places/{i + 1}.jpg', p)

# a placeholder logo: a ring (replace it with their vector logo from their site; never redraw a logo)
logo = np.zeros((512, 512, 4), np.uint8)
cv2.circle(logo, (256, 256), 200, (255, 255, 255, 255), 18, cv2.LINE_AA)
cv2.circle(logo, (256, 256), 120, (255, 255, 255, 255), -1, cv2.LINE_AA)
cv2.imwrite('public/brand/logo.png', logo)

# two synthetic sounds (stand-ins for real recordings: a soft air move and an air bed)
SR = 48000
def wav(path, x):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', path], input=x.astype(np.float32).tobytes(), check=True)
n = rng.normal(0, 1, SR * 2)
t = np.linspace(0, 1, len(n))
sw = np.convolve(n, np.ones(40) / 40, 'same') * np.exp(-((t - 0.45) / 0.15) ** 2)
wav('sfx/demo_whoosh.wav', sw / np.abs(sw).max() * 0.5)
bed = np.convolve(rng.normal(0, 1, SR * 16), np.ones(200) / 200, 'same')
wav('sfx/demo_bed.wav', bed / np.abs(bed).max() * 0.5)
print('✓ placeholders in public/ and sfx/. Now: npm run studio   (or bash scripts/render.sh)')
