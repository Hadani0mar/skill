import numpy as np, subprocess, os
SR=48000; import os; D=os.environ.get('SFX', '../../techno-ly/template/assets/audio/sfx/')
def load(p):
    r=subprocess.run(['ffmpeg','-v','error','-i',p,'-f','f32le','-ac','1','-ar',str(SR),'-'],capture_output=True); return np.frombuffer(r.stdout,np.float32).copy()
voice=load('audio/voice.wav'); N=int(37.8*SR); out=np.zeros(N,np.float32); sfx=np.zeros(N,np.float32)
def add(name,t,g=1.0):
    s=load(D+name) if isinstance(name,str) else name; i=int(t*SR); s=s[:N-i]; sfx[i:i+len(s)]+=s*g
rng=np.random.default_rng(3)
def whoosh(d=.4):
    n=int(d*SR); x=rng.standard_normal(n).astype(np.float32); env=np.sin(np.linspace(0,np.pi,n))**2
    # simple moving-average lowpass with sweeping width
    y=np.convolve(x,np.ones(24)/24,'same')-np.convolve(x,np.ones(160)/160,'same'); return (y*env*.9).astype(np.float32)
W=whoosh()
# hook: page ticks + clock chip
for k,t in enumerate(np.arange(.25,4.6,.22)): add('interface/click_00%d.ogg'%(2+k%3),t,.35)
add('interface/bong_001.ogg',1.4,.6)
add(W,4.95,.8); add('impact/impactSoft_heavy_003.ogg',5.15,.9)
add('ui/rollover2.ogg',6.7,.7); add('ui/click2.ogg',9.95,.6); add('ui/click2.ogg',11.75,.6); add('impact/impactSoft_medium_001.ogg',12.9,.9)
for c in [13.95,20.0,27.25,30.75]: add(W,c-.2,.7)
for t in [14.1,14.8,15.5,16.1,16.7,17.6]: add(W,t,.3); add('interface/drop_002.ogg',t+.5,.55)
for t in [14.6,15.3,16.0,16.6,17.2,18.1]: add('ui/switch7.ogg',t,.3)
for t in [2.45,2.85,3.25]: add('interface/drop_003.ogg',t+.3,.5)
add('ui/rollover2.ogg',25.5,.55)
for t in np.arange(18.3,19.1,.07): add('interface/click_003.ogg',t,.3)
for t in [20.0,25.3,27.25,30.75]: add('interface/bong_001.ogg',t+.05,.45)
add('interface/select_008.ogg',20.25,.5); add('ui/rollover1.ogg',21.35,.5)
add('ui/mouseclick1.ogg',23.15,.8); add('impact/impactSoft_medium_004.ogg',23.3,.7)
add('interface/select_008.ogg',25.45,.5); add('ui/rollover1.ogg',26.0,.5)
add('ui/mouseclick1.ogg',28.0,.8); add('impact/impactSoft_medium_002.ogg',28.35,.7); add('ui/click2.ogg',29.0,.5)
add('impact/impactSoft_medium_003.ogg',30.9,.6)
for i in range(4): add('interface/drop_001.ogg',31.4+i*.18,.35)
add('ui/mouseclick1.ogg',32.9,.8); add('impact/impactSoft_medium_000.ogg',33.15,.6); add('interface/switch_002.ogg',34.2,.7)
add(W,35.1,.6); add('impact/impactSoft_heavy_001.ogg',35.6,.8); add('ui/rollover2.ogg',36.3,.6)
v=np.zeros(N,np.float32); v[:len(voice)]=voice[:N]
# duck sfx under voice
env=np.convolve(np.abs(v),np.ones(2400)/2400,'same'); duck=1-0.45*np.clip(env/ (env.max()*.3),0,1)
mix=v+sfx*0.33*duck
mix/=np.abs(mix).max()*1.12
import wave
w=wave.open('out/nb8_raw.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix*32767).astype(np.int16).tobytes()); w.close()
