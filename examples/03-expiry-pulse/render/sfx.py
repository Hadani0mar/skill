import numpy as np, wave
SR=48000; DUR=20.0; N=int(SR*DUR); out=np.zeros(N); rng=np.random.default_rng(9); tt_all=np.arange(N)/SR
def add(i,x):
    i=int(i); 
    if i<0: return
    n=min(len(x),N-i); out[i:i+n]+=x[:n]
def thump(t,amp=0.55,f0=60):
    n=int(0.35*SR); tt=np.arange(n)/SR; add(t*SR,np.sin(2*np.pi*(f0+140*np.exp(-tt*28))*tt)*np.exp(-tt*10)*amp)
def pop(t,amp=0.22,f0=700):
    n=int(0.1*SR); tt=np.arange(n)/SR; add(t*SR,np.sin(2*np.pi*(f0+1500*np.exp(-tt*40))*tt)*np.exp(-tt*32)*amp)
def click(t,amp=0.09):
    n=int(0.012*SR); x=rng.standard_normal(n)*np.exp(-np.arange(n)/(0.0018*SR)); x=np.diff(np.concatenate([[0],x]))
    add(t*SR,x*amp*0.8+np.sin(2*np.pi*2200*np.arange(n)/SR)*np.exp(-np.arange(n)/(0.003*SR))*amp*0.5)
def noise_sweep(t,d,amp,up=True):
    n=int(d*SR); x=rng.standard_normal(n); y=np.zeros(n); a=np.linspace(0.01,0.4,n) if up else np.linspace(0.4,0.01,n)
    for k in range(1,n): y[k]=y[k-1]+a[k]*(x[k]-y[k-1])
    env=np.linspace(0,1,n)**2 if up else np.sin(np.linspace(0,np.pi,n))
    add(t*SR,y*env*amp*3)
def zap(t,amp=0.2):
    n=int(0.18*SR); tt=np.arange(n)/SR; sq=np.sign(np.sin(2*np.pi*(900-3000*tt)*tt)); add(t*SR,sq*np.exp(-tt*18)*amp*0.5)
f=lambda fr: fr/30
thump(f(0),0.5); pop(f(4),0.2,500)                  # title
thump(f(30),0.35,50)                                 # card flies
pop(f(45),0.25,600)                                  # bin pops
for k in range(3): pop(f(59+k*16),0.18,800+k*120)    # chips land
noise_sweep(f(118),0.35,0.18,False); thump(f(141),0.4,70)  # into bin
thump(f(157),0.7,45); noise_sweep(f(158),0.9,0.25,False)   # star slam + goo wipe
pop(f(200),0.2,1200); click(f(201),0.15)             # cursor click
for k in range(4): thump(f(240+k*30),0.5,55)         # pillars
for k in range(3): pop(f(374+k*14),0.2,900-k*120)    # bounces
noise_sweep(f(386),1.15,0.22,True)                   # riser
zap(f(426)); thump(f(420),0.45,50)                   # glitch reveal
thump(f(465),0.4); pop(f(483),0.25,900)              # sting word + dot
thump(f(513),0.35,55)
for i in range(14): click(f(543+i*0.85),0.07)
# dark pulse pad (D minor), with a soft 120 bpm kick under pillars
pad=sum(np.sin(2*np.pi*fq*tt_all)*0.014 for fq in (73.42,146.83,174.61,220.0))
pad*=np.minimum(1,tt_all/1.0)*np.minimum(1,(DUR-tt_all)/1.5)
mix=out+pad; mix=mix/np.max(np.abs(mix))*0.88
st=(np.stack([mix,mix],1)*32767).astype(np.int16)
w=wave.open('out/sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes()); w.close(); print('ok')
