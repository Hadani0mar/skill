import json, re, subprocess, numpy as np
text = open('script4.txt').read().split()
# phrases = split after words ending with … ، . ؟ ! :
phr, cur = [], []
for w in text:
    cur.append(w)
    if re.search('[…،.؟!:]$', w): phr.append(cur); cur = []
if cur: phr.append(cur)
raw = subprocess.run(['ffmpeg','-v','quiet','-i','voice4.wav','-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout
a = np.frombuffer(raw, np.float32); hop = 160
e = np.array([np.sqrt(np.mean(a[i:i+hop]**2)) for i in range(0, len(a)-hop, hop)])   # 10 ms frames
db = 20*np.log10(e+1e-9)
def segments(th, mingap):
    voiced = db > th; segs = []; i = 0; n = len(voiced)
    while i < n:
        if voiced[i]:
            j = i
            while j < n and (voiced[j] or (j+1 < n and not voiced[j] and np.any(voiced[j:j+mingap]))): j += 1
            segs.append([i/100, j/100]); i = j
        else: i += 1
    return [s for s in segs if s[1]-s[0] > .12]
best = None
for th in (-42,-40,-38,-36,-34,-32,-30):
    for mg in (12,15,18,22,26,30,35):
        s = segments(th, mg)
        if best is None or abs(len(s)-len(phr)) < abs(len(best[0])-len(phr)): best = (s, th, mg)
        if len(s) == len(phr): break
    if len(best[0]) == len(phr): break
segs, th, mg = best
print('phrases', len(phr), 'segments', len(segs), th, mg)
# if counts differ, merge closest-gap segments or split longest until equal
while len(segs) > len(phr):
    gaps = [segs[i+1][0]-segs[i][1] for i in range(len(segs)-1)]; k = int(np.argmin(gaps))
    segs[k] = [segs[k][0], segs[k+1][1]]; del segs[k+1]
while len(segs) < len(phr):
    k = int(np.argmax([s[1]-s[0] for s in segs])); m = (segs[k][0]+segs[k][1])/2
    segs.insert(k+1, [m, segs[k][1]]); segs[k] = [segs[k][0], m]
W = []
for p, (s0, s1) in zip(phr, segs):
    L = [len(re.sub('[…،.؟!:]','',w))+1.5 for w in p]; tot = sum(L); t = s0
    for w, l in zip(p, L):
        d = (s1-s0)*l/tot; W.append({'text':w,'type':'word','start':round(t,3),'end':round(t+d*.92,3)}); t += d
json.dump({'words':W}, open('words4.json','w'), ensure_ascii=False)
for p,(s0,s1) in zip(phr,segs): print(f'{s0:6.2f}-{s1:6.2f}', ' '.join(p))
