# SFX-only mix, derived from the recorded state signature (out/sig.json, one entry per frame): no music, no voice.
import subprocess, numpy as np, wave, json, os
SR = 48000; FPS = 30
sig = [s.split('|') if s else None for s in json.load(open('out/sig.json'))]
END = (len(sig) + 15) / FPS
A = 'assets/audio/sfx/'
def load(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).reshape(-1, 2).astype(np.float32) / 32768
N = int(END * SR); fx = np.zeros((N, 2), np.float32); cache = {}
def put(f, t, g):
    if f not in cache: cache[f] = load(f)
    a = cache[f] * g; i = int(t * SR); k = min(len(a), N - i)
    if k > 0: fx[i:i + k] += a[:k]
names = ['sc', 'rows', 'depts', 'ticket', 'reply', 'gate', 'intro', 'people', 'money', 'nw', 'price', 'diff', 'end', 'pick', 'jev']
prev = None; keys = 0
for f, cur in enumerate(sig):
    if cur is None: continue
    cur = dict(zip(names, map(int, cur))); t = f / FPS
    if prev:
        if cur['sc'] != prev['sc']: put(A + 'interface/switch_00%d.ogg' % [1, 2, 4, 5, 6, 7][cur['sc'] % 6], t, .55)
        if cur['ticket'] > prev['ticket']:
            keys += 1; put('assets/audio/sfx/keyboard/keypress-%03d.wav' % (1 + (keys * 7) % 32), t, .45)
        for k, snd, g in [('rows', 'click_001', .38), ('depts', 'click_004', .34), ('people', 'drop_001', .5), ('money', 'drop_002', .5), ('nw', 'click_003', .42), ('diff', 'click_002', .42), ('end', 'click_001', .4), ('price', 'click_004', .4), ('intro', 'drop_001', .4), ('gate', 'select_008', .42)]:
            if cur[k] != prev[k] and cur[k] > 0: put(A + f'interface/{snd}.ogg', t, g)
        if cur['pick'] > prev['pick'] or cur['jev'] > prev['jev']: put(A + 'interface/click_003.ogg', t, .4)
        if prev['reply'] == 0 and cur['reply'] > 0: put(A + 'interface/switch_005.ogg', t, .5)
    prev = cur
fx *= 0.55 / max(np.abs(fx).max(), 1e-6)
fx *= np.clip((N - np.arange(N)) / (0.6 * SR), 0, 1)[:, None]
fx *= min(1, 0.89 / np.abs(fx).max())
w = wave.open('out/mix_raw.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((fx * 32767).astype(np.int16).tobytes()); w.close()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'out/mix_raw.wav', '-af', 'loudnorm=I=-18:TP=-1.5:LRA=9', '-ar', str(SR), 'out/mix.wav'], check=True)
print('mix ok', round(END, 1), 's')
