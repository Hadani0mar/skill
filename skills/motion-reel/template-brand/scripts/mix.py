"""The whole soundtrack, placed on the film's own beats (src/film.json), ducked under the voice. No music.

    python3 scripts/mix.py            → public/mix.wav, and sfx/cues.txt (every cue with its loudness)
    PA=light python3 scripts/mix.py   → try another speaker colour (light | medium | strong | none)

film.json → "sfx": [{"file": "sfx/chime.wav", "at": "pill.0-0.6", "lufs": -27, "bus": "fx", "name": "PA chime"}, …]
  at     seconds, or a beat: "zoom.1" (the end of the zoom), "places.2+0.3", "card.0-0.2"
  lufs   the cue's own loudness. Hits and whooshes about −27 to −35, place beds −33 to −37, a hero flyby −28,
         against −21 speech. Measured from the file, so a quiet file and a loud file land at the same level.
  bus    "fx" (ducked 7 dB under the voice) or "bed" (air and rooms, ducked 4 dB)
  align  "start" (default) or "peak": the loudest moment of the file lands on `at` (whooshes: the peak IS the move)
  ss, t  start and length inside the file;  af: an ffmpeg filter (e.g. "highpass=f=80,lowpass=f=5000")
  rate   0.8 = 20 % slower and about 4 semitones lower (a flyby under slow motion);  reverse: true
  fade   [in, out] seconds (default [0.02, 0.08]);  speaker: true puts the cue through the voice's speaker colour
         (the PA chime before the captain speaks)

The voice goes through a cabin-speaker colour (a captain over the PA). Medium won over light and strong: band 280–5000
Hz, a dip at 350, presence at 1.8 and 3.2 kHz, 4:1 compression, a soft clip, a small metallic echo (13/29/47 ms).
The band-limit makes it quieter, so the speech is normalised again after it. Then everything is measured: speech at
film.json mix.lufs (the approved film: −21), effects and beds together about 5 LU under it, ceiling about −1 dBFS.
Real sounds only: no pings, pops, bubbles, coins, risers, and no music or regular beat.
"""
import json
import os
import re
import subprocess

import numpy as np

F = json.load(open('src/film.json'))
SR, DUR = 48000, F['dur']
N = int(DUR * SR)
M = F.get('mix', {})
TARGET, DUCK_FX, DUCK_BED = M.get('lufs', -21), M.get('duckFx', 7), M.get('duckBeds', 4)

PRESETS = {
    'light': 'highpass=f=180,lowpass=f=6500,equalizer=f=320:t=q:w=1:g=-3,equalizer=f=2600:t=q:w=1.2:g=3,acompressor=threshold=-22dB:ratio=3:attack=5:release=120:makeup=2,aecho=0.85:0.55:17|31:0.16|0.09',
    'medium': 'highpass=f=280,lowpass=f=5000,equalizer=f=350:t=q:w=1:g=-4,equalizer=f=1800:t=q:w=1:g=4,equalizer=f=3200:t=q:w=1.2:g=2,acompressor=threshold=-24dB:ratio=4:attack=4:release=100:makeup=3,asoftclip=type=tanh:param=1.6,aecho=0.85:0.6:13|29|47:0.2|0.12|0.06',
    'strong': 'highpass=f=380,lowpass=f=3800,equalizer=f=450:t=q:w=1:g=-3,equalizer=f=1500:t=q:w=0.9:g=6,acompressor=threshold=-26dB:ratio=5:attack=3:release=90:makeup=4,asoftclip=type=tanh:param=2.4,aecho=0.85:0.65:11|23|41:0.24|0.15|0.08',
}


def beat(v):
    """a time: a number, or "name.i+x" from film.json beats"""
    if isinstance(v, (int, float)):
        return float(v)
    m = re.fullmatch(r'\s*(\w+)(?:\.(\d+))?\s*([+-]\s*[\d.]+)?\s*', v)
    if not m:
        raise SystemExit(f'cannot read the time "{v}"')
    b = F['beats'][m.group(1)]
    b = b[int(m.group(2) or 0)] if isinstance(b, list) else b
    return b + float((m.group(3) or '0').replace(' ', ''))


def load(path, ss=0.0, t=None, af=None):
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(ss)] + (['-t', str(t)] if t else []) + ['-i', path] + (['-af', af] if af else []) + ['-ac', '2', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, check=True, capture_output=True).stdout, np.float32).reshape(-1, 2).copy()


def lufs(x):
    """integrated loudness; for clips too short for the gate, the loudest 400 ms window"""
    p = subprocess.run(['ffmpeg', '-nostats', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'ebur128', '-f', 'null', '-'],
                       input=x.astype(np.float32).tobytes(), capture_output=True).stderr.decode().split('Summary')[-1]
    v = float(re.search(r'I:\s+(-?[\d.]+)', p).group(1))
    if v > -69:
        return v
    k = int(0.4 * SR); e = (x ** 2).mean(1)
    w = np.convolve(e, np.ones(k) / k, 'valid') if len(e) > k else [e.mean()]
    return 10 * np.log10(max(np.max(w), 1e-12)) - 0.7


def fade(x, fi, fo):
    n = len(x)
    if fi > 0:
        k = min(n, int(fi * SR)); x[:k] *= (np.sin(np.linspace(0, np.pi / 2, k)) ** 2)[:, None]
    if fo > 0:
        k = min(n, int(fo * SR)); x[n - k:] *= (np.cos(np.linspace(0, np.pi / 2, k)) ** 2)[:, None]
    return x


buses = {'fx': np.zeros((N, 2), np.float32), 'bed': np.zeros((N, 2), np.float32)}
log = []
for c in F.get('sfx', []):
    # rate: resample to 48 kHz FIRST, so a 44.1 kHz file at 0.8 really plays at 0.8
    af = ','.join(a for a in [f'aresample={SR},asetrate={SR}*{c["rate"]},aresample={SR}' if c.get('rate') else '', c.get('af', ''),
                              PRESETS.get(os.environ.get('PA', F.get('voice', {}).get('speaker', 'medium')), '') if c.get('speaker') else ''] if a)
    x = load(c['file'], c.get('ss', 0), c.get('t'), af or None)
    if c.get('reverse'):
        x = x[::-1].copy()
    x = fade(x, *c.get('fade', [0.02, 0.08]))
    x *= 10 ** ((c.get('lufs', -30) - lufs(x)) / 20)
    at = mark = beat(c['at'])
    if c.get('align') == 'peak':
        env = np.convolve(np.abs(x).max(1), np.ones(960) / 960, 'same')
        at -= np.argmax(env) / SR
    i = int(round(at * SR))
    if i < 0:
        x, i = x[-i:], 0
    x = x[:max(0, N - i)]
    buses[c.get('bus', 'fx')][i:i + len(x)] += x
    log.append(f'{mark:6.2f}{" peak" if c.get("align") == "peak" else "     "}  {c.get("bus", "fx"):3s}  {lufs(x):6.1f} LUFS  {c.get("name", c["file"])}')

# the voice, through the speaker
preset = os.environ.get('PA', F.get('voice', {}).get('speaker', 'medium'))
vo = np.zeros((N, 2), np.float32)
if os.path.exists('vo/voice.wav'):
    v = load('vo/voice.wav', 0, None, PRESETS.get(preset))[:N]
    vo[:len(v)] = v
    vo *= 10 ** ((TARGET - lufs(vo)) / 20)
else:
    print('no vo/voice.wav yet (python3 scripts/voice.py place): mixing the sounds alone')

# duck under the voice: quick attack (30 ms), slow release (350 ms), gate at −40 dBFS
env = np.convolve(np.abs(vo).max(1), np.ones(int(0.03 * SR)) / int(0.03 * SR), 'same')
on = (env > 10 ** (-40 / 20)).astype(np.float32)
a, r = 1 - np.exp(-1 / (0.03 * SR)), 1 - np.exp(-1 / (0.35 * SR))
g = np.zeros(N, np.float32); s = 0.0
for i in range(0, N, 48):
    tgt = on[i]; s += (a if tgt > s else r) * 48 * (tgt - s); g[i:i + 48] = s
mix = vo + buses['fx'] * (10 ** (-DUCK_FX * g / 20))[:, None] + buses['bed'] * (10 ** (-DUCK_BED * g / 20))[:, None]
pk = np.abs(mix).max()
if pk > 0.89:
    mix = np.tanh(mix / 0.89) * 0.89
os.makedirs('public', exist_ok=True)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s24le', 'public/mix.wav'], input=mix.astype(np.float32).tobytes(), check=True)
open('sfx/cues.txt', 'w').write('\n'.join(sorted(log)) + '\n')
print('\n'.join(sorted(log)))
sp, fx = (lufs(vo) if vo.any() else None), (lufs(buses['fx'] + buses['bed']) if log else None)
print(f'speaker {preset} | speech {sp if sp is None else round(sp, 1)} LUFS | effects+beds alone {fx if fx is None else round(fx, 1)} LUFS'
      + (f' ({sp - fx:.1f} LU under the voice: aim for about 5)' if sp and fx else '')
      + f' | full mix {lufs(mix):.1f} LUFS | peak {20 * np.log10(np.abs(mix).max() + 1e-9):.1f} dBFS → public/mix.wav')
