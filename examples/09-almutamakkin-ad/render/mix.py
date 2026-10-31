# React Bits sounds (rendered to WAV) on the cuts and impacts.
import numpy as np, wave
SR=48000; DUR=39.0; N=int(SR*DUR); out=np.zeros((N,2)); cache={}
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
[put('keycap',6+2.4*k,0.5) for k in range(0,12,1)]; [put('keycap',42+2.4*k,0.5) for k in range(0,13)]
put('braam',90,0.9); put('slam',94,0.9); put('glimmer',130,0.5)
[put('stamp',184+14*i,0.8) for i in range(3)]; [put('zap',230+4*i,0.4) for i in range(3)]
put('thunder',250,0.7); put('slam',250,1.0)
for i in range(8):
    s=330+45*i; put('whip',s-3,0.55); put('stamp' if i%2 else 'slam',s,0.8); put('tally',s+12,0.35)
[put('keycap',692+3*k,0.6) for k in range(7)]
for t in (726,756,786): put('punchline',t,0.6); put('tally',t+6,0.5)
put('swell',872,0.4); put('slam',910,1.0); put('zap',910,0.8); put('spark',911,0.7)
for k in range(1,4): put('zap',910+24*k,0.25)
put('reveal',990,0.6); put('slam',1030,1.0); put('thunder',1030,0.6); put('finale',1074,0.85); put('glimmer',1094,0.5); put('punchline',1114,0.6)
t=np.arange(N)/SR; out*=np.minimum(1,(DUR-t)/1.2)[:,None]
out=out/np.max(np.abs(out))*0.89
w=wave.open('out/sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close(); print('ok')
