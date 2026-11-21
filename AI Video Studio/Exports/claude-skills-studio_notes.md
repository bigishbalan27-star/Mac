# claude-skills-studio_v1_9x16

**"5 Claude skills that run my video studio"**, the same topic and look as the reference
`References/VID_20261118_220041_323.mp4` (a 57 s list: "5 Claude skills every beginner needs").
It isn't a copy: these are the five skills this repo actually uses, and every number is real.

- **Format:** 1080×1920, 30 fps, 66.6 s, H.264 + AAC
- **Source:** `animated-reels_source/src/SkillsReel.tsx` (composition `SkillsReel`), `Avatar.tsx`

## What it borrows from the reference

Near-black canvas with neon lime glow; a cartoon presenter bottom-right who talks and gestures; captions
above the presenter with the latest keyword boxed in lime; a recurring **skill-tree map** that unlocks one
node per skill with a `STUDIO SKILLS n/5` counter; a purpose-built scene for each skill; and a
comments → DM ending ("Comment SKILLS").

## What it adds

- **The presenter is me**, in navy nurse scrubs with an RN badge (the hook is "I'm a nurse. I don't code.").
  The mouth is driven frame by frame from the voice (loudness → how open, spectral centroid → round vs wide),
  with blinks, head bob, eyebrow lifts, and **the right number of fingers on every "Number one… five"**.
- **Real data, not decoration:**
  - Everything Claude Code: 327 skills and 72 agents, from the plugin's own manifest; the chips are real ECC skill names.
  - Graphify: the scene draws **this repo's actual graph** (684 nodes, 1,267 links from `graphify-out/graph.json`)
    and then the real `graphify path "Viral Swipe File" "Remotion"` result, 6 hops (each hop checked to be a real edge).
  - IG Viral: the 283× bar is the real top outlier from `Social Media/viral-swipe.md` (3.4M views on a 12K-median account).
  - IG Human: the score of 87 is this script's real humanizer score (87.4, PASS); the rewrite uses my own line from `voice.md`.
  - Remotion: the code on screen is from this reel, and a phone plays this same reel.

## Voice

My voice, cloned locally with Chatterbox from `References/voice-recording-bigishbalan.m4a` (1–16 s). **All 21 lines**
passed a strict word-for-word Whisper check. Content words must match exactly; "Clawed" is accepted for
"Claude". The model kept saying "just clod" at the end of one line, so that line was reworded to
"No editing app. Just Claude and me, slowly by slowly." (script and captions updated). Natural pace is 159 wpm, so
there's no speed-up. Per-line results: `animated-reels_source/pipeline/skills_report.json`.

## Before posting

- Turn on Instagram's **AI info** label: the voice is AI-generated.
- "Comment SKILLS": have the DM ready with links to the five skills.
- 66 s is about 9 s longer than the reference. If you want it tighter, the easiest cut is line 18 ("No editing app…").

## Re-make

```bash
cd animated-reels_source/pipeline      # with ref.wav = 15 s of my recording
python3 voice_gen.py skills && python3 tempo.py skills 1.0 && python3 sfx_gen.py skills
python3 graph_layout.py ../../../../graphify-out/graph.json && python3 skills_data.py
npx remotion render SkillsReel out/claude-skills-studio_v1_9x16.mp4
```

## Caption (linter READY · human score 91.9 PASS)

> Comment SKILLS and I'll send you all five 👇
>
> I'm a nurse in the UK. I don't code. Five Claude skills now run my whole video studio 🎬
>
> 1. Everything Claude Code. 327 skills, one install.
> 2. Graphify. It turns my project into one map, so Claude follows the path instead of reading every single file.
> 3. IG Viral. Finds the reels that beat their own normal.
> 4. IG Human. Takes the robot out of my captions.
> 5. Remotion. This is the AI video editing part, and this whole reel was made with it, slowly by slowly.
>
> New to Claude? This is Claude Code for beginners, the easy way.
>
> The cartoon is me. The voice is an AI copy of mine.
>
> #ClaudeSkills #ClaudeCode #AIVideo
