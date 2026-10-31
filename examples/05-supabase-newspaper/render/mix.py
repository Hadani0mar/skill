# Mix React Bits sounds (rendered to WAV from the React Bits sound library) on the cut frames.
import numpy as np, wave
SR=48000; DUR=34.0; N=int(SR*DUR); out=np.zeros((N,2))
def load(n):
    w=wave.open(f'public/sfx/{n}.wav'); sr=w.getframerate(); ch=w.getnchannels()
    a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768; a=a.reshape(-1,ch)
    if ch==1: a=np.repeat(a,2,1)
    assert sr==SR, sr
    return a
def put(n,frame,gain=1.0):
    a=load(n)*gain; i=int(frame/30*SR); k=min(len(a),N-i)
    if k>0: out[i:i+k]+=a[:k]
P=105; stop=lambda i: P+40+i*105
put('braam',0,0.8); put('reveal',8,0.9); put('glimmer',56,0.6)
put('sweep',P,0.7)
for i in range(5):
    put('swish',stop(i)-30,0.55)          # camera pan to the article
    put('thock',stop(i)+18,0.7)          # highlighter lands
put('stamp',stop(2)+34,0.6); put('thock',stop(2)+76,0.7)
put('tickertape',690,0.8); put('counter',762,0.8); put('swell',680,0.5)
put('stamp',856,0.7); put('glimmer',870,0.6); put('keycap',908,0.5)
put('emblem',949,0.85); put('chime',985,0.7)
# quiet suspense bed, looped with crossfades under the story acts
bed=load('suspense'); L=len(bed); fade=int(0.6*SR); env=np.ones(L); env[:fade]=np.linspace(0,1,fade); env[-fade:]=np.linspace(1,0,fade)
i=0
while i<int(31*SR):
    k=min(L,N-i); out[i:i+k]+=(bed*env[:,None])[:k]*0.35; i+=L-fade
t=np.arange(N)/SR; out*=np.minimum(1,(DUR-t)/1.5)[:,None]
out=out/np.max(np.abs(out))*0.89
w=wave.open('out/sfx.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close(); print('ok')
