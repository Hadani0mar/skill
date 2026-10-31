# React Bits sounds (rendered to WAV) on the cuts and impacts.
import numpy as np, wave
SR=48000; DUR=33.0; N=int(SR*DUR); out=np.zeros((N,2)); cache={}
def load(n):
    if n in cache: return cache[n]
    w=wave.open(f'public/sfx/{n}.wav'); ch=w.getnchannels(); assert w.getframerate()==SR
    a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768; a=a.reshape(-1,ch)
    if ch==1: a=np.repeat(a,2,1)
    cache[n]=a; return a
def put(n,frame,gain=1.0):
    a=load(n)*gain; i=int(frame/30*SR); k=min(len(a),N-i)
    if k>0: out[i:i+k]+=a[:k]
for t in (0,88,176): put('heartbeat',t,0.55)
[put('keycap',10+3*k,0.6) for k in range(9)]
put('braam',75,0.9); put('slam',75,0.9); put('glimmer',115,0.5)
[put('stamp',169+12*i,0.8) for i in range(3)]; put('zap',211,0.6)
put('thunder',225,0.7); put('slam',225,1.0)
for i in range(8):
    put('whip',300+30*i-3,0.55); put('stamp' if i%2 else 'slam',300+30*i,0.8)
[put('keycap',542+3*k,0.6) for k in range(7)]
for t in (570,590,610): put('counter',t,0.55); put('tally',t,0.6)
put('punchline',644,0.8)
put('swell',722,0.4); put('slam',760,1.0); put('zap',760,0.8); put('spark',761,0.7)
for k in range(1,5): put('zap',760+24*k,0.25)
put('reveal',840,0.6); put('slam',886,1.0); put('thunder',886,0.6); put('finale',918,0.85); put('glimmer',938,0.5)
t=np.arange(N)/SR; out*=np.minimum(1,(DUR-t)/1.2)[:,None]
out=out/np.max(np.abs(out))*0.89
w=wave.open('out/sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close(); print('ok')
