"""Synthesised sound design for an animated reel, timed from reelN_timing.json.
A soft whoosh at every scene change, a pop on emphasised words, a chime on the
last line. Same sound palette as made-by-claude's sfx2.py.

usage: python3 sfx_gen.py reel5
"""
import json, sys, wave, numpy as np

reel = sys.argv[1]
T = json.load(open(f"{reel}_timing_fast.json"))
EMPH = {"twelve", "nine", "kerala", "colour-coded", "windmills", "booked", "ten", "gone", "beach", "three", "plan", "go",
        "malayalam", "cheers", "chips", "polite", "wrong", "please", "thank", "english", "giving", "understand", "family"}
sr = 48000
out = np.zeros(int(sr * (T["end"] + 1.5)))
rng = np.random.default_rng(5)


def add(sig, t, g):
    i = int(max(0, t) * sr); n = min(len(sig), len(out) - i)
    if n > 0: out[i:i + n] += sig[:n] * g


def whoosh(d=0.32):
    n = int(sr * d); x = rng.standard_normal(n); env = np.sin(np.linspace(0, np.pi, n)) ** 2
    y = np.zeros(n); s = 0.0
    for k in range(n):
        s += (0.02 + 0.25 * k / n) * (x[k] - s); y[k] = s
    return y * env * 1.6


def pop(f=600, d=0.12):
    tt = np.arange(int(sr * d)) / sr; fr = f * (1 + 1.5 * np.exp(-tt * 40))
    return np.sin(2 * np.pi * np.cumsum(fr) / sr) * np.exp(-tt * 30)


def chime():
    tt = np.arange(int(sr * 0.6)) / sr
    return sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * 6) / (i + 1) for i, f in enumerate([880, 1320, 1760])) * 0.5


for s in T["lineStarts"][1:]:
    add(whoosh(), s - 0.22, 0.10)
seen = set()
for w in T["words"]:
    key = w["w"].lower().strip(".,?!'")
    if key in EMPH and (w["line"], key) not in seen:
        seen.add((w["line"], key))
        add(pop(500 + 60 * (w["line"] % 6)), w["s"] - 0.03, 0.13)
add(chime(), T["lineStarts"][-1] + 0.1, 0.14)
out = np.tanh(out * 1.2) * 0.9
f = wave.open(f"proj/public/{reel}_sfx.wav", "wb"); f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr)
f.writeframes((out * 32767).astype(np.int16).tobytes()); f.close()
print("ok", reel, round(len(out) / sr, 1), "s")
