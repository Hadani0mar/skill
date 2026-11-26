"""Gemini 3.8 TTS via the documented `interactions` endpoint.
usage: GEMINI_API_KEY=... python3 gemini_tts2.py out.wav <voice> "<style or ''>" "<verbatim text>" """
import base64, json, os, sys, urllib.request, wave, io

out, voice, style, text = sys.argv[1:5]
model = os.environ.get('TTS_MODEL', 'gemini-3.8-flash-tts')
item = {'type': 'text', 'text': text}
if style: item['annotations'] = [{'type': 'speech_metadata', 'style': style}]
body = {'model': model, 'input': [{'type': 'user_input', 'content': [item]}],
        'response_format': {'type': 'audio'}, 'generation_config': {'speech_config': [{'voice': voice}]}}
req = urllib.request.Request('https://generativelanguage.googleapis.com/v1beta/interactions',
                             data=json.dumps(body).encode(),
                             headers={'Content-Type': 'application/json', 'x-goog-api-key': os.environ['GEMINI_API_KEY']})
try:
    with urllib.request.urlopen(req, timeout=300) as r:
        raw = r.read()
except urllib.error.HTTPError as e:
    print('ERR', e.code, e.read().decode()[:500]); sys.exit(1)

def find_audio(o):
    if isinstance(o, dict):
        for k in ('data', 'audio', 'inline_data', 'inlineData'):
            v = o.get(k)
            if isinstance(v, str) and len(v) > 1000: return v, o.get('mime_type') or o.get('mimeType', '')
        for v in o.values():
            r = find_audio(v)
            if r: return r
    if isinstance(o, list):
        for v in o:
            r = find_audio(v)
            if r: return r
try:
    d = json.loads(raw)
    b64, mime = find_audio(d)
    data = base64.b64decode(b64)
except Exception:
    data, mime = raw, 'audio/wav'
if data[:4] == b'RIFF':
    open(out, 'wb').write(data)
else:
    rate = int(mime.split('rate=')[1].split(';')[0]) if 'rate=' in mime else 24000
    with wave.open(out, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(data)
print('ok', model, mime or 'wav')
