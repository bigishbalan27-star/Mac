import torch, torchaudio as ta, sys, time
from chatterbox.tts import ChatterboxTTS
torch.manual_seed(7)
m=ChatterboxTTS.from_pretrained(device="cpu")
lines=["This reel was made by Claude.","Not edited. Made.","I gave it three reels I liked,","and one simple line.","Make another one, just as good.",
"It watched them, slowly by slowly.","More than a hundred frames.","Every word. Every cut.","It found the pattern.","A new picture every second,",
"and words on screen, right on time.","Then it wrote the script,","from the first line to the last.","It picked a voice,","and matched every word.",
"And here is the lovely part.","No editing app.","No timeline.","Every scene you see is code.","Claude drew every icon,","every card, every move.",
"Then it watched the video,","and fixed what looked wrong.","The whole studio is just six folders on GitHub.","Comment STUDIO, and I can send you the setup."]
for i,l in enumerate(lines):
    t=time.time()
    w=m.generate(l, audio_prompt_path="ref.wav", exaggeration=0.4, cfg_weight=0.5, temperature=0.7)
    ta.save(f"line_{i:02d}.wav", w, m.sr); print(i, round(time.time()-t,1), l, flush=True)
