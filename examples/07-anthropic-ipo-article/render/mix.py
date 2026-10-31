# Mix React Bits sounds (rendered to WAV from the React Bits sound library) on the story beats.
import numpy as np, wave
STARTS=[130,508,935,1306,1719,2125,2440,2839]; OUTRO=3182; TOTAL=3312
KICK=['الطرح المرتقب','الموظفون والمؤسسون','منتصف نوفمبر','أصحاب الملايين','المصلحة العامة','تعهد بالتبرع','وادي السيليكون','ما بعد الطرح']
TEXTS=[l for l in open('src/Video.tsx',encoding='utf8').read().split("text: '")[1:]]
WORDS=[len(t.split("'")[0].split(' ')) for t in TEXTS]
SR=48000; DUR=TOTAL/30; N=int(SR*DUR); out=np.zeros((N,2)); cache={}
def load(n):
    if n in cache: return cache[n]
    w=wave.open(f'public/sfx/{n}.wav'); ch=w.getnchannels(); assert w.getframerate()==SR
    a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768; a=a.reshape(-1,ch)
    if ch==1: a=np.repeat(a,2,1)
    cache[n]=a; return a
def put(n,frame,gain=1.0):
    a=load(n)*gain; i=int(frame/30*SR); k=min(len(a),N-i)
    if k>0: out[i:i+k]+=a[:k]
# intro
put('braam',0,0.75); put('reveal',8,0.6); [put('tally',70+8*i,0.5) for i in range(3)]
stat={0:[('counter',8,.6),('coin',42,.7)],1:[('tickertape',8,.55)]+[('tally',30+4*i,.4) for i in range(7)],
      2:[('coin',8,.6),('counter',10,.55)],3:[('counter',8,.55),('treasure',40,.55)],4:[('glimmer',8,.5),('chime',46,.35)],
      5:[('counter',8,.55),('stamp',48,.7),('coin',50,.5)],6:[('unease',0,.35),('stamp',8,.5)],7:[('data',8,.5),('tally',8,.3),('tally',15,.3),('tally',22,.3)]}
for i,s in enumerate(STARTS):
    put('whip',s-6,0.55)
    for k in range(0,len(KICK[i]),2): put('keycap',s+4+k*1.6,0.42)       # kicker typing clicks
    for n,o,g in stat[i]: put(n,s+o,g)
    for w in range(WORDS[i]): put('tab',s+34+w*7,0.13)                   # soft click per revealed word
put('whip',OUTRO-6,0.55); put('emblem',OUTRO+6,0.75); put('chime',OUTRO+34,0.45)
bed=load('nocturne'); L=len(bed); fade=int(0.8*SR); env=np.ones(L); env[:fade]=np.linspace(0,1,fade); env[-fade:]=np.linspace(1,0,fade)
i=0
while i<N:
    k=min(L,N-i); out[i:i+k]+=(bed*env[:,None])[:k]*0.3; i+=L-fade
t=np.arange(N)/SR; out*=np.minimum(1,(DUR-t)/1.5)[:,None]
out=out/np.max(np.abs(out))*0.89
w=wave.open('out/sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close(); print('ok',WORDS)
