import numpy as np, wave
SR=48000; DUR=24.0; N=int(SR*DUR); out=np.zeros(N); rng=np.random.default_rng(5)
def click(t,amp):
    n=int(0.012*SR); i=int(t*SR)
    if i<0 or i+n>=N: return
    x=rng.standard_normal(n)*np.exp(-np.arange(n)/(0.0018*SR)); x=np.diff(np.concatenate([[0],x]))
    body=np.sin(2*np.pi*rng.uniform(1700,2500)*np.arange(n)/SR)*np.exp(-np.arange(n)/(0.003*SR))*0.5
    out[i:i+n]+=(x*0.6+body)*amp
def thump(t,amp=0.5,f0=95):
    n=int(0.25*SR); i=int(t*SR); tt=np.arange(n)/SR
    out[i:i+n]+=np.sin(2*np.pi*(f0+120*np.exp(-tt*30))*tt)*np.exp(-tt*14)*amp
def pop(t,amp=0.22,f0=700):
    n=int(0.1*SR); i=int(t*SR); tt=np.arange(n)/SR
    out[i:i+n]+=np.sin(2*np.pi*(f0+1500*np.exp(-tt*40))*tt)*np.exp(-tt*32)*amp
def type_seg(f0,f1,count,back=False):
    for k in range(count):
        t=(f0+(f1-f0)*k/max(1,count-1))/30; click(t, rng.uniform(0.08,0.12) if not back else rng.uniform(0.05,0.08))
# q1 'شن نطلب من المورد؟' ~16 graphemes: type 4-34, erase 50-64
type_seg(4,34,16); type_seg(50,64,16,True)
# q2 'كيف تشتغل؟' ~9: q2 starts 270; type 274-296, erase 314-328
type_seg(274,296,9); type_seg(314,328,9,True)
# contact lines typing in logo sting (618+30..)
type_seg(648,665,18); type_seg(653,666,13)
for f in [66,168,216,270,330,462,510,564,618]: thump(f/30, 0.45 if f in (216,510,564) else 0.3)
for f in [176,470]: pop(f/30)            # lime pill grows
for f in [330,374,418]: pop(f/30,0.15,520) # steps
pop(578/30,0.25,900)                        # dot lands
pop((618+10)/30,0.2,600)
# metronomic soft tick every 1.47 s + quiet pad
tt=np.arange(N)/SR
pad=sum(np.sin(2*np.pi*f*tt)*0.016 for f in (146.83,220.0,277.18,329.63))
pad*=np.minimum(1,tt/1.2)*np.minimum(1,(DUR-tt)/1.5)
mix=out+pad; mix=mix/np.max(np.abs(mix))*0.88
st=(np.stack([mix,mix],1)*32767).astype(np.int16)
w=wave.open('out/sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes()); w.close(); print('ok')
