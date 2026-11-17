import numpy as np, wave
import json
A=json.load(open('anchors.json'))
def inv(o):
    for i in range(1,len(A)):
        if o<=A[i][1]:
            n0,o0=A[i-1]; n1,o1=A[i]; return n0+(o-o0)/max(1e-6,o1-o0)*(n1-n0)
    return A[-1][0]+(o-A[-1][1])
sr=48000; T=A[-1][0]+0.5; out=np.zeros(int(sr*T)); rng=np.random.default_rng(3)
def add(sig,t,g):
    i=int(max(0,inv(t))*sr); n=min(len(sig),len(out)-i); out[i:i+n]+=sig[:n]*g
def whoosh(d=0.32):
    n=int(sr*d); x=rng.standard_normal(n); env=np.sin(np.linspace(0,np.pi,n))**2
    # moving lowpass via cumulative smoothing
    y=np.zeros(n); a=0.0; s=0
    for k in range(n):
        a=0.02+0.25*(k/n); s=s+a*(x[k]-s); y[k]=s
    return y*env*1.6
def pop(f=520,d=0.12):
    n=int(sr*d); tt=np.arange(n)/sr; fr=f*(1+1.5*np.exp(-tt*40))
    return np.sin(2*np.pi*np.cumsum(fr)/sr)*np.exp(-tt*30)
def thump():
    n=int(sr*0.35); tt=np.arange(n)/sr
    return np.sin(2*np.pi*(55+120*np.exp(-tt*25))*tt)*np.exp(-tt*9)*1.4 + rng.standard_normal(n)*np.exp(-tt*60)*0.3
def click():
    n=int(sr*0.018); tt=np.arange(n)/sr
    return rng.standard_normal(n)*np.exp(-tt*400)*0.6 + np.sin(2*np.pi*2400*tt)*np.exp(-tt*300)*0.3
def chime():
    n=int(sr*0.6); tt=np.arange(n)/sr
    return sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*6)/(i+1) for i,f in enumerate([880,1320,1760]))*0.5
scenes=[1.9,3.54,5.18,7.88,9.0,10.52,12.34,17.56,20.68,24.92,26.62,29.36,32.42,35.16,38.22]
for s in scenes: add(whoosh(),s-0.12,0.10)
add(thump(),23.8,0.5); add(thump(),2.84,0.4)
for t,f in [(1.15,700),(3.92,520),(4.04,600),(4.16,680),(4.6,900),(7.55,820),(8.0,600),(12.4,640),(14.5,760),(16.8,980),(19.06,600),(19.64,700),(21.2,880),(23.0,620),(23.1,700),(23.2,780),(25.6,300),(33.25,400),(34.4,980),(36.2,560),(39.2,760)]:
    add(pop(f),t,0.16)
for t0,t1,n in [(6.08,7.45,31),(38.42,38.75,6),(17.85,19.2,24),(26.85,28.3,26)]:
    for k in range(n): add(click(),t0+(t1-t0)*k/n+rng.uniform(-0.01,0.01),0.10)
for k in range(28): add(click(),9.06+k*0.04,0.05)
add(chime(),34.4,0.16); add(chime(),39.25,0.14)
out=np.tanh(out*1.2)*0.9
w=wave.open('public/sfx2.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((out*32767).astype(np.int16).tobytes()); w.close()
print('ok', np.abs(out).max())
