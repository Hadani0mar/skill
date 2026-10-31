# React Bits sounds (rendered to WAV) on the taps and screen moves.
import numpy as np, wave
SR=48000; DUR=28.0; N=int(SR*DUR); out=np.zeros((N,2)); cache={}
K=dict(TAP1=128,PUSH1=140,MENU=228,SHEET1=236,OPT=290,PUSH2=302,COUNT=342,SIZE=452,PRINT=532,SHEET2=540,SEND=566,DONE=642,OUTRO=700)
HEADS=[0,80,205,335,525]
def load(n):
    if n in cache: return cache[n]
    w=wave.open(f'public/sfx/{n}.wav'); ch=w.getnchannels(); assert w.getframerate()==SR
    a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768; a=a.reshape(-1,ch)
    if ch==1: a=np.repeat(a,2,1)
    cache[n]=a; return a
def put(n,frame,gain=1.0):
    a=load(n)*gain; i=int(frame/30*SR); k=min(len(a),N-i)
    if k>0: out[i:i+k]+=a[:k]
put('swoop',4,0.5)
for h in HEADS: put('glimmer',h+22,0.35)
for k in ('TAP1','MENU','OPT','SIZE','PRINT'): put('tink',K[k],0.8)
put('swish',K['PUSH1'],0.6); put('swish',K['PUSH2'],0.6)
put('popover',K['SHEET1'],0.7); put('popover',K['SHEET2'],0.7)
for i in range(4): put('notch',K['COUNT']+i*10,0.6); put('counter',K['COUNT']+i*10,0.25)
put('check',K['COUNT']+62,0.6)
for i in range(8): put('dot',K['SEND']+i*9,0.35)
put('ding',K['DONE'],0.6); put('check',K['DONE'],0.5)
put('emblem',K['OUTRO']+4,0.8)
bed=load('calm'); L=len(bed); fade=int(0.8*SR); env=np.ones(L); env[:fade]=np.linspace(0,1,fade); env[-fade:]=np.linspace(1,0,fade)
i=0
while i<N:
    k=min(L,N-i); out[i:i+k]+=(bed*env[:,None])[:k]*0.28; i+=L-fade
t=np.arange(N)/SR; out*=np.minimum(1,(DUR-t)/1.2)[:,None]
out=out/np.max(np.abs(out))*0.89
w=wave.open('out/sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close(); print('ok')
