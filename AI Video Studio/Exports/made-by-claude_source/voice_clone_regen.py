import torch, torchaudio as ta, re, numpy as np, scipy.signal as ss
from chatterbox.tts import ChatterboxTTS
from faster_whisper import WhisperModel
m=ChatterboxTTS.from_pretrained(device="cpu"); w=WhisperModel("small.en",compute_type="int8")
fix={8:"It found the pattern.",14:"and matched every word.",16:"No editing app.",17:"No timeline.",18:"Every scene you see, is code.",24:"Comment Studio, and I can send you the setup."}
n=lambda s: re.sub(r'[^a-z ]','',s.lower().replace('6','six').replace('3','three')).split()
for i,l in fix.items():
    target=l.replace('Studio','STUDIO')
    for seed in [11,23,42,77,101]:
        torch.manual_seed(seed)
        wav=m.generate(l, audio_prompt_path="ref.wav", exaggeration=0.4, cfg_weight=0.5, temperature=0.7)
        a=wav.squeeze().numpy(); a16=ss.resample_poly(a,16000,m.sr).astype(np.float32)
        txt=" ".join(s.text for s in w.transcribe(a16)[0]).strip()
        ok=n(txt)==n(l)
        print(i,seed,'OK' if ok else 'XX',txt,flush=True)
        if ok: ta.save(f"line_{i:02d}.wav",wav,m.sr); break
