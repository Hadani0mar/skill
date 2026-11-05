#!/usr/bin/env python3
"""Procedural foley (numpy) placed on the film timeline + final mix with the music and the narration."""
import numpy as np, subprocess, wave, sys, os
sr=44100; L=int(64.0*sr); rng=np.random.default_rng(7)
buf=np.zeros((L,2),dtype=np.float64)
def add(t0,x,gain=1.0,pan=0.0):
    i=int(t0*sr); n=min(len(x),L-i)
    if n<=0 or i<0: return
    x=x[:n]*gain; buf[i:i+n,0]+=x*(1-max(0,pan)); buf[i:i+n,1]+=x*(1+min(0,pan))
def env(n,a=.005,d=.3):
    t=np.arange(n)/sr; return np.minimum(t/a,1.0)*np.exp(-t/d)
def lp(x,fc):  # one-pole lowpass, fc may be array
    y=np.zeros_like(x); a=np.broadcast_to(1-np.exp(-2*np.pi*np.asarray(fc)/sr),x.shape); s=0.0
    for k in range(len(x)):
        s+=a[k]*(x[k]-s); y[k]=s
    return y
def whoosh(t0,dur=.5,g=.16):
    n=int(dur*sr); x=rng.standard_normal(n); fc=np.linspace(300,4200,n)**1.0
    y=lp(x,fc); y-=lp(y,np.full(n,200)); sh=np.sin(np.pi*np.linspace(0,1,n))**2
    add(t0,y*sh,g/ (np.abs(y).max()+1e-9))
def ping(t0,f=880,g=.10,d=.7):
    n=int(1.2*sr); t=np.arange(n)/sr
    x=(np.sin(2*np.pi*f*t)+.35*np.sin(2*np.pi*2*f*t)+.15*np.sin(2*np.pi*3.01*f*t))*env(n,.003,d); add(t0,x,g)
def thock(t0,f=150,g=.16):
    n=int(.25*sr); t=np.arange(n)/sr; fr=f*np.exp(-t*9)
    x=np.sin(2*np.pi*np.cumsum(fr)/sr)*env(n,.002,.07); c=lp(rng.standard_normal(n),2500)*env(n,.001,.012)*.5; add(t0,x+c,g)
def tick(t0,g=.05,f=3200):
    n=int(.02*sr); t=np.arange(n)/sr; add(t0,np.sin(2*np.pi*f*t)*env(n,.0005,.006),g)
def impact(t0,g=.35):
    n=int(1.6*sr); t=np.arange(n)/sr; fr=70*np.exp(-t*1.2)+32
    x=np.sin(2*np.pi*np.cumsum(fr)/sr)*env(n,.003,.55); nz=lp(rng.standard_normal(n),700)*env(n,.001,.2)*.7; add(t0,x+nz,g)
def riser(t0,dur,g=.10):
    n=int(dur*sr); x=rng.standard_normal(n); fc=np.linspace(250,6000,n); y=lp(x,fc); y-=lp(y,np.full(n,250))
    add(t0,y*np.linspace(0,1,n)**2.2,g/(np.abs(y).max()+1e-9))
def shimmer(t0,g=.06,dur=1.6):
    for k in range(26):
        f=rng.uniform(2200,7000); ti=t0+rng.uniform(0,dur*.7); n=int(.5*sr); t=np.arange(n)/sr
        add(ti,np.sin(2*np.pi*f*t)*env(n,.002,.12),g*rng.uniform(.4,1),pan=rng.uniform(-.8,.8))
# --- events (film seconds)
for c in [6.7,11.15,14.6,19.0,31.5,38.6,44.9,49.9]: whoosh(c-.25)
impact(3.0,.22)
for t in [4.46,4.9,5.4]: thock(t,170,.07)
ping(7.8,1175,.08)
for k in range(30): tick(8.0+k*.1,.035)
impact(16.3,.38)
for t,f in [(20.7,130),(21.9,140),(22.6,150),(23.0,150)]: thock(t,f,.14)
tick(23.85,.06)
riser(24.0,2.5,.12); shimmer(26.5,.06); ping(26.5,660,.09,1.2)
for k in range(30): tick(32.5+k*.1,.035)
ping(36.6,880,.09); tick(40.7,.08); tick(41.8,.06); ping(42.95,1175,.10,1.0)
for t in [46.85,47.65,48.45]: thock(t,180,.08)
for i,t in enumerate([50.9,51.15,51.4,51.65]): thock(t,120+20*i,.14)
impact(51.7,.30); shimmer(51.7,.05)
thock(53.95,90,.22); ping(56.6,880,.06,1.4)
pk=np.abs(buf).max(); buf*=min(1.0,.7/pk)
pcm=(buf*32767).astype(np.int16)
w=wave.open(os.path.join(os.path.dirname(__file__),'sfx.wav'),'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm.tobytes()); w.close()
print('sfx ok',pk)
