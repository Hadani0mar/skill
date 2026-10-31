# React Bits sounds (rendered to WAV) on the beats of «واجهة حية».
import numpy as np, wave
SR=48000; DUR=35.0; N=int(SR*DUR); out=np.zeros((N,2)); cache={}
PHONE_IN, BENTO, FOCUS0, SLOT, PULL, END = 70, 250, 320, 58, 730, 880
def load(n):
    if n in cache: return cache[n]
    w=wave.open(f'public/sfx/{n}.wav'); ch=w.getnchannels(); assert w.getframerate()==SR
    a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768; a=a.reshape(-1,ch)
    if ch==1: a=np.repeat(a,2,1)
    cache[n]=a; return a
def put(n,frame,gain=1.0):
    a=load(n)*gain; i=int(frame/30*SR); k=min(len(a),N-i)
    if k>0: out[i:i+k]+=a[:k]
put('velvet',0,0.5); put('glint',8,0.5); put('shimmer',20,0.35)
put('swoop',PHONE_IN,0.6); put('silk',PHONE_IN+20,0.4); [put('notch',PHONE_IN+24+5*i,0.5) for i in range(4)]; [put('dot',PHONE_IN+50+5*i,0.4) for i in range(3)]
put('sweep',BENTO,0.6); put('swoop',BENTO+2,0.5); [put('dot',BENTO+4*i,0.3) for i in range(8)]
for i in range(7):
    s=FOCUS0+SLOT*i; put('focus',s,0.6); put('glide',s+2,0.35)
s=FOCUS0; [put('tink',s+14+6*k,0.55) for k in range(3)]
s=FOCUS0+SLOT; put('counter',s+6,0.45); put('data',s+10,0.35)
s=FOCUS0+2*SLOT; put('counter',s+6,0.5)
s=FOCUS0+3*SLOT; put('data',s+4,0.5); put('snap',s+30,0.7); put('check',s+44,0.6)
s=FOCUS0+4*SLOT; put('counter',s+6,0.5)
s=FOCUS0+5*SLOT; put('snap',s+26,0.8)
s=FOCUS0+6*SLOT; [put('keycap',s+2+2*k,0.35) for k in range(9)]; put('popover',s+24,0.6); [put('tab',s+32+3*k,0.3) for k in range(9)]; put('tink',s+60,0.5)
put('swoop',PULL,0.6); put('silk',PULL+24,0.45); put('shimmer',PULL+30,0.45)
put('halo',END,0.6); put('emblem',END+24,0.8); put('glint',END+66,0.5); put('check',END+98,0.6)
bed=load('calm'); L=len(bed); fade=int(0.8*SR); env=np.ones(L); env[:fade]=np.linspace(0,1,fade); env[-fade:]=np.linspace(1,0,fade)
i=0
while i<N:
    k=min(L,N-i); out[i:i+k]+=(bed*env[:,None])[:k]*0.3; i+=L-fade
t=np.arange(N)/SR; out*=np.minimum(1,(DUR-t)/1.4)[:,None]
out=out/np.max(np.abs(out))*0.89
w=wave.open('out/sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close(); print('ok')
