import numpy as np,subprocess,json,pathlib
from scipy.io import wavfile
from scipy.signal import resample_poly
P=pathlib.Path(__file__).parent
sr=48000
out=np.zeros((int(53.5*sr),2),np.float64)
def load(path):
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ar',str(sr),'-ac','2','-'])
 return np.frombuffer(raw,dtype=np.float32).reshape(-1,2).copy()
voice=load(P/'public/voice.flac')
voice=voice*.90
out[:len(voice)]+=voice
events=[]
def add(name,t,g=.2):
 x=load(P/'public/sfx'/name)
 peak=np.abs(x).max()
 if peak: x=x/peak*g
 n=int(t*sr); end=min(len(out),n+len(x));out[n:end]+=x[:end-n]
 events.append({'time':t,'asset':name,'gain':g})
for t in [0.08,6.75,14.2,26.94,44.7,50.1]:add('slide.ogg',t,.07)
for t in [1.05,25.75,38.83,42.45]:add('impact.ogg',t,.09)
for t in [14.95,16.62,18.13,25.65,31.24,41.43]:add('click.ogg',t,.16)
for i in range(12):add('key1.wav' if i%2==0 else 'key2.wav',19.42+i*.124,.065)
for i in range(7):add('key1.wav' if i%2==0 else 'key2.wav',29.42+i*.165,.078)
for i in range(4):add('key1.wav' if i%2==0 else 'key2.wav',40.5+i*.17,.075)
for t in [17.03,32.9,34.91,37.65,38.61,42.3]:add('switch.ogg',t,.055)
add('click.ogg',51.95,.13)
add('switch.ogg',52.12,.045)
peak=np.abs(out).max()
if peak>.96:out*=.96/peak
wavfile.write(P/'public/mix_raw.wav',sr,(out*32767).astype(np.int16))
(P/'sound-events.json').write_text(json.dumps(events,indent=2))
subprocess.run(['ffmpeg','-y','-v','error','-i',str(P/'public/mix_raw.wav'),'-af','loudnorm=I=-14:TP=-1.5:LRA=9','-ar','48000',str(P/'public/mix.wav')],check=True)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(P/'public/mix.wav'),'-c:a','flac',str(P/'public/mix.flac')],check=True)
print('mixed',len(events),'visible-action effects; duration 53.5 sec')
