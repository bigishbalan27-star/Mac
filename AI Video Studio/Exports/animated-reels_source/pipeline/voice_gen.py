"""Generate each reel line in the cloned voice, verify it with Whisper, and
write one voice track per reel plus per-word timings for the captions.

usage: python3 voice_gen.py <reel_id>   (reel5 | reel6)
needs: ref.wav (15 s of the speaker), chatterbox-tts, faster-whisper
"""
import json, re, sys, numpy as np, scipy.signal as ss, torch, torchaudio as ta
from chatterbox.tts import ChatterboxTTS
from faster_whisper import WhisperModel

LINES = {
    "reel5": [
        "Twelve stops planned. My toddler cancelled nine.",
        "Because I'm a Kerala dad, so obviously",
        "I made a colour-coded spreadsheet. For a Greek island.",
        "Seven a.m. breakfast. Eight sharp, windmills.",
        "Ten o'clock, Little Venice. Lunch already booked.",
        "Day one. He's busy inspecting the hotel bed.",
        "Ten out of ten. Plan gone.",
        "Then he found the beach, in October,",
        "and that was it. Nobody was moving.",
        "Three stops. Best holiday we've had.",
        "Parents, plan or go? Comment below.",
        "Next trip? Spreadsheet's ready. Twelve stops.",
    ],
    "reel6": [
        "Malayalam only, I said. Cheers, said my son.",
        "One rule in this house. Kerala rules.",
        "Choru venno? No thanks. Chips please.",
        "Very polite. Wrong language.",
        "Please, thank you, cheers.",
        "All of it in English, every single time.",
        "But I'm not giving up.",
        "One day he'll visit Kerala,",
        "and I want him to understand",
        "every word the family says to him.",
        "UK Mallu parents, Malayalam or English? Comment below.",
        "Me? Still asking in Malayalam. He's still saying cheers.",
    ],
}
# words Whisper (English) can't be expected to spell: skipped in the check
LOOSE = {"choru", "venno", "malayalam", "mallu", "kerala"}
GAP = 0.32  # seconds of silence between lines

NUM = {"1": "one", "3": "three", "7": "seven", "8": "eight", "9": "nine", "10": "ten", "12": "twelve", "10/10": "ten out of ten"}
SPELL = {"color": "colour", "o'clock": "o'clock", "a.m": "am", "a.m.": "am"}


def norm(s):
    s = s.lower().replace("a.m.", "am").replace("10/10", "ten out of ten").replace("-", " ")
    s = re.sub(r"\b(\d+)\b", lambda m: NUM.get(m.group(1), m.group(1)), s)
    s = s.replace("color", "colour").replace("he is ", "he's ").replace("he will ", "he'll ")
    # Whisper's spellings of the Malayalam words: treat them as the loose words
    s = re.sub(r"\b(malu|maloo|mallu)\b", "mallu", s)
    s = re.sub(r"\b(go to veno|coru ?venn?[ou]|coruvenu|jiroveno|choru venno)\b", "choru venno", s)
    return re.sub(r"[^a-z' ]", " ", s).split()


def matches(heard, want):
    h, w = norm(heard), norm(want)
    w_strict = [x for x in w if x not in LOOSE]
    h_strict = [x for x in h if x not in LOOSE]
    if w_strict == h_strict:
        return True
    near = sum(a == b for a, b in zip(w_strict, h_strict))
    return len(w_strict) > 3 and near >= len(w_strict) - 1 and abs(len(h_strict) - len(w_strict)) <= 1


def main(reel):
    lines = LINES[reel]
    m = ChatterboxTTS.from_pretrained(device="cpu")
    wm = WhisperModel("small.en", compute_type="int8")
    sr = m.sr
    out, words, line_starts, t, report = [], [], [], 0.0, []
    for i, line in enumerate(lines):
        best = None
        for seed in [7, 11, 23, 42, 77, 101]:
            torch.manual_seed(seed)
            wav = m.generate(line, audio_prompt_path="ref.wav", exaggeration=0.35, cfg_weight=0.45, temperature=0.7)
            a = wav.squeeze().numpy()
            a16 = ss.resample_poly(a, 16000, sr).astype(np.float32)
            segs = list(wm.transcribe(a16, word_timestamps=True)[0])
            heard = " ".join(s.text for s in segs).strip()
            ok = matches(heard, line)
            print(reel, i, seed, "OK" if ok else "XX", "|", heard, flush=True)
            if best is None or ok:
                best = (a, segs, heard, ok, seed)
            if ok:
                break
        a, segs, heard, ok, seed = best
        idx = np.where(np.abs(a) > 0.01)[0]  # trim silence at both ends
        lo, hi = (max(0, idx[0] - int(0.04 * sr)), min(len(a), idx[-1] + int(0.08 * sr))) if len(idx) else (0, len(a))
        a = a[lo:hi]
        off = lo / sr
        hw = [(w.start - off, w.end - off) for s in segs for w in (s.words or [])]
        script_words = line.split()
        dur = len(a) / sr
        if len(hw) == len(script_words):
            spans = hw
        else:  # spread script words over the line, weighted by length
            L = np.array([len(w) + 2 for w in script_words], float)
            c = np.concatenate([[0], np.cumsum(L)]) / L.sum()
            spans = [(c[k] * dur, c[k + 1] * dur) for k in range(len(script_words))]
        line_starts.append(round(t, 3))
        for wd, (s, e) in zip(script_words, spans):
            words.append({"w": wd, "s": round(t + max(0, s), 3), "e": round(t + max(s, e), 3), "line": i})
        out += [a, np.zeros(int(GAP * sr), np.float32)]
        report.append({"line": i, "text": line, "heard": heard, "verified": ok, "seed": seed, "dur": round(dur, 2)})
        t += dur + GAP
    ta.save(f"{reel}_voice.wav", torch.from_numpy(np.concatenate(out)).unsqueeze(0), sr)
    json.dump({"words": words, "lineStarts": line_starts, "end": round(t, 3), "lines": lines}, open(f"{reel}_timing.json", "w"), indent=1)
    json.dump(report, open(f"{reel}_report.json", "w"), indent=1)
    print("DONE", reel, round(t, 2), "s,", sum(r["verified"] for r in report), "/", len(report), "verified")


if __name__ == "__main__":
    main(sys.argv[1])
