import numpy as np, wave
SR=48000; DUR=30.0; N=int(SR*DUR); out=np.zeros(N); rng=np.random.default_rng(11); T=np.arange(N)/SR
def add(i,x):
    i=int(i); n=min(len(x),N-i)
    if i>=0 and n>0: out[i:i+n]+=x[:n]
def lp(x,a):
    y=np.zeros_like(x)
    for k in range(1,len(x)): y[k]=y[k-1]+a*(x[k]-y[k-1])
    return y
def whoosh(t,amp=0.16,d=0.5):
    n=int(d*SR); y=lp(rng.standard_normal(n),0.08); add(t*SR,y*np.sin(np.linspace(0,np.pi,n))**2*amp*4)
def rustle(t,d=0.8,amp=0.12):
    n=int(d*SR); x=rng.standard_normal(n); x=x-lp(x,0.3); env=np.abs(lp(rng.standard_normal(n),0.002)); env/=env.max()+1e-9
    add(t*SR,x*env*np.sin(np.linspace(0,np.pi,n))*amp)
def tick(t,amp=0.12,f0=1800):
    n=int(0.03*SR); tt=np.arange(n)/SR; add(t*SR,np.sin(2*np.pi*f0*tt)*np.exp(-tt*160)*amp)
def ping(t,amp=0.16,f0=1320):
    n=int(0.6*SR); tt=np.arange(n)/SR; add(t*SR,(np.sin(2*np.pi*f0*tt)+0.3*np.sin(2*np.pi*f0*2.01*tt))*np.exp(-tt*6)*amp)
def thump(t,amp=0.35,f0=50):
    n=int(0.4*SR); tt=np.arange(n)/SR; add(t*SR,np.sin(2*np.pi*(f0+90*np.exp(-tt*25))*tt)*np.exp(-tt*9)*amp)
def zap(t,amp=0.12):
    n=int(0.35*SR); add(t*SR,np.sign(np.sin(2*np.pi*np.cumsum(np.full(n,60+rng.random()*40))/SR*40))*rng.random(n)*np.exp(-np.arange(n)/SR*9)*amp)
f=lambda fr: fr/30
for fr in [60,135,200,270,375,440,495,540,645,750,795,850]: whoosh(f(fr)-0.15)
for k in range(10): tick(f(14+k*2),0.08,1500+k*40)          # year roll
rustle(f(62),0.9); rustle(f(272),1.2,0.14); rustle(f(330),0.6,0.08)
for k in range(16): tick(f(375+8+k*2),0.06,1200+k*60)       # 8 -> 800
thump(f(495),0.3); thump(f(750),0.35); zap(f(750))
for k in range(3): ping(f(858+k*10),0.13,1180+k*140)
ping(f(575),0.08,880); ping(f(610),0.1,990)
# documentary drone: low fifths with slow swell, darker in act 2
lfo=0.6+0.4*np.sin(2*np.pi*T/7)
drone=(np.sin(2*np.pi*55*T)+0.6*np.sin(2*np.pi*82.4*T)+0.25*np.sin(2*np.pi*110*T+0.5))*0.05*lfo
pad2=(np.sin(2*np.pi*164.8*T)+np.sin(2*np.pi*196*T)+np.sin(2*np.pi*246.9*T))*0.012*np.clip((T-16.5)/2,0,1)
mix=out+(drone+pad2)*np.minimum(1,T/1.5)*np.minimum(1,(DUR-T)/2)
mix=mix/np.max(np.abs(mix))*0.88
w=wave.open('out/sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.stack([mix,mix],1)*32767).astype(np.int16).tobytes()); w.close(); print('ok')
