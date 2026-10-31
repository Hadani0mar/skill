# Synthesised sound bed: soft typing clicks synced to the typewriter, whooshes on cuts, a quiet warm pad.
import numpy as np, re, wave
SR=48000; DUR=70.0; N=int(SR*DUR)
out=np.zeros(N)
rng=np.random.default_rng(3)
MARK=re.compile('[ً-ٰٟۖ-ۭ]')
def graphemes(t):
    g=[]
    for ch in t:
        if MARK.match(ch) and g: g[-1]+=ch
        else: g.append(ch)
    return g
src=open('src/theme.ts',encoding='utf8').read()
lines=re.findall(r"\{t0: ([\d.]+), t1: ([\d.]+), text: '([^']+)'",src)
def click(t,amp):
    n=int(0.012*SR); i=int(t*SR)
    if i+n>=N: return
    x=rng.standard_normal(n)*np.exp(-np.arange(n)/(0.0018*SR))
    x=np.diff(np.concatenate([[0],x]))  # brighten
    body=np.sin(2*np.pi*rng.uniform(1800,2600)*np.arange(n)/SR)*np.exp(-np.arange(n)/(0.003*SR))*0.5
    out[i:i+n]+= (x*0.6+body)*amp
for t0,t1,text in lines:
    t0=float(t0); t1=float(t1); g=graphemes(text)
    cps=len(g)/max(1.5,t1-t0-1.1)
    for k,ch in enumerate(g):
        if ch.strip() and k%2==0: click(t0+k/cps, rng.uniform(0.05,0.085))
scenes=[0,5,11,19,28,38,47,55,62]
titles={11:'كيف يشتغل؟',19:'الرئيسية',28:'المخزون',38:'المالية',47:'شات الوكيل',55:'فريقك والدعم'}
for s,t in titles.items():
    st=s+(10 if s==55 else 8)/30
    for k,ch in enumerate(graphemes(t)):
        if ch.strip(): click(st+k/16, rng.uniform(0.07,0.1))
def whoosh(t,amp=0.22,d=0.45):
    n=int(d*SR); i=int((t-0.05)*SR)
    x=rng.standard_normal(n)
    # one-pole lowpass with sweeping cutoff
    y=np.zeros(n); a_=np.linspace(0.02,0.35,n)**1.2; a_=np.concatenate([a_[:n//2],a_[n//2:][::-1]])
    for k in range(1,n): y[k]=y[k-1]+a_[k]*(x[k]-y[k-1])
    env=np.sin(np.linspace(0,np.pi,n))**2
    out[i:i+n]+=y*env*amp*3
for s in scenes[1:]: whoosh(s)
# pops on the hook/outro marker swipes
def pop(t,amp=0.18,f0=900):
    n=int(0.09*SR); i=int(t*SR); tt=np.arange(n)/SR
    out[i:i+n]+=np.sin(2*np.pi*(f0+1400*np.exp(-tt*40))*tt)*np.exp(-tt*35)*amp
for t in [34/30, 62+46/30]: pop(t)
# warm pad: Cmaj7 / Am7 alternating every 8 s, very quiet
tt=np.arange(N)/SR
chords=[[130.81,164.81,196.0,246.94],[110.0,130.81,164.81,196.0]]
pad=np.zeros(N)
for c in range(int(DUR//8)+1):
    a=int(c*8*SR); b=min(N,int((c*8+9)*SR))
    if a>=N: break
    seg=tt[a:b]-c*8
    env=np.minimum(1,seg/2.0)*np.minimum(1,np.maximum(0,(9-seg)/2.0))
    for f in chords[c%2]:
        pad[a:b]+=env*(np.sin(2*np.pi*f*tt[a:b])+0.35*np.sin(2*np.pi*2*f*tt[a:b]+0.3))*0.018
fade=np.minimum(1,tt/1.5)*np.minimum(1,(DUR-tt)/2.5)
mix=out+pad*fade
mix=mix/np.max(np.abs(mix))*0.85
st=np.stack([mix,mix],1)
w=wave.open('out/sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes((st*32767).astype(np.int16).tobytes()); w.close()
print('ok', len(lines),'lines')
