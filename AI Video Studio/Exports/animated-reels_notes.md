# Animated reels: Reel 5 and Reel 6

Animated versions of the two talking-to-camera scripts in
[`Social Media/reel-edit-plans.md`](../../Social%20Media/reel-edit-plans.md),
made 19 Nov 2026 in the made-by-claude style (off-white grid, word-by-word
captions, blue serif-italic key words, one drawn scene per spoken line).

| File | Script | Length |
|---|---|---|
| **`mykonos-spreadsheet_animated_v2_9x16.mp4`** | Reel 5, "Kerala dad's Mykonos spreadsheet" | 36.7 s |
| **`kerala-rules_animated_v2_9x16.mp4`** | Reel 6, "Kerala rules, UK kid" | 35.0 s |
| `*_animated_v1_9x16.mp4` | first versions, kept for comparison | |

1080×1920, 30 fps, H.264 + AAC. The voice is normalised to −15 LUFS. **Use v2.**

## v2: cloned from my original recording

- **Reference:** 1–16 s of my own recording, `AI Video Studio/References/voice-recording-bigishbalan.m4a`
  (the same window as made-by-claude v4).
- **Checks:** all 24 lines (12 per reel) matched their script when transcribed back with Whisper. The check
  accepts Whisper's spellings of the Malayalam words ("Coruveno" for "Choru venno", "Malu" for "Mallu"), so
  "Choru venno" is still an English model's attempt at Malayalam: **record that line yourself** if it
  should sound right.
- **Closer to me:** median pitch is 117 Hz against 121 Hz in v1; my recording is 103 Hz.
- **Pace:** the v2 clone already speaks faster (Reel 5 at 132 wpm, Reel 6 at 144 wpm), so it is only
  sped up 1.15× and 1.05× respectively, to about 151 wpm. My measured pace is 155.
- Animation, captions and sound design are unchanged apart from the new timing.

## v1 voice

- **Whose voice:** a clone of my voice, made locally with the open-source **Chatterbox** model,
  the same as made-by-claude v4. Nothing was sent to a voice service.
- **Reference:** 15 s cut from the v4 reel's audio (30.5–45.5 s). That audio is already my cloned voice
  with light sound effects underneath. The original recording in Drive (`References/voice-recording-bigishbalan.m4a`)
  could not be pulled into the session, so this is a clone of a clone. Re-making from the original recording should
  sound closer to me.
- **Checks:** every line was transcribed back with Whisper and compared word for word. Reel 5: 12/12 lines
  matched. Reel 6: 10/12 matched. The other two differ only on Malayalam words ("Choru venno" is heard as
  "Coruveno"; "Mallu" as "Malu"). An English voice model can only approximate Malayalam, so **record
  "Choru venno?" yourself** if you want it to sound right. Per-line results are in `pipeline/reel*_report.json`.
- **Pace:** the clone spoke at about 114 words a minute. Both tracks are sped up 1.3× (pitch kept) to about
  148 wpm, close to the 155 wpm in `voice.md`.

## Before posting

- Reel 5's numbers (twelve planned, nine cancelled, three done) and plan times are still **unconfirmed**. The
  on-screen spreadsheet names only the four stops in the script; the rest read "Stop 5" to "Stop 12".
- The ask lines already say the comment keywords out loud: "plan or go?" and "Malayalam or English?".
- Captions for each reel are in `Social Media/reel-edit-plans.md`.

## Re-make

```bash
cd animated-reels_source && npm install
# in pipeline/ next to a 15 s ref.wav of my voice:
python3 voice_gen.py reel5 && python3 tempo.py reel5 1.15 && python3 sfx_gen.py reel5   # reel6: 1.05
npx remotion render Reel5 out/mykonos-spreadsheet_animated_v2_9x16.mp4
```

`voice_gen.py` and `tempo.py` write the voice track to `public/` and the word timings to `src/reel*_timing.json`.
`sfx_gen.py` writes `public/reel*_sfx.wav`. The audio files are not in the repo.

**Remotion gotcha found while building this:** give CSS `scale` a string (`scale: String(x)`). React adds `px`
to a plain number, so the browser ignores every value except `0`, and an element whose first frame
is scale 0 stays invisible for the whole render.

## Captions for the animated versions

When posting, switch on Instagram's **AI info** label (Advanced settings), because the voice is AI-generated.

### Reel 5 animated (`mykonos-spreadsheet_animated_v2_9x16.mp4`)

> Parents, are you a planner or do you just go? Comment PLAN or GO 👇
>
> Twelve stops on the spreadsheet. 7am breakfast, 8am windmills, 10am Little Venice. I'm a UK Mallu dad, so yes, it was colour-coded 📋
>
> Then we did Mykonos with a toddler in October, and he took one look at the hotel bed, bounced on it, found the beach after that and refused to leave for the rest of the day 🏖️
>
> Three stops. Best family holiday we've had.
>
> This one is a little animation, and the voice is an AI copy of my own.
>
> Family holiday planning for the next one? Already started.
>
> #Mykonos #TravelWithKids #UKMallu

### Reel 6 animated (`kerala-rules_animated_v2_9x16.mp4`)

> UK Mallu parents, what does your kid answer in? Comment MALAYALAM or ENGLISH 👇
>
> One rule in our house: Malayalam at home.
>
> I ask "choru venno?" at dinner and get "no thanks, chips please". Then "please", "thank you" and "cheers" all evening, every word of it in English 🍟
>
> Raising bilingual kids in the UK means one Kerala dad versus the rest of Britain.
>
> Still asking in Malayalam. One day he'll be in Kerala, and I want him to understand every word 🌴
>
> This one is a little animation, and the voice is an AI copy of my own.
>
> #UKMallu #MalayaliParents #BilingualKids
