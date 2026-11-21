"""Turn the skills voice into caption timings and lip-sync curves.

usage:
  python3 skills_data.py            # from skills_timing_fast.json + proj/public/skills_voice.wav
  python3 skills_data.py --placeholder   # estimated timings and synthetic mouth, for previews

writes proj/src/skills_timing.json  (words + display words with digits)
       proj/src/skills_mouth.json   ({fps, open[], round[]} per video frame)
"""
import json, sys, re
import numpy as np

DISPLAY = [l.rstrip("\n") for l in open("../skills/script.txt") if l.strip()]
NUMWORDS = {"327": 6, "72": 2, "684": 6, "283": 6}  # spoken words each digit token stands for
FPS = 30


def display_words(T):
    out = []
    for li, line in enumerate(DISPLAY):
        spoken = [w for w in T["words"] if w["line"] == li]
        toks = line.split()
        need = []
        for tok in toks:
            core = re.sub(r"[^\w]", "", tok)
            need.append(NUMWORDS.get(core, 2 if core == "IG" else 1))
        if sum(need) != len(spoken):  # fall back: spread evenly over the line
            s0, e0 = spoken[0]["s"], spoken[-1]["e"]
            L = np.array([len(t) + 2 for t in toks], float); c = np.concatenate([[0], np.cumsum(L)]) / L.sum()
            for k, tok in enumerate(toks):
                out.append({"w": tok, "s": round(s0 + c[k] * (e0 - s0), 3), "e": round(s0 + c[k + 1] * (e0 - s0), 3), "line": li})
            continue
        j = 0
        for tok, n in zip(toks, need):
            out.append({"w": tok, "s": spoken[j]["s"], "e": spoken[j + n - 1]["e"], "line": li}); j += n
    return out


def mouth_from_wav(path, n_frames):
    import wave
    w = wave.open(path); sr = w.getframerate()
    a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    if w.getnchannels() > 1:
        a = a.reshape(-1, w.getnchannels()).mean(1)
    hop = sr // FPS
    opn, rnd = [], []
    for i in range(n_frames):
        x = a[i * hop:(i + 1) * hop + hop // 2]
        if len(x) < 64:
            opn.append(0.0); rnd.append(0.3); continue
        rms = float(np.sqrt((x ** 2).mean()))
        spec = np.abs(np.fft.rfft(x * np.hanning(len(x))))
        f = np.fft.rfftfreq(len(x), 1 / sr)
        band = (f > 150) & (f < 4000)
        cent = float((spec[band] * f[band]).sum() / (spec[band].sum() + 1e-9))
        opn.append(rms); rnd.append(cent)
    opn = np.array(opn); rnd = np.array(rnd)
    ref = np.percentile(opn[opn > 0.005], 90) if (opn > 0.005).any() else 1
    o = np.clip((opn - 0.008) / (ref - 0.008), 0, 1) ** 0.8
    o = np.convolve(o, [0.25, 0.5, 0.25], "same")
    # low spectral centroid ~ rounded vowels (o/u), high ~ wide (e/i)
    r = np.clip((2200 - rnd) / 1400, 0, 1)
    return [round(float(v), 3) for v in o], [round(float(v), 3) for v in r]


if __name__ == "__main__":
    if "--placeholder" in sys.argv:
        spoken = json.load(open("voice_gen_lines.json"))
        t = 0; words = []; starts = []
        for i, line in enumerate(spoken):
            starts.append(round(t, 3)); ws = line.split(); d = len(ws) / 2.5
            for k, w in enumerate(ws):
                words.append({"w": w, "s": round(t + k * d / len(ws), 3), "e": round(t + (k + 1) * d / len(ws), 3), "line": i})
            t += d + 0.3
        T = {"words": words, "lineStarts": starts, "end": round(t, 3), "lines": spoken}
        n = int((T["end"] + 1.5) * FPS)
        tt = np.arange(n) / FPS
        o = (np.clip(np.sin(tt * 11) * 0.5 + 0.5, 0, 1) * (np.sin(tt * 1.7) > -0.6)).round(3).tolist()
        r = (np.sin(tt * 3.1) * 0.5 + 0.5).round(3).tolist()
    else:
        T = json.load(open("skills_timing_fast.json"))
        n = int((T["end"] + 1.5) * FPS)
        o, r = mouth_from_wav("proj/public/skills_voice.wav", n)
    T["display"] = display_words(T)
    json.dump(T, open("proj/src/skills_timing.json", "w"), indent=1)
    json.dump({"fps": FPS, "open": o, "round": r}, open("proj/src/skills_mouth.json", "w"))
    print("end", T["end"], "display words", len(T["display"]), "frames", n)
