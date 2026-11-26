import numpy as np, subprocess, sys, wave, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import SFX, WORK
import importlib; T = importlib.import_module(os.environ.get('TIMELINE', 'timeline_install_as_app'))
SR = 48000
def load(p, gain_db=0):
    raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64) * 10 ** (gain_db / 20)
n = int((T.DUR + .5) * SR); voice = np.zeros(n); fx = np.zeros(n)
v = load(T.AUDIO); v = v / np.abs(v).max() * .89; voice[:len(v)] += v
S = str(SFX) + '/'
def put(name, t, g, dur=None, fade=.05):
    x = load(S + name + '.mp3', g)
    if dur: x = x[:int(dur * SR)]
    f = int(fade * SR)
    if len(x) > 2 * f: x[-f:] *= np.linspace(1, 0, f)
    i = int(max(0, t) * SR); fx[i:i + len(x)] += x[:max(0, n - i)]
E = T.EV
put('impact', 0.0, -4)                       # hook hit on frame 0
put('impact', T.R1 - .05, -9)                # re-hook 1  «توا…»
put('impact', T.R2 - .05, -9)                # re-hook 2  «والأحلى؟»
put('whoosh', T.HOP[0] - .05, -6)            # Clawd hops up
put('pop', T.OPEN[0], -5)                    # bar opens into the screen
put('typing', E['typeA'], -12, dur=E['typeB'] - E['typeA'], fade=.2)
for t in (E['typeB'], E['share'], E['dlg'] - .12, E['install'], E['pop'] - .1):
    put('click', t - .02, -6)
put('pop', E['mbitem'], -7)                  # menu-bar icon appears
put('counter', E['ram'], -10)                # RAM climbing
put('pop', E['note'], -5)                    # notification
put('whoosh', T.CLOSE[0], -9)                # screen folds back
put('whoosh', T.HOPBACK[0], -8)              # Clawd hops home
# duck effects under the voice a little
env = np.convolve(np.abs(voice), np.ones(2400) / 2400, 'same')
duck = 1 - .45 * np.clip(env / .05, 0, 1)
mix = voice + fx * duck
mix = mix / max(1, np.abs(mix).max() / .95)
WORK.mkdir(parents=True, exist_ok=True)
w = wave.open(str(WORK / 'mix_raw.wav'), 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()); w.close(); print('ok', len(mix) / SR)
