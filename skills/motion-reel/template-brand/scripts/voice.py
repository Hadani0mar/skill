"""The voice: cut a generated take at its natural pauses, check every cut, place each sentence on its beat.

    python3 scripts/voice.py islands vo/take.mp3     # where the speech is (−45 dBFS, pauses ≥ 0.3 s) + the words
    python3 scripts/voice.py check                   # the sentences in film.json, joined with gaps, transcribed
    python3 scripts/voice.py place                   # → vo/voice.wav (clean, at the film's level) + src/voice_env.json

film.json → "voice": {"take": "vo/take.mp3", "speaker": "medium",
                      "phrases": [{"text": "ضيوفنا الكرام", "src": [0.00, 2.26], "at": 0.75}, …]}
  src  where the sentence is in the take (from `islands`; one sentence may join several islands: never cut inside a
       sentence, even at a 0.4 s pause)
  at   when it starts in the film. Put each sentence on its picture: a place's name while the place is on screen and
       still, not as it leaves. Move a sentence only to land a claim on its picture.
  take (optional) a different file for this sentence, when another take said it better.

Transcription needs mlx-whisper (Apple Silicon: pip install mlx-whisper) or openai-whisper. The model (whisper
large-v3, about 3 GB, from huggingface.co) downloads only when you add --download: ask the user first. Read the
words: a dropped letter («القاهرة» heard as «الآهرة») or an extra word means another take for that sentence.
"""
import json
import re
import subprocess
import sys

import numpy as np

F = json.load(open('src/film.json'))
V = F.get('voice', {})
SR = 48000
PRE, POST = 0.04, 0.08            # keep soft onsets (ب، ل) and tails
FADE_IN, FADE_OUT = 0.012, 0.04


def pcm(path, sr=16000):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)


def islands(path, db=-45.0, gap=0.3, min_len=0.08):
    y, hop = pcm(path), 160                       # 10 ms
    n = len(y) // hop
    rms = np.sqrt((y[:n * hop].reshape(n, hop) ** 2).mean(1) + 1e-12)
    on = 20 * np.log10(rms) > db
    segs, i = [], 0
    while i < n:
        if on[i]:
            j = i
            while j < n and on[j]:
                j += 1
            segs.append([i * 0.01, j * 0.01]); i = j
        else:
            i += 1
    merged = []
    for s in segs:
        if merged and s[0] - merged[-1][1] < gap:
            merged[-1][1] = s[1]
        else:
            merged.append(s)
    return [s for s in merged if s[1] - s[0] >= min_len]


MODEL = 'mlx-community/whisper-large-v3-mlx'


def model_ready():
    import os
    hub = os.path.expanduser('~/.cache/huggingface/hub/models--' + MODEL.replace('/', '--'))
    return os.path.isdir(hub) or '--download' in sys.argv


def transcribe(path):
    """words with times, or None when no whisper is installed"""
    try:
        import mlx_whisper
        if not model_ready():
            raise SystemExit(f'the transcription model ({MODEL}, about 3 GB) is not on this Mac yet. Ask the user, then run again with --download.')
        r = mlx_whisper.transcribe(path, path_or_hf_repo='mlx-community/whisper-large-v3-mlx', word_timestamps=True, language='ar')
    except ImportError:
        try:
            import os
            import whisper
            if not (os.path.exists(os.path.expanduser('~/.cache/whisper/large-v3.pt')) or '--download' in sys.argv):
                raise SystemExit('the transcription model (whisper large-v3, about 3 GB) is not on this computer yet. Ask the user, then run again with --download.')
            r = whisper.load_model('large-v3').transcribe(path, word_timestamps=True, language='ar')
        except ImportError:
            return None
    return [(w['start'], w['end'], w['word'].strip()) for s in r['segments'] for w in s.get('words', [])]


def lufs(path):
    out = subprocess.run(['ffmpeg', '-nostats', '-i', path, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.search(r'I:\s+(-?[\d.]+) LUFS', out.split('Summary')[-1]).group(1))


def cmd_islands(path):
    isl = islands(path)
    words = transcribe(path)
    # each word goes to the island it overlaps most (whisper often starts a word inside the pause before it)
    owner = lambda s, e: max(range(len(isl)), key=lambda k: min(e, isl[k][1]) - max(s, isl[k][0]))
    texts = [[] for _ in isl]
    for s, e, w in words or []:
        texts[owner(s, e)].append(w)
    rows = []
    for (a, b), ws in zip(isl, texts):
        txt = ' '.join(ws)
        rows.append({'text': txt, 'src': [round(a, 2), round(b, 2)]})
        print(f'{a:6.2f} – {b:6.2f}  ({b - a:4.2f} s)  {txt}')
    json.dump(rows, open('vo/islands.json', 'w'), ensure_ascii=False, indent=1)
    print(f'\n{len(isl)} islands → vo/islands.json. Join islands into the script\'s sentences, add "at" to each, and put them in film.json → voice.phrases.')
    if words is None:
        print('(no words: install mlx-whisper to see what each island says)')


def phrase_audio(p):
    a, b = p['src']
    a, b = max(0.0, a - PRE), b + POST
    take = p.get('take', V['take'])
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(a), '-t', str(b - a), '-i', take, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32).copy()
    k1, k2 = int(FADE_IN * SR), int(FADE_OUT * SR)
    x[:k1] *= np.linspace(0, 1, k1); x[-k2:] *= np.linspace(1, 0, k2)
    return x


def write(path, x, ch=1):
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-ac', str(ch), '-c:a', 'pcm_s24le', path], input=x.astype(np.float32).tobytes(), check=True)


def cmd_check():
    gap = np.zeros(int(0.6 * SR), np.float32)
    parts, spans, t = [], [], 0.0
    for p in V['phrases']:
        x = phrase_audio(p)
        parts += [x, gap]; spans.append((t, t + len(x) / SR, p['text'])); t += (len(x) + len(gap)) / SR
    write('vo/_check.wav', np.concatenate(parts))
    words = transcribe('vo/_check.wav')
    if words is None:
        raise SystemExit('install mlx-whisper (or openai-whisper) to check the cuts by ear-free transcription; vo/_check.wav is ready to listen to')
    heard_in = [[] for _ in spans]
    for s, e, w in words:
        heard_in[max(range(len(spans)), key=lambda k: min(e, spans[k][1]) - max(s, spans[k][0]))].append(w)
    bad = 0
    for (a, b, want), ws in zip(spans, heard_in):
        heard = ' '.join(ws)
        same = re.sub(r'[^\u0621-\u064A ]', '', heard).split() == re.sub(r'[^\u0621-\u064A ]', '', want).split()
        bad += not same
        print(f'{"  " if same else "≠ "}{want}\n    heard: {heard}')
    print(f'\n{len(spans) - bad}/{len(spans)} sentences heard exactly. A «≠» is a clipped word, a dropped letter, or whisper\'s spelling: listen to vo/_check.wav.')


def cmd_place():
    dur, fps = F['dur'], F['fps']
    out = np.zeros(int(dur * SR) + SR, np.float32)
    end_prev = -1.0
    for p in sorted(V['phrases'], key=lambda p: p['at']):
        x = phrase_audio(p)
        i = int(round((p['at'] - PRE) * SR))
        if i < 0:
            x, i = x[-i:], 0
        if p['at'] - PRE < end_prev:
            print(f'  ! «{p["text"]}» starts before the last sentence ends ({end_prev:.2f} s)')
        out[i:i + len(x)] += x[:max(0, len(out) - i)]
        end_prev = p['at'] - PRE + len(x) / SR
        print(f'{p["at"]:6.2f} – {end_prev:6.2f}  {p["text"]}')
        if end_prev > dur:
            print(f'  ! ends after the film ({dur} s)')
        # a place's name is said while the place is on screen and still: after its move, before its number lands
        for k, pl in enumerate(F.get('places', [])):
            if pl['name'] and pl['name'] in p['text']:
                still, lands = F['beats']['places'][k] + 0.9, F['beats']['counts'][k]
                if p['at'] < still - 0.05 or end_prev > lands + 0.1:
                    print(f'  ! «{pl["name"]}» should be said between {still:.2f} and {lands:.2f} s (the place is still; then its number lands)')
    out = out[:int(dur * SR)]
    write('vo/_raw.wav', out)
    g = F['mix']['lufs'] - lufs('vo/_raw.wav')        # ebur128 gating leaves the pauses out
    out *= 10 ** (g / 20)
    pk = np.abs(out).max()
    if pk > 0.89:
        out = np.tanh(out / 0.89) * 0.89
    write('vo/voice.wav', out, ch=2)
    # one level per frame, for the ribbon (RMS / its 95th percentile while speaking)
    hop = SR // fps
    n = len(out) // hop
    rms = np.sqrt((out[:n * hop].reshape(n, hop) ** 2).mean(1))
    ref = np.percentile(rms[rms > 1e-4], 95) if (rms > 1e-4).any() else 1
    json.dump([round(float(v), 3) for v in np.clip(rms / ref, 0, 1)], open('src/voice_env.json', 'w'))
    print(f'✓ vo/voice.wav at {lufs("vo/voice.wav"):.1f} LUFS (gain {g:+.1f} dB) and src/voice_env.json ({n} frames)')


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args or args[0] not in ('islands', 'check', 'place'):
        print(__doc__); sys.exit(1)
    if args[0] == 'islands':
        cmd_islands(args[1] if len(args) > 1 else V['take'])
    elif args[0] == 'check':
        cmd_check()
    else:
        cmd_place()
