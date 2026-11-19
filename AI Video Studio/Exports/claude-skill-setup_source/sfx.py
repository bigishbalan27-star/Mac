import numpy as np, wave
sr=48000; T=30.5+0.3; out=np.zeros(int(sr*T)); rng=np.random.default_rng(5)
def add(sig,t,g):
    i=int(max(0,t)*sr); n=min(len(sig),len(out)-i)
    if n>0: out[i:i+n]+=sig[:n]*g
def whoosh(d=0.32):
    n=int(sr*d); x=rng.standard_normal(n); env=np.sin(np.linspace(0,np.pi,n))**2
    y=np.zeros(n); s=0.0
    for k in range(n):
        a=0.02+0.25*(k/n); s=s+a*(x[k]-s); y[k]=s
    return y*env*1.6
def pop(f=520,d=0.12):
    n=int(sr*d); tt=np.arange(n)/sr; fr=f*(1+1.5*np.exp(-tt*40))
    return np.sin(2*np.pi*np.cumsum(fr)/sr)*np.exp(-tt*30)
def click():
    n=int(sr*0.018); tt=np.arange(n)/sr
    return rng.standard_normal(n)*np.exp(-tt*400)*0.6+np.sin(2*np.pi*2400*tt)*np.exp(-tt*300)*0.3
def chime():
    n=int(sr*0.6); tt=np.arange(n)/sr
    return sum(np.sin(2*np.pi*f*tt)*np.exp(-tt*6)/(i+1) for i,f in enumerate([880,1320,1760]))*0.5
for s in [2.8,5.8,9.2,12.6,16.0,20.0,23.6,26.8]: add(whoosh(),s-0.12,0.10)
add(pop(700),0.1,0.18)                                   # asterisk
for i in range(7): add(pop(560+i*40),3.15+i*0.22,0.10)   # folder rows
add(pop(900),4.6,0.14)                                   # .claude highlight
for i in range(4): add(pop(620+i*90),6.6+i*0.5,0.16)     # plugin toggles
for k in range(70): add(click(),9.5+k*(2.5/70)+rng.uniform(-0.006,0.006),0.09)  # SKILL.md typing
for i in range(26): add(pop(500+(i%5)*80,0.08),12.8+(0 if i==0 else 0.35 if i<9 else 0.7)+i*0.02,0.05)  # map nodes
add(pop(760),14.4,0.14)                                  # 463 nodes pill
add(pop(600),16.1,0.14); add(pop(680),17.6,0.14)         # Claude / Codex cards
add(chime(),19.0,0.14)                                   # APPROVED
for i in range(4): add(pop(640+i*60,0.09),20.3+i*0.35,0.10)  # diff lines
add(chime(),22.2,0.13)                                   # check
for i in range(4):
    add(pop(700+i*70),24.1+i*0.45,0.13)
    for k in range(6): add(click(),24.0+i*0.45+k*0.055,0.07)  # ready lines
add(pop(820),27.0,0.16)
for k in range(6): add(click(),27.4+k*0.1,0.09)          # STUDIO typing
add(chime(),28.4,0.15)
out=np.tanh(out*1.2)*0.9
w=wave.open('public/sfx.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
w.writeframes((out*32767).astype(np.int16).tobytes()); w.close()
print('ok',round(float(np.abs(out).max()),3))
