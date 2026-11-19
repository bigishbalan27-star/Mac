"""Join line_XX.wav into one voice track and write timing.json for the reel.

timing.json: {"scenes": [[start, end], ...], "words": [[[word, start, end], ...] per scene],
              "anchors": [[real, nominal], ...], "end": seconds}
Times are seconds in the final video. Nominal times are the v1 scene starts, so the
animations inside each scene stretch to fit the spoken line.
"""
import json, re, numpy as np, soundfile as sf, scipy.signal as ss
from faster_whisper import WhisperModel
NOMINAL=[0.0,2.8,5.8,9.2,12.6,16.0,20.0,23.6,26.8,30.5]
LEAD, GAP, TAIL = 0.35, 0.55, 1.6
SR=48000
segs=[]
for i in range(9):
    a,sr=sf.read(f'line_{i:02d}.wav'); a=a if a.ndim==1 else a.mean(1)
    a=ss.resample_poly(a,SR,sr)
    nz=np.where(np.abs(a)>0.01)[0]; a=a[max(0,nz[0]-int(0.03*SR)):nz[-1]+int(0.08*SR)]  # trim silence
    segs.append(a)
starts=[]; t=LEAD
for a in segs: starts.append(t); t+=len(a)/SR+GAP
end=round(t-GAP+TAIL,2)
track=np.zeros(int(end*SR))
for s,a in zip(starts,segs): i=int(s*SR); track[i:i+len(a)]+=a
peak=np.abs(track).max(); track=track/peak*0.89
sf.write('voice.wav',track.astype(np.float32),SR,subtype='PCM_16')
w=WhisperModel('small.en',compute_type='int8')
LINES=["This is how I set up Claude.","It all lives in one folder, on GitHub.","One small file switches on the skills.",
"A skill is just simple notes Claude can read.","A map shows how every file connects.","Claude writes the plan. Codex checks it.",
"Claude builds it. Codex checks again.","Every new session starts ready. Lovely.","Comment STUDIO, and I can send you the setup."]
words=[]
for k,(s,a) in enumerate(zip(starts,segs)):
    a16=ss.resample_poly(a,16000,SR).astype(np.float32)
    ws=[x for seg in w.transcribe(a16,word_timestamps=True)[0] for x in seg.words]
    script=LINES[k].split()
    if len(ws)!=len(script):  # fall back to even spacing if whisper splits words differently
        d=len(a)/SR; ws=None
        words.append([[sw,round(s+d*j/len(script),3),round(s+d*(j+1)/len(script),3)] for j,sw in enumerate(script)])
        print('line',k,'even spacing'); continue
    words.append([[sw,round(s+x.start,3),round(s+x.end,3)] for sw,x in zip(script,ws)])
scenes=[]
for k in range(9):
    a=0.0 if k==0 else round(starts[k]-0.25,3)
    b=end if k==8 else round(starts[k+1]-0.25,3)
    scenes.append([a,b])
anchors=[[sc[0],NOMINAL[k]] for k,sc in enumerate(scenes)]+[[end,NOMINAL[-1]]]
json.dump({'scenes':scenes,'words':words,'anchors':anchors,'end':end},open('timing.json','w'),indent=1)
print('END',end); [print(k,sc,' '.join(x[0] for x in words[k])) for k,sc in enumerate(scenes)]
