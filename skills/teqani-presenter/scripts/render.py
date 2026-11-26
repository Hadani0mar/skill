"""Install-as-app v4 compositor (system monitor, calm transition).   python3 render3.py out_dir
Hook on the presenter (no screen) -> Clawd flies up and becomes the screen -> walkthrough ->
screen collapses back into Clawd who lands on the shoulder."""
import sys, os, math, random
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import *
import importlib
T = importlib.import_module(os.environ.get('TIMELINE', 'timeline_install_as_app'))
sys.modules['timeline'] = T
import clawd as CL
from posebank import MOUTHS, name as nameL
from posebank_up import name as nameU

W, H, FPS, N = 1080, 1920, T.FPS, T.N
OUT = sys.argv[1]; os.makedirs(OUT, exist_ok=True)
FONT = str(FONT_AR)
LAT = str(FONT_LAT)
ORANGE = (217, 119, 87); WHITE = (255, 255, 255)
random.seed(7)
S = 736; SC = W / S; CY0 = H - W
ease, window = T.ease, T.window
lerp = lambda a, b, p: a + (b - a) * p

src = np.ascontiguousarray(cv2.imread(str(CHAR))[:, :, ::-1]).astype(np.float32)

# ---------- background ----------
top = cv2.GaussianBlur(src[:90].mean(axis=0)[None], (0, 0), 25)[0]
col = cv2.resize(top[None], (W, 1))[0]
k = (np.minimum(1, np.arange(H) / CY0) ** 1.4)[:, None, None]
bg = np.broadcast_to(col[None], (H, W, 3)) * (0.45 + 0.55 * k)
bok = Image.new('RGB', (W, H)); d = ImageDraw.Draw(bok)
for _ in range(26):
    x, y = random.randint(0, W), random.randint(80, CY0 + 200); r = random.randint(6, 34)
    c = random.choice([(60, 255, 120), (255, 70, 70), (150, 90, 255), (120, 80, 220)])
    a = random.uniform(.06, .22) * (1.2 if x < W * .35 else .6)
    d.ellipse((x - r, y - r, x + r, y + r), fill=tuple(int(v * a) for v in c))
bg = np.clip(bg + np.asarray(bok.filter(ImageFilter.GaussianBlur(9)), np.float32), 0, 255).astype(np.float32)
BG = Image.fromarray(bg.astype(np.uint8)).convert('RGBA')

fm = np.ones((S, S), np.float32)
for y in range(200): fm[y] = (y / 200) ** 1.3
fm = np.repeat(fm[..., None], 3, 2)

# ---------- pose bank (gaze G: 0 camera .. 1 up) ----------
_bank = {}
def load(key):
    if key not in _bank:
        _bank[key] = cv2.imread(f'{POSEBANK}/{key}.jpg')[:, :, ::-1].copy()
    return _bank[key].astype(np.float32)
def pose(g, M, v='a', b=0):
    return load(nameL(0, M, v, b, 0)) if g == 0 else load(nameU(g, M, v, b))
def nbr(vals, x):
    x = min(max(x, vals[0]), vals[-1])
    for i in range(len(vals) - 1):
        if x <= vals[i + 1]:
            w = (x - vals[i]) / (vals[i + 1] - vals[i]); return [(vals[i], 1 - w), (vals[i + 1], w)]
    return [(vals[-1], 1)]
GV = [0, .5, 1]
def face(st):
    vw = {'a': 1 - abs(st['V']), 'e': max(0, st['V']), 'o': max(0, -st['V'])}
    img = np.zeros((S, S, 3), np.float32)
    for g, wg in nbr(GV, st['G']):
        if wg < 1e-3: continue
        for M, wm in nbr(MOUTHS, st['M']):
            if wm < 1e-3: continue
            if M == 0: img += wg * wm * pose(g, 0)
            else:
                for v, w in vw.items():
                    if w > 1e-3: img += wg * wm * w * pose(g, M, v)
    closed = 1 - st['M']
    if st['blink'] > 0:
        bl = sum(wg * pose(g, 0, 'a', 1) for g, wg in nbr(GV, st['G']) if wg > 1e-3)
        img = img * (1 - st['blink'] * closed) + bl * st['blink'] * closed
    if st['smile'] > 0:
        w = st['smile'] * closed * (1 - st['G'])
        img = img * (1 - w) + load(nameL(0, 0, 'a', 0, .35)) * w
    return img

# ---------- screen ----------
SX, SY, SW = 90, 130, 900; SH = int(SW * 600 / 960); BZ = 12
def rounded(w, h, r):
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, w - 1, h - 1), r, fill=255); return m
glow = Image.new('RGBA', (SW + 200, SH + 200), (0, 0, 0, 0))
ImageDraw.Draw(glow).rounded_rectangle((100, 100, SW + 100, SH + 100), 30, fill=(217, 119, 87, 90))
glow = glow.filter(ImageFilter.GaussianBlur(45))
smask = np.asarray(rounded(SW, SH, 20))
EV = T.EV
CAM = [(0, 480, 255, 620), (EV['typeB'] - .2, 480, 255, 620), (EV['reply'] + .1, 640, 200, 600),
       (EV['panel'] - .1, 640, 200, 600), (EV['panel'] + .4, 680, 265, 800), (EV['share'] - 1.1, 680, 265, 800),
       (EV['share'] - .5, 540, 170, 540), (EV['dlg'] - .05, 540, 170, 540), (EV['dlg'] + .25, 480, 300, 580),
       (EV['install'] + .2, 480, 300, 580), (EV['desk'] + .1, 480, 300, 960), (EV['mbitem'] - .1, 480, 300, 960),
       (EV['mbitem'] + .45, 760, 110, 480), (EV['pop'] - .1, 760, 110, 480), (EV['pop'] + .35, 640, 170, 600), (EV['note'] - .2, 640, 170, 600), (EV['note'] + .3, 700, 150, 560), (999, 700, 150, 560)]
def cam(t):
    for a, b in zip(CAM, CAM[1:]):
        if a[0] <= t <= b[0]:
            p = ease((t - a[0]) / (b[0] - a[0])); return [lerp(a[j], b[j], p) for j in (1, 2, 3)]
    return CAM[0][1:] if t < CAM[0][0] else CAM[-1][1:]
NSF = int(os.environ.get('NSF', len(os.listdir(SCREEN_FRAMES))))
def screen_img(t):
    i = min(int(t * FPS), NSF - 1)
    big = Image.open(f'{SCREEN_FRAMES}/{i:04d}.png').convert('RGBA')
    cx, cy, w = cam(t); h = w * 600 / 960
    cx = min(max(cx, w / 2), 960 - w / 2); cy = min(max(cy, h / 2), 600 - h / 2)
    im = big.crop(tuple(int(v * 2) for v in (cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2))).resize((SW, SH), Image.LANCZOS)
    im.putalpha(Image.fromarray(np.minimum(np.asarray(im.getchannel('A')), smask)))
    return im

# pixel-block reveal order: from the centre outwards, with jitter
BLK = 47
cols, rows = math.ceil(SW / BLK), math.ceil(SH / BLK)
order = {}
for r in range(rows):
    for c in range(cols):
        dx = (c + .5) / cols - .5; dy = ((r + .5) / rows - .5) * .64
        order[(r, c)] = min(1, math.hypot(dx, dy) / .6 + random.uniform(-.12, .12))
def block_mask(p):
    m = Image.new('L', (SW, SH), 0); dm = ImageDraw.Draw(m)
    for (r, c), o in order.items():
        if p >= o: dm.rectangle((c * BLK, r * BLK, c * BLK + BLK - 1, r * BLK + BLK - 1), fill=255)
    return np.asarray(m)

# ---------- Clawd placement ----------
CLX, CLY = int(CLAWD_FEET[0] * SC), CY0 + int(CLAWD_FEET[1] * SC) + CL.PAD   # feet on the shoulder (per variant)
SCX, SCY = SX + SW / 2, SY + SH / 2
def clawd_at(img, t, cx, cy, s, alpha=1.0):
    c = CL.frame(t)
    if s != 1: c = c.resize((int(c.width * s), int(c.height * s)), Image.NEAREST)
    if alpha < 1:
        c.putalpha(Image.fromarray((np.asarray(c.getchannel('A')) * alpha).astype(np.uint8)))
    img.alpha_composite(c, (int(cx - c.width / 2), int(cy - c.height / 2)))
REST = (CLX, CLY - CL.frame(0).height / 2 + 10)
def flight_pos(p):            # arc from shoulder to screen centre
    x = lerp(REST[0], SCX, ease(p)); y = lerp(REST[1], SCY, p) - 260 * math.sin(math.pi * p)
    return x, y
TORSO = (2 * CL.U, 6 * CL.U, 11 * CL.U, 7 * CL.U)    # torso in Clawd frame px (minus PAD)

def bar_open(img, t, wbar, hopen, col_p, content=0.0):
    """wbar: 0..1 torso->full-width bar; hopen: 0..1 bar->full screen height; col_p: orange->bezel."""
    s0 = 2.2
    w0, h0 = TORSO[2] * s0, TORSO[3] * s0
    fw, fh = SW + BZ * 2, SH + BZ * 2
    w = lerp(w0, fw, ease(wbar)); hb = lerp(h0, 16, ease(wbar))
    h = lerp(hb, fh, ease(hopen))
    col = tuple(int(lerp(a, b, ease(col_p))) for a, b in zip(CL.BODY, (16, 10, 24)))
    layer = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dl = ImageDraw.Draw(layer)
    if hopen > 0:
        g = glow.copy(); g.putalpha(Image.fromarray((np.asarray(g.getchannel('A')) * ease(hopen)).astype(np.uint8)))
        layer.alpha_composite(g, (SX - 100, SY - 100))
    cy = SCY + lerp(1.5 * CL.U * s0, 0, ease(wbar))
    dl.rounded_rectangle((SCX - w / 2, cy - h / 2, SCX + w / 2, cy + h / 2), int(lerp(6, 30, ease(hopen))),
                         fill=col + (255,), outline=(90, 70, 120, int(255 * ease(hopen))), width=2)
    ea = 1 - ease(wbar / .6)                      # his eyes squeeze shut as he flattens
    if ea > 0 and hopen == 0:
        ew = CL.U * s0; eh = 2 * CL.U * s0 * ea
        for ex in (-3 * CL.U * s0, 3 * CL.U * s0):
            dl.rectangle((SCX + ex - ew / 2, cy - eh / 2 - .5 * CL.U * s0, SCX + ex + ew / 2, cy + eh / 2 - .5 * CL.U * s0), fill=(0, 0, 0, 255))
    img.alpha_composite(layer)
    if content > 0:
        scr = screen_img(t)
        sc_ = lerp(.97, 1, ease(content))
        scr = scr.resize((int(SW * sc_), int(SH * sc_)), Image.BICUBIC)
        scr.putalpha(Image.fromarray((np.asarray(scr.getchannel('A')) * ease(content)).astype(np.uint8)))
        img.alpha_composite(scr, (int(SCX - scr.width / 2), int(SCY - scr.height / 2)))

def screen_full(img, t, reveal=1.0):
    fl = int(4 * math.sin(2 * math.pi * t / 4.2))
    img.alpha_composite(glow, (SX - 100, SY - 100 + fl))
    ImageDraw.Draw(img).rounded_rectangle((SX - BZ, SY - BZ + fl, SX + SW + BZ, SY + SH + BZ + fl), 30,
                                          fill=(16, 10, 24, 255), outline=(90, 70, 120, 255), width=2)
    scr = screen_img(t)
    if reveal < 1:
        m = block_mask(reveal)
        scr.putalpha(Image.fromarray(np.minimum(np.asarray(scr.getchannel('A')), m)))
        # bright edge blocks flashing as they land
        flash = block_mask(min(1, reveal + .12)).astype(np.int16) - m
        fl_img = Image.new('RGBA', (SW, SH), CL.BODY + (0,)); fl_img.putalpha(Image.fromarray((flash * .85).astype(np.uint8)))
        img.alpha_composite(fl_img, (SX, SY + fl))
    img.alpha_composite(scr, (SX, SY + fl))

# ---------- captions ----------
F = ImageFont.truetype(FONT, 112, layout_engine=ImageFont.Layout.RAQM)
FL = ImageFont.truetype(LAT, 76, layout_engine=ImageFont.Layout.RAQM); FL.set_variation_by_axes([800])
FH = ImageFont.truetype(LAT, 34, layout_engine=ImageFont.Layout.RAQM); FH.set_variation_by_axes([600])
SPACE = 26
_wc = {}
def word_img(w, accent):
    if (w, accent) in _wc: return _wc[(w, accent)]
    latin = all(ord(c) < 128 for c in w)
    f = FL if latin else F; dirn = 'ltr' if latin else 'rtl'
    bb = f.getbbox(w, direction=dirn); pad = 30
    im = Image.new('RGBA', (bb[2] - bb[0] + pad * 2, 230), (0, 0, 0, 0))
    oy = 45 if not latin else 75
    sh = Image.new('RGBA', im.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).text((pad - bb[0], oy), w, font=f, fill=(10, 0, 25, 220), direction=dirn)
    im.alpha_composite(sh.filter(ImageFilter.GaussianBlur(10)), (0, 8))
    ImageDraw.Draw(im).text((pad - bb[0], oy), w, font=f, fill=ORANGE if accent else WHITE, direction=dirn)
    _wc[(w, accent)] = (im, bb[2] - bb[0]); return _wc[(w, accent)]
def merge_latin(words):
    out = []
    for w in words:
        if out and w[0] != '|' and out[-1][0] != '|' and all(ord(c) < 128 for c in w[0]) \
                and all(ord(c) < 128 for c in out[-1][0]):
            out[-1] = (out[-1][0] + ' ' + w[0], out[-1][1], max(out[-1][2], w[2]))
        else: out.append(w)
    return out
def ease_back(p):
    p = max(0, min(1, p)); c = 1.9
    return 1 + (c + 1) * (p - 1) ** 3 + c * (p - 1) ** 2
def cap_s(t):
    return window(t, T.BAR[0], T.UNBAR[1], .5)
def draw_captions(canvas, t):
    for a, b, words in T.CAPTIONS:
        if not (a - .05 <= t <= b + .12): continue
        out = min(1, max(0, (t - b) / .12))
        rows, cur = [], []
        for w in merge_latin(words):
            if w[0] == '|': rows.append(cur); cur = []
            else: cur.append(w)
        rows.append(cur)
        cs = cap_s(t); sc = lerp(1, .86, cs); gap = lerp(140, 112, cs)
        y = lerp(600 - (len(rows) - 1) * 70, 770, cs)
        for row in rows:
            items = [(w, *word_img(w[0], w[2])) for w in row]
            rw = (sum(i[2] for i in items) + SPACE * (len(items) - 1)) * sc
            x = (W + rw) / 2
            for w, im, ww in items:
                p = (t - w[1]) / .22
                if p > 0:
                    s = ease_back(p) * (1 - .12 * out) * sc; al = min(1, p * 3) * (1 - out)
                    wi = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.BICUBIC)
                    if al < 1:
                        wi.putalpha(Image.fromarray((np.asarray(wi.getchannel('A'), np.float32) * al).astype(np.uint8)))
                    cy = y + 40 - out * 25 + (1 - min(1, p)) * 24
                    canvas.alpha_composite(wi, (int(x - ww * sc / 2 - wi.width / 2), int(cy - wi.height / 2)))
                x -= (ww + SPACE) * sc
            y += gap

hand = Image.new('RGBA', (W, 80), (0, 0, 0, 0))
ImageDraw.Draw(hand).text((W / 2, 40), 'teqani.ly', font=FH, fill=(255, 255, 255, 150), anchor='mm')

# ---------- presenter framing: whisper close-up, then pull out; punch on «والأغرب» ----------
def zoom(t):
    z = lerp(1.22, 1.0, ease(t / 3.0))
    l2 = T.find(['مش'], 1.0) or 3.0
    z += .06 * window(t, l2, l2 + .8, .12)
    return z

# ---------- render ----------
ONLY = [int(x) for x in os.environ.get('ONLY', '').split(',') if x]
trail = []
for i in (ONLY or range(N)):
    t = i / FPS
    st = T.state(t)
    fr = face(st)
    br = 1 + .006 * math.sin(2 * math.pi * t / 3.6)
    size = int(W * br)
    ch = cv2.resize(fr, (size, size), interpolation=cv2.INTER_CUBIC)
    fmask = cv2.resize(fm, (size, size))
    canvas = bg.copy()
    y0 = H - size + 4; x0 = (W - size) // 2
    sub = ch[0:H - y0, max(0, -x0):max(0, -x0) + W]
    msk = fmask[0:H - y0, max(0, -x0):max(0, -x0) + W]
    xs = max(0, x0)
    canvas[y0:y0 + sub.shape[0], xs:xs + sub.shape[1]] = \
        canvas[y0:y0 + sub.shape[0], xs:xs + sub.shape[1]] * (1 - msk) + sub * msk
    img = Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8)).convert('RGBA')
    dy = H - size + 4 - CY0
    # --- Clawd / screen states
    h0, h1 = T.HOP; b0_, b1_ = T.BAR; o0, o1 = T.OPEN; c0, c1 = T.CLOSE; ub0, ub1 = T.UNBAR; hb0, hb1 = T.HOPBACK
    if t < h0 or t >= hb1:
        clawd_at(img, t, REST[0], REST[1] + dy, 1)
    elif t < h1:                                       # one smooth hop up, growing a little
        p = ease((t - h0) / (h1 - h0))
        x = lerp(REST[0], SCX, p); y = lerp(REST[1] + dy, SCY, p) - 120 * math.sin(math.pi * p)
        clawd_at(img, t, x, y, lerp(1, 2.2, p))
    elif t < b1_:                                      # body stretches into a thin orange bar
        bar_open(img, t, (t - b0_) / (b1_ - b0_), 0, 0)
    elif t < c0:                                       # bar opens into the screen, content fades in
        po = (t - o0) / (o1 - o0)
        bar_open(img, t, 1, po, po, (t - T.FADEIN[0]) / (T.FADEIN[1] - T.FADEIN[0]))
    elif t < c1:                                       # close: content fades, screen folds to the bar
        pc = (t - c0) / (c1 - c0)
        bar_open(img, t, 1, 1 - pc, 1 - pc, 1 - pc * 1.6)
    elif t < ub1:
        bar_open(img, t, 1 - (t - ub0) / (ub1 - ub0), 0, 0)
    else:                                              # hop back down to the shoulder
        p = ease((t - hb0) / (hb1 - hb0))
        x = lerp(SCX, REST[0], p); y = lerp(SCY, REST[1] + dy, p) - 120 * math.sin(math.pi * p)
        clawd_at(img, t, x, y, lerp(2.2, 1, p))
    # whisper close-up framing on the whole picture
    z = zoom(t)
    if z > 1.001:
        fx, fy = W / 2, CY0 + 330 * SC                 # zoom around his face
        w2, h2 = W / z, H / z
        x1 = min(max(fx - w2 / 2, 0), W - w2); y1 = min(max(fy - h2 * .62, 0), H - h2)
        img = img.crop((int(x1), int(y1), int(x1 + w2), int(y1 + h2))).resize((W, H), Image.BICUBIC)
    draw_captions(img, t)
    img.alpha_composite(hand, (0, 40))
    img.convert('RGB').save(f'{OUT}/{i:04d}.jpg', quality=92)
print('frames', N)
