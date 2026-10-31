# React Bits sounds (rendered to WAV) on the beats of «عالم المنتج» — Presto.
import numpy as np, wave
SR=48000; DUR=40.0; N=int(SR*DUR); out=np.zeros((N,2)); cache={}
P,DV,F1,F2,MQ,F3,F4,RG,END=120,190,230,410,590,620,800,980,1010
def load(n):
    if n in cache: return cache[n]
    w=wave.open(f'public/sfx/{n}.wav'); ch=w.getnchannels(); assert w.getframerate()==SR
    a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768; a=a.reshape(-1,ch)
    if ch==1: a=np.repeat(a,2,1)
    cache[n]=a; return a
def put(n,frame,gain=1.0):
    a=load(n)*gain; i=int(frame/30*SR); k=min(len(a),N-i)
    if k>0: out[i:i+k]+=a[:k]
put('breeze',2,0.7); put('swell',4,0.35); put('tink',42,0.7)
for i in range(3): put('tally',76+15*i,0.8); put('tink',76+15*i,0.4)
put('glimmer',P+4,0.5)
put('swoop',DV,0.8); put('reveal',DV+6,0.35)
for s in (F1,F2,F3,F4):
    put('popover',s+4,0.7); put('ping',s+10,0.45)
put('glide',F1+20,0.5); put('counter',F1+70,0.6)
put('sweep',F2,0.6); put('glide',F2+60,0.4)
put('whip',MQ-8,0.8); put('whip',MQ+26,0.6)
put('counter',F3+30,0.6); put('counter',F3+70,0.5); put('glide',F3+90,0.4)
for i in range(4): put('tink',F4+22+7*i,0.6)
for i in range(3): put('counter',F4+60+10*i,0.35)
put('halo',RG-4,0.8); put('swoop',RG+4,0.6)
put('emblem',END+20,0.85); put('chime',END+50,0.5); put('ping',END+80,0.4)
bed=load('pulse'); L=len(bed)
if L < SR*2: bed=load('calm'); L=len(bed)
fade=int(0.6*SR); env=np.ones(L); env[:fade]=np.linspace(0,1,fade); env[-fade:]=np.linspace(1,0,fade)
i=int(DV/30*SR)
while i<int(RG/30*SR):
    k=min(L,N-i); out[i:i+k]+=(bed*env[:,None])[:k]*0.3; i+=L-fade
t=np.arange(N)/SR; out*=np.minimum(1,(DUR-t)/1.3)[:,None]
out=out/np.max(np.abs(out))*0.89
w=wave.open('out/sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close(); print('ok', round(L/SR,2))
