# Mix React Bits sounds (rendered to WAV from the React Bits sound library) on the story beats.
import numpy as np, wave
SR=48000; DUR=60.0; N=int(SR*DUR); out=np.zeros((N,2))
cache={}
def load(n):
    if n in cache: return cache[n]
    w=wave.open(f'public/sfx/{n}.wav'); ch=w.getnchannels(); assert w.getframerate()==SR
    a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768; a=a.reshape(-1,ch)
    if ch==1: a=np.repeat(a,2,1)
    cache[n]=a; return a
def put(n,frame,gain=1.0):
    a=load(n)*gain; i=int(frame/30*SR); k=min(len(a),N-i)
    if k>0: out[i:i+k]+=a[:k]
# page turns between chapters
for s in [165,345,480,730,1000,1240,1505,1685]:
    put('unfold',s,0.6); put('swish',s+4,0.5)
# hook
put('glimmer',22,0.45); [put('blop',78+9*i,0.6) for i in range(3)]
# problem: everyone sees everything
put('glimmer',165+34,0.35); [put('bubble',165+92+7*i,0.55) for i in range(4)]; put('thock',165+108,0.5)
# turn
put('whip',345+8,0.5); put('reveal',345+10,0.55); put('stamp',345+30,0.8); put('glimmer',345+60,0.5)
# code
[put('keycap',480+52+4*i,0.5) for i in range(6)]; put('tab',480+112,0.7); put('ping',480+120,0.5); put('glimmer',480+130,0.35)
# add role
[put('blop',730+44+8*i,0.45) for i in range(3)]; put('thock',730+94,0.6); put('popover',730+104,0.7)
put('tab',730+160,0.7); put('ding',730+170,0.45); put('glimmer',730+150,0.35)
# login
for st,nn in [(1046,6),(1070,5),(1090,8)]:
    [put('keycap',st+3*i,0.4) for i in range(nn)]
put('tab',1122,0.7); put('tickertape',1128,0.35); put('check',1160,0.8); put('chime',1160,0.5); put('glimmer',1146,0.3)
# views
put('glimmer',1270,0.35); [put('sprout',1292+5*i,0.5) for i in range(3)]
put('glimmer',1330,0.35); [put('sprout',1352+5*i,0.5) for i in range(5)]
# control
put('counter',1539,0.6); put('unclasp',1597,0.9); put('ping',1607,0.5); put('glimmer',1609,0.3)
# outro
put('wand',1693,0.5); put('emblem',1725,0.8); put('chime',1745,0.5)
# soft React Bits «calm» bed, looped with crossfades
bed=load('calm'); L=len(bed); fade=int(0.8*SR); env=np.ones(L); env[:fade]=np.linspace(0,1,fade); env[-fade:]=np.linspace(1,0,fade)
i=0
while i<N:
    k=min(L,N-i); out[i:i+k]+=(bed*env[:,None])[:k]*0.32; i+=L-fade
t=np.arange(N)/SR; out*=np.minimum(1,(DUR-t)/1.5)[:,None]*np.minimum(1,t/0.4+0.2)[:,None]
out=out/np.max(np.abs(out))*0.89
w=wave.open('out/sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close(); print('ok')
