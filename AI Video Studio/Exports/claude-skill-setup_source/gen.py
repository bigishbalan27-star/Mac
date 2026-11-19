import torch, torchaudio as ta, re, json, time, numpy as np, scipy.signal as ss
from chatterbox.tts import ChatterboxTTS
from faster_whisper import WhisperModel
LINES=["This is how I set up Claude.","It all lives in one folder, on GitHub.","One small file switches on the skills.",
"A skill is just simple notes Claude can read.","A map shows how every file connects.","Claude writes the plan. Codex checks it.",
"Claude builds it. Codex checks again.","Every new session starts ready. Lovely.","Comment Studio, and I can send you the setup."]
SAME={'codecs':'codex','clawed':'claude','clod':'claude','github':'github'}
def n(s):
    s=s.lower().replace('git hub','github')
    return [SAME.get(w,w) for w in re.sub(r'[^a-z ]','',s).split()]
m=ChatterboxTTS.from_pretrained(device="cpu"); w=WhisperModel("small.en",compute_type="int8")
report={}
for i,l in enumerate(LINES):
    ok=False
    for seed in [7,11,23,42,77,101]:
        t=time.time(); torch.manual_seed(seed)
        wav=m.generate(l, audio_prompt_path="ref.wav", exaggeration=0.4, cfg_weight=0.5, temperature=0.7)
        a=wav.squeeze().numpy(); a16=ss.resample_poly(a,16000,m.sr).astype(np.float32)
        txt=" ".join(s.text for s in w.transcribe(a16)[0]).strip()
        ok=n(txt)==n(l)
        print(i,seed,'OK' if ok else 'XX',round(time.time()-t,1),txt,flush=True)
        if ok or seed==101:
            ta.save(f"line_{i:02d}.wav",wav,m.sr); report[i]={'seed':seed,'ok':ok,'heard':txt}; break
json.dump(report,open('report.json','w'),indent=1)
print('DONE',sum(r['ok'] for r in report.values()),'/',len(LINES))
