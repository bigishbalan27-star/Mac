"""Speed a reel's voice track up (pitch kept) and scale its word timings to match.
usage: python3 tempo.py reel5 1.3"""
import json, subprocess, sys
reel, k = sys.argv[1], float(sys.argv[2])
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"{reel}_voice.wav", "-af", f"atempo={k},loudnorm=I=-15:TP=-1.5", "-ar", "48000", f"proj/public/{reel}_voice.wav"], check=True)
T = json.load(open(f"{reel}_timing.json"))
for w in T["words"]:
    w["s"] = round(w["s"] / k, 3); w["e"] = round(w["e"] / k, 3)
T["lineStarts"] = [round(s / k, 3) for s in T["lineStarts"]]
T["end"] = round(T["end"] / k, 3)
json.dump(T, open(f"proj/src/{reel}_timing.json", "w"), indent=1)
json.dump(T, open(f"{reel}_timing_fast.json", "w"), indent=1)
print(reel, "end", T["end"], "s")
