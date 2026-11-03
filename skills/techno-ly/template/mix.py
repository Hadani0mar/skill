# Voice + React Bits sounds (rendered WAVs) + brag keyboard SFX + optional brag music bed, ducked under the voice.
# Edit EV (time, 'RB:<name>', gain) and TYPE (start, keys, gap) to the video's events. Set MUSIC='' to skip music.
import subprocess, numpy as np, wave, os
SR = 48000; END = 93.0
S = os.environ.get('UISFX', '/tmp/cw/skills/real-sfx/vendor/node_modules/uisfx/sounds/')
RB = os.environ.get('RB_WAV', 'out/rbs/')
R = 8.4
EV = [
  (0.15, 'RB:enter', .4), (3.9, 'RB:swish', .35), (6.95, 'RB:stamp', .5), (8.4, 'RB:sweep', .45),
  *[(x, 'RB:notch', .45) for x in [8.65, 9.3, 10.75, 11.75, 12.4, 13.66]], (14.0, 'RB:tally', .4),
  (14.6, 'RB:swish', .4), (16.57, 'RB:scramble', .4), (18.42, 'RB:reveal', .5), (18.7, 'RB:spark', .45), (20.55, 'RB:check', .45), (22.53, 'RB:check', .45),
  (24.4, 'RB:swish', .4), (24.6, 'RB:enter', .4), (28.25, 'RB:thock', .5), (29.6, 'RB:appear', .4),
  *[(x, 'RB:notch', .4) for x in [32.5, 33.72, 34.84, 36.52]], (40.0, 'RB:counter', .45),
  (42.6, 'RB:whip', .4), (43.6, 'RB:dot', .4), (44.8, 'RB:check', .5), (45.1, 'RB:appear', .35), (47.6, 'RB:glimmer', .35),
  (50.5, 'RB:thock', .45), (53.8, 'RB:thock', .5), (54.5, 'RB:appear', .35), (56.1, 'RB:zap', .35), (57.1, 'RB:ping', .4), (58.96, 'RB:thock', .45), (59.2, 'RB:signal', .35),
  (64.8, 'RB:sweep', .35), (65.6, 'RB:thock', .5), (66.9, 'RB:chime', .45), (67.3, 'RB:thock', .4),
  (72.9, 'RB:notch', .4), (75.0, 'RB:notch', .4), (76.2, 'RB:notch', .4), (77.24, 'RB:check', .4),
  (78.6, 'RB:swish', .4), (78.7, 'RB:reveal', .45), (81.0, 'RB:stamp', .5), (83.4, 'RB:enter', .4), (87.3, 'RB:ping', .5), (87.4, 'RB:appear', .4),
  (90.0, 'RB:spark', .55), (90.05, 'RB:chime', .45), (90.8, 'RB:finale', .4),
]
BRAG = os.environ.get('BRAG', '../brag')
KB = BRAG + '/skills/brag/assets/sfx/keyboard/'
MUSIC = os.environ.get('MUSIC', BRAG + '/skills/brag/assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3')
TYPE = [(25.45, 17, .038), (45.4, 30, .06), (51.6, 26, .077), (86.0, 15, .08)]
def load(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 's16le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).reshape(-1, 2).astype(np.float32) / 32768
N = int(END * SR); fx = np.zeros((N, 2), np.float32); cache = {}
def put(f, t, g):
    if f not in cache: cache[f] = load(RB + f[3:] + '.wav') if f.startswith('RB:') else load(KB + f[3:]) if f.startswith('KB:') else load(S + f + '.mp3')
    a = cache[f] * g; i = int(t * SR); k = min(len(a), N - i)
    if k > 0: fx[i:i + k] += a[:k]
for t, f, g in EV: put(f, t, g)
for t0, n, gap in TYPE:
    for j in range(n): put('KB:keypress-%03d.wav' % (1 + (j * 7) % 32), t0 + j * gap, .35 * (0.85 + 0.3 * ((j * 7) % 5) / 4))
v = load('voice.wav'); vo = np.zeros((N, 2), np.float32); vo[:min(len(v), N)] = v[:N]
vo *= 0.9 / max(np.abs(vo).max(), 1e-6)
fx *= 0.30 / max(np.abs(fx).max(), 1e-6)   # sfx peaks ~10 dB under the voice
M = load(MUSIC)[:N] if MUSIC else np.zeros((1, 2), np.float32)
mu = np.zeros((N, 2), np.float32); mu[:len(M)] = M
env = np.convolve(np.abs(vo[:, 0]), np.ones(4800) / 4800, mode='same'); duck = 1 - 0.55 * np.clip(env / (env.max() * 0.25), 0, 1)
fade = np.clip(np.arange(N) / (1.5 * SR), 0, 1) * np.clip((N - np.arange(N)) / (2.5 * SR), 0, 1)
mu *= (0.16 / max(np.abs(mu).max(), 1e-6)) * (duck * fade)[:, None]
out = vo + fx + mu; out *= min(1, 0.89 / np.abs(out).max())
w = wave.open('out/mix.wav', 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((out * 32767).astype(np.int16).tobytes()); w.close(); print('mix ok peak', round(float(np.abs(out).max()), 3))
