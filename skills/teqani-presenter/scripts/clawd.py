"""Clawd drawn from clawd-pet's static-base grid (15x16 units, MIT), animated as pure pixel art:
crisp edges at every frame, no transforms that bend the shape."""
import math
from PIL import Image, ImageDraw, ImageFilter
from timeline import look, CLAWD_BLINKS, CLAWD_WAVE

BODY = (222, 136, 109); EYE = (0, 0, 0); OUTL = (38, 12, 34)
U = 13                                  # px per grid unit
PAD = 3 * U

def frame(t):
    W, H = 15 * U + PAD * 2, 16 * U + PAD * 2
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    R = lambda x, y, w, h, c, dy=0: d.rectangle((PAD + x * U, PAD + y * U + dy,
                                                 PAD + (x + w) * U - 1, PAD + (y + h) * U - 1 + dy), fill=c)
    # hop once while waving, then a slow 2-px breath
    hop = 0
    a, b = CLAWD_WAVE
    if a <= t <= a + .35:
        hop = -round(10 * math.sin(math.pi * (t - a) / .35))
    breath = -2 if math.sin(t * 2 * math.pi / 3.2) > .3 else 0
    up = hop + breath
    # legs (stay planted unless hopping)
    for x in (3, 5, 9, 11):
        R(x, 13, 1, 2, BODY, hop)
    R(2, 6, 11, 7, BODY, up)                          # torso
    if up < hop:                                      # keep the torso joined to the legs
        d.rectangle((PAD + 2 * U, PAD + 13 * U + up, PAD + 13 * U - 1, PAD + 13 * U + hop), fill=BODY)
    R(13, 9, 2, 2, BODY, up)                          # arm toward the presenter
    if a <= t <= b:                                   # wave with the outer arm
        upf = int((t - a) / .16) % 2 == 0
        R(0, 6 if upf else 7, 1, 3, BODY, up); R(1, 8 if upf else 9, 1, 2, BODY, up)
    else:
        R(0, 9, 2, 2, BODY, up)
    # eyes: camera -> laptop (down-right), snapped to the grid
    lk = look(t)
    ex = 1 if lk > .5 else 0
    ey = 1 if lk > .5 else 0
    blink = any(abs(t - c) < .08 for c in CLAWD_BLINKS)
    for x in (4, 10):
        if blink:
            d.rectangle((PAD + (x + ex) * U, PAD + int((9.2 + ey) * U) + up,
                         PAD + (x + ex + 1) * U - 1, PAD + int((9.2 + ey) * U) + up + 2), fill=EYE)
        else:
            R(x + ex, 8 + ey, 1, 2, EYE, up)
    # dark outline so he reads against the orange jacket
    alpha = im.getchannel('A')
    ring = alpha.filter(ImageFilter.MaxFilter(7))
    out = Image.new('RGBA', im.size, OUTL + (0,)); out.putalpha(ring.point(lambda v: int(v * .9)))
    out.alpha_composite(im)
    return out

if __name__ == '__main__':
    ts = [0.4, 0.5, 0.9, 2.0, 3.0, 3.3, 5.0, 8.4]
    fr = [frame(t) for t in ts]
    sheet = Image.new('RGBA', (fr[0].width * len(fr), fr[0].height), (60, 30, 70, 255))
    for k, f in enumerate(fr): sheet.alpha_composite(f, (k * f.width, 0))
    sheet.save('clawd_preview.png')
