"""Install-as-app v4 (system-monitor example). Every event is anchored to a word of the
user's own voice-over (Scribe word timings), so a new recording re-times everything.
Env: VOICE=<audio file>  WORDS=<scribe words.json>"""
import json, math, os, re, subprocess
import numpy as np

FPS = 30
_EX = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'examples', 'install-as-app')
AUDIO = os.environ.get('VOICE', os.path.join(_EX, 'voice.mp3'))
WORDS_F = os.environ.get('WORDS', os.path.join(_EX, 'words.json'))
RAW = [w for w in json.load(open(WORDS_F))['words'] if w.get('type') == 'word' and not w['text'].startswith('[')]
STRIP = '…؟.،:!?«»"\''
def clean(s): return s.translate(str.maketrans('', '', STRIP)).strip()
for w in RAW: w['c'] = clean(w['text'])

def find(keys, after=0.0, which='start', default=None):
    """first word at/after `after` whose cleaned text contains any key"""
    for w in RAW:
        if w['start'] + 1e-3 >= after and any(k.lower() in w['c'].lower() for k in keys):
            return w[which]
    return default

END_T = RAW[-1]['end']
DUR = math.ceil((END_T + 1.6) * FPS) / FPS
N = int(DUR * FPS)

# ---- anchors (script v4) ----
TRANS = find(['شوف'], 2.0) or 5.0                       # line 3 «شوف… جملة وحدة بس»
typeA = find(['ديرلي'], TRANS) or TRANS + 2
typeB = find(['جهازي'], typeA, 'end') or typeA + 3
reply = find(['وفي', 'ثواني'], typeB) or typeB + .3
card = find(['جاهز'], reply) or reply + 1
R1 = find(['توا'], card) or card + 1.2                   # re-hook 1
share = find(['share', 'شير'], R1) or R1 + 2
item = find(['install', 'انستول'], share) or share + .8
dlg = (find(['app', 'اب'], item, 'end') or item + .8) + .1
install = dlg + .55
desk = install + .3
mbitem = max(desk + .25, find(['ولّى', 'ولى'], desk - 1) or desk + .4)
pop = find(['والرام'], mbitem) or mbitem + 1.2
R2 = find(['والأحلى', 'الأحلى', 'والاحلى'], pop) or pop + 3
note = find(['إشعار', 'اشعار'], R2) or R2 + 1
ram = note - .9
END = find(['والميزة', 'الميزة'], note) or note + 2      # screen folds back into Clawd

EV = dict(chat=0, typeA=typeA, typeB=typeB, reply=reply + .1, card=card, panel=card + .25, share=share,
          item=item, dlg=dlg, install=install, desk=desk, mbitem=mbitem, pop=pop, ram=ram, note=note, end=END)

# transition (calm): crouch, one hop up, unfold bar -> screen
HOP = (TRANS + .10, TRANS + .70)
BAR = (HOP[1], HOP[1] + .28)
OPEN = (BAR[1], BAR[1] + .38)
FADEIN = (OPEN[1] - .05, OPEN[1] + .25)
SCREEN_ON = OPEN[1]
CLOSE = (END, END + .3)           # content fades, screen closes to bar
UNBAR = (CLOSE[1], CLOSE[1] + .25)
HOPBACK = (UNBAR[1], UNBAR[1] + .6)

def ease(p):
    p = min(1, max(0, p)); return p * p * (3 - 2 * p)
def window(t, a, b, ramp=.35):
    return ease((t - a) / ramp) * (1 - ease((t - b) / ramp))

UP = [(TRANS + .15, R1 - .1), (share - .35, R2 - .1), (note - .25, END - .1)]
def gaze(t): return max(window(t, a, b, .35) for a, b in UP)
def look(t): return 0

BLINKS = [1.8, 4.6, 9.2, 13.4, 17.9, END + 1.2]
CLAWD_BLINKS = [1.1, 3.4, END + 1.8, END + 3.6]
CLAWD_WAVE = (HOPBACK[1] + .2, HOPBACK[1] + 1.3)
SMILE = (END_T - .3, DUR + 1)

def audio_env():
    raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', AUDIO, '-ac', '1', '-ar', '16000', '-f', 's16le', '-'],
                         capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    hop = 16000 // FPS
    e = np.array([np.sqrt(np.mean(a[i * hop:(i + 1) * hop] ** 2) + 1e-12) if (i + 1) * hop <= len(a) else 0 for i in range(N)])
    ref = np.percentile(e[e > 0.008], 92) if (e > 0.008).any() else 1
    e = np.clip((e - 0.01) / (ref - 0.01), 0, 1) ** .8
    return np.convolve(e, [.2, .6, .2], 'same')
ENV = audio_env()
VOWEL = np.array([math.sin(i * .9) for i in range(N)])

def state(t):
    i = min(N - 1, int(round(t * FPS)))
    blink = max([max(0, 1 - abs(t - b) / .1) for b in BLINKS] + [0])
    return dict(G=gaze(t), M=float(ENV[i]), V=float(VOWEL[i]), blink=blink, smile=window(t, *SMILE, .5))

# ---- captions: chunks of <=3 words, split at punctuation and pauses ----
ACCENT = ['برامج', 'برنامج', 'يركّبها', 'يركبها', 'أيقونته', 'شريط', 'القوائم', 'جملة', 'وحدة', 'الرام', 'التخزين',
          'جاهز', 'الحركة', 'يعرفهاش', 'share', 'install', 'app', 'إشعار', 'اشعار', 'ببلاش', 'المجانية', 'الكومنتات', 'claude', 'كلود']
def is_acc(c): return any(a.lower() == c.lower() or (len(a) > 4 and a.lower() in c.lower()) for a in ACCENT)
def build_captions():
    chunks, cur = [], []
    for k, w in enumerate(RAW):
        cur.append(w)
        nxt = RAW[k + 1] if k + 1 < len(RAW) else None
        punct = lambda x: re.search('[…؟.،:!?]', x['text']) is not None
        tail1 = nxt is not None and punct(nxt) and not punct(w)        # only one word left in the phrase
        brk = punct(w) or nxt is None or (nxt['start'] - w['end'] > .28) or (len(cur) >= 3 and not (tail1 and len(cur) < 4))
        if brk: chunks.append(cur); cur = []
    out = []
    for i, ch in enumerate(chunks):
        a = ch[0]['start']
        nxt = chunks[i + 1][0]['start'] if i + 1 < len(chunks) else None
        b = ch[-1]['end'] + .45
        if nxt is not None: b = min(b, nxt - .13)
        words = [(('Claude' if w['c'] in ('كلود', 'لكلود') else w['c']), w['start'], 1 if is_acc(w['c']) else 0) for w in ch]
        out.append((a, max(b, a + .25), words))
    return out
CAPTIONS = build_captions()
