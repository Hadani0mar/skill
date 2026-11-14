from pathlib import Path
import json, math, subprocess, wave, struct, tempfile

ROOT=Path(__file__).resolve().parents[1]
TMP=tempfile.TemporaryDirectory(prefix='motion-toolkit-smoke-')
OUT=Path(TMP.name)
def run(args,expected=0):
 p=subprocess.run(args,text=True,capture_output=True)
 if p.returncode!=expected: raise RuntimeError(f'{args}: {p.returncode}\n{p.stdout}\n{p.stderr}')
 return p.stdout

js=list((ROOT/'skills/motion-doctrine/scripts').glob('*.mjs'))+[ROOT/'skills/tuhfa/scripts/sync-check.mjs',ROOT/'skills/html-explainer-video/scripts/render.mjs',ROOT/'skills/html-explainer-video/scripts/check-film.mjs']
for p in js:run(['node','--check',str(p)])
print('JS syntax checked:',len(js))
fixture={'fps':60,'seams':[{'id':'phone-to-result','cut':1.5,'technique':'cut-the-curve LEFT',
 'exit':{'selector':'#phone','axis':'x','dir':-1},'entry':{'selector':'#result','axis':'x','dir':-1}}]}
(OUT/'ledger.json').write_text(json.dumps(fixture))
(OUT/'index.html').write_text('<script>const tl=gsap.timeline({paused:true}); window.__timelines["main"] = tl;\n</script>')
report=run(['node',str(ROOT/'skills/motion-doctrine/scripts/seam-stamp.mjs'),'--ledger',str(OUT/'ledger.json'),'--write',str(OUT/'index.html')])
html=(OUT/'index.html').read_text()
assert '#phone' in html and '#result' in html and 'seams:auto' in html
second=run(['node',str(ROOT/'skills/motion-doctrine/scripts/seam-stamp.mjs'),'--ledger',str(OUT/'ledger.json'),'--write',str(OUT/'index.html')])
assert html==(OUT/'index.html').read_text(), 'seam stamping is not idempotent'
print('Seam stamp fixture: selectors written; second stamp idempotent')

sr=48000
with wave.open(str(OUT/'fixture.wav'),'wb') as f:
 f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr)
 samples=[]
 for i in range(sr*3):
  t=i/sr
  signal=.06*math.sin(2*math.pi*440*t)
  if 1.5<=t<1.58:signal+=.07*math.sin(2*math.pi*1800*t)
  samples.append(struct.pack('<h',int(signal*32767)))
 f.writeframes(b''.join(samples))
run(['ffmpeg','-v','error','-y','-f','lavfi','-i','color=c=white:s=320x180:r=60:d=3','-i',str(OUT/'fixture.wav'),'-c:v','libx264','-preset','ultrafast','-c:a','aac','-shortest',str(OUT/'fixture.mp4')])
checker=ROOT/'skills/tuhfa/scripts/sync-check.mjs'
(OUT/'good-cues.json').write_text('[1.5]')
(OUT/'bad-cues.json').write_text('[1.9]')
good=run(['node',str(checker),str(OUT/'fixture.mp4'),'--cues-file',str(OUT/'good-cues.json')])
bad=run(['node',str(checker),str(OUT/'fixture.mp4'),'--cues-file',str(OUT/'bad-cues.json')],expected=1)
assert '1/1 visual events' in good
assert 'OFF-BEAT' in bad
print('Audio checker: aligned cue passes; shifted cue fails')

(OUT/'arabic.json').write_text(json.dumps([['جرّب',.1,.4],['الآن',.5,.8],['جرّب',.9,1.2]],ensure_ascii=False))
run(['python3',str(ROOT/'skills/tuhfa/scripts/word_clock.py'),str(OUT/'arabic.json'),'--duration','1.5','--out',str(OUT/'clock.json')])
run(['python3',str(ROOT/'skills/tuhfa/scripts/word_clock.py'),str(OUT/'arabic.json'),'--duration','1.5','--format','triples','--out',str(OUT/'triples.json')])
assert json.loads((OUT/'clock.json').read_text())['occurrences']['جرّب']==['w0001','w0003']
assert json.loads((OUT/'triples.json').read_text())==json.loads((OUT/'arabic.json').read_text())
print('Word-clock CLI: Arabic repeats + unchanged timing + upstream-compatible triples')
