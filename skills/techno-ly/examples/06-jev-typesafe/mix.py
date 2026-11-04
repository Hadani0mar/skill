# Silent-voice mix: brag music bed + real UI foley (no ding / chime / riser). Output out/mix.wav at about -14 LUFS.
import subprocess, numpy as np, wave, os, re
SR = 48000; END = 118.5
A = 'assets/audio/'; S = A + 'sfx/'
MUSIC = A + 'music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3'
def load(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).reshape(-1, 2).astype(np.float32) / 32768
N = int(END * SR); fx = np.zeros((N, 2), np.float32); cache = {}
def put(f, t, g):
    if f not in cache: cache[f] = load(f)
    a = cache[f] * g; i = int(t * SR); k = min(len(a), N - i)
    if k > 0: fx[i:i + k] += a[:k]
cuts = [7.5, 14.5, 25.5, 40.5, 50.5, 58.5, 68.5, 82.5, 110.5]
for j, t in enumerate(cuts): put(S + 'interface/switch_00%d.ogg' % (1 + j % 7 if (1 + j % 7) != 3 else 4), t, .55)
for t in [3.5, 4.5]: put(S + 'interface/click_002.ogg', t, .45)     # counter hits 1000, stopwatch
for t in [31.0, 34.2, 34.7]: put(S + 'interface/drop_001.ogg', t, .5)  # trio
for t in [41.0, 44.0, 47.4]: put(S + 'interface/drop_002.ogg', t, .5)   # funding cards
for t in [51.7, 52.7, 53.7]: put(S + 'interface/click_003.ogg', t, .45)  # 1.14 rows
for t in [59.9, 63.4]: put(S + 'interface/click_001.ogg', t, .4)
for t in [74.3, 74.9, 75.3, 75.7, 77.1]: put(S + 'interface/click_004.ogg', t, .38)  # Jev panel
for t in [89.2, 97.2, 98.3, 98.6, 102.3]: put(S + 'interface/switch_005.ogg', t, .45)   # app views
for t in [98.8, 100.9]: put(S + 'interface/select_008.ogg', t, .4)
def typing(t0, text_len, dur, g=.5):
    gap = dur / text_len
    for j in range(text_len): put(A + 'sfx/keyboard/keypress-%03d.wav' % (1 + (j * 7) % 32), t0 + j * gap, g * (0.85 + 0.3 * ((j * 7) % 5) / 4))
typing(86.5, 59, 2.0); typing(103.3, 86, 4.0)
fx *= 0.55 / max(np.abs(fx).max(), 1e-6)
M = load(MUSIC)[:N]; mu = np.zeros((N, 2), np.float32); mu[:len(M)] = M
fade = np.clip(np.arange(N) / (1.2 * SR), 0, 1) * np.clip((N - np.arange(N)) / (3.0 * SR), 0, 1)
mu *= (0.0 / max(np.abs(mu).max(), 1e-6)) * fade[:, None]
out = mu + fx; out *= min(1, 0.89 / np.abs(out).max())
os.makedirs('out', exist_ok=True)
w = wave.open('out/mix_raw.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close()
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'out/mix_raw.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=9', '-ar', str(SR), 'out/mix.wav'], check=True)
print('mix ok')
