# claude-skill-setup_v1_9x16

**Idea:** a short reel showing how my Claude setup lives in the Mac repo on GitHub: the `.claude` folder, the plugins it switches on, skills as simple notes, the graphify map, and Claude and Codex checking each other's work.

- **Format:** 1080×1920, 30 fps, 30.5 s, H.264 + AAC
- **Words:** on-screen captions only, no voiceover, written to `voice.md` (Drive, AI Video Studio/References): short lines, one thought each, simple words, calm, no hype words. One ask at the end: comment STUDIO, same keyword as made-by-claude.
- **Style:** same as made-by-claude: off-white grid, word-by-word captions, key words bold, emphasis words in blue serif italic, Claude in coral. Chapter tracker: FOLDER · SKILLS · MAP · REVIEW · READY.
- **Sound:** whooshes, pops, typing clicks and chimes, made with `sfx.py` (same recipe as `sfx2.py`).
- **Everything shown is real:** plugin names from `.claude/settings.json`, the `claudex-loop` SKILL.md, the 463-node graphify graph, the `build_timing.py` fix that Codex reviewed, and the setup script that installs graphify, claudex-loop, codex and ecc.
- **Built with:** Remotion 4 (source in `claude-skill-setup_source/`). Fonts: Inter, Instrument Serif italic, JetBrains Mono (from @fontsource; put the woff2 files in `public/fonts/` as named in `Reel.tsx`). Run `python3 sfx.py` to make `public/sfx.wav` before rendering.

## Before posting

- Have the STUDIO DM reply ready (link to this repo / the setup).
- Caption idea in my voice: "This is how I set up Claude for my videos. Slowly by slowly, it all came together. 💻✨"

## v2: in my own voice

- **Voice:** a clone of my voice, made from the first 15 s of `References/voice-recording-bigishbalan.m4a` with the open-source **Chatterbox** model (MIT), the same way as made-by-claude v4. It ran on the cloud session's CPU; the recording was only used there and in this repo.
- **Checks:** every line was transcribed back with Whisper and compared word for word; all 9 match (line 1 needed a second seed: the first take said "Cloud"). The finished video's audio also transcribes back to the full script.
- **Timing:** 28.8 s, about 150 words a minute (voice.md target: 155). Captions appear on each spoken word; scenes and sound effects are time-warped to the voice (`timing.json`, anchors at each scene start).
- **Re-make:** cut `ref.wav` (first 15 s, mono 24 kHz), run `gen.py`, then `assemble.py` (writes `voice.wav` and `timing.json`), copy `timing.json` to `src/` and `voice.wav` to `public/`, run `sfx_v2.py`, then render.
