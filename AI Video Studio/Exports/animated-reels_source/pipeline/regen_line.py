"""Regenerate one line of a reel's voice track and splice it in, shifting later timings.
usage: python3 regen_line.py skills 18"""
import json, sys, numpy as np, scipy.signal as ss, torch, torchaudio as ta
from chatterbox.tts import ChatterboxTTS
from faster_whisper import WhisperModel
import voice_gen as V
reel, li = sys.argv[1], int(sys.argv[2])
T = json.load(open(f"{reel}_timing.json"))
line = T["lines"][li]
tts = sys.argv[3] if len(sys.argv) > 3 else line  # optional respelling fed to the voice model only
m = ChatterboxTTS.from_pretrained(device="cpu"); wm = WhisperModel("small.en", compute_type="int8"); sr = m.sr
got = None
for seed in [211, 307, 401, 503, 601, 709, 809, 907, 1009, 1103]:
    torch.manual_seed(seed)
    a = m.generate(tts, audio_prompt_path="ref.wav", exaggeration=0.35, cfg_weight=0.45, temperature=0.7).squeeze().numpy()
    segs = list(wm.transcribe(ss.resample_poly(a, 16000, sr).astype(np.float32), word_timestamps=True)[0])
    heard = " ".join(s.text for s in segs).strip(); ok = V.matches(heard, line)
    print(seed, "OK" if ok else "XX", heard, flush=True)
    if ok:
        got = (a, segs, heard, seed); break
if not got:
    sys.exit("no passing take")
a, segs, heard, seed = got
idx = np.where(np.abs(a) > 0.01)[0]; lo, hi = max(0, idx[0] - int(0.04 * sr)), min(len(a), idx[-1] + int(0.08 * sr)); a = a[lo:hi]; off = lo / sr
wav, wsr = ta.load(f"{reel}_voice.wav"); full = wav.squeeze().numpy()
s0 = int(T["lineStarts"][li] * wsr); s1 = int((T["lineStarts"][li + 1] - V.GAP) * wsr) if li + 1 < len(T["lineStarts"]) else int((T["end"] - V.GAP) * wsr)
new = np.concatenate([full[:s0], a, full[s1:]])
delta = len(a) / sr - (s1 - s0) / wsr
hw = [(w.start - off, w.end - off) for s in segs for w in (s.words or [])]
sw = line.split()
if len(hw) != len(sw):
    L = np.array([len(w) + 2 for w in sw], float); c = np.concatenate([[0], np.cumsum(L)]) / L.sum(); d = len(a) / sr
    hw = [(c[k] * d, c[k + 1] * d) for k in range(len(sw))]
t0 = T["lineStarts"][li]
words = [w for w in T["words"] if w["line"] < li] + [{"w": x, "s": round(t0 + max(0, s), 3), "e": round(t0 + max(s, e), 3), "line": li} for x, (s, e) in zip(sw, hw)]
words += [dict(w, s=round(w["s"] + delta, 3), e=round(w["e"] + delta, 3)) for w in T["words"] if w["line"] > li]
T["words"] = words; T["lineStarts"] = [round(s + (delta if k > li else 0), 3) for k, s in enumerate(T["lineStarts"])]; T["end"] = round(T["end"] + delta, 3)
ta.save(f"{reel}_voice.wav", torch.from_numpy(new).unsqueeze(0), wsr)
json.dump(T, open(f"{reel}_timing.json", "w"), indent=1)
R = json.load(open(f"{reel}_report.json")); R[li].update(heard=heard, verified=True, seed=seed, dur=round(len(a) / sr, 2)); json.dump(R, open(f"{reel}_report.json", "w"), indent=1)
print("spliced line", li, "delta", round(delta, 3), "end", T["end"])
