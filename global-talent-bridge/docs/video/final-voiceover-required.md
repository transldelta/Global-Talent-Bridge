# Final Voiceover Required — CorridorWork Promo Video

*Video Pipeline · Internal use only*

---

## Current Status

**AUDIO_TRACK_PRESENT: false**

The primary promo video (`public/promo-video/final/corridorwork-promo-human-en.mp4`) is a
**visual preview only**. It contains human footage (Pexels Free License) but has no audio track.

The `/promo-video` page is set to `noindex, nofollow` until a final version with a real
human voiceover is produced and committed.

---

## What Is Missing

| Asset | Status |
|---|---|
| `public/promo-video/final/corridorwork-promo-human-en.mp4` | ✅ Exists — visual only, no audio |
| `public/promo-video/final/corridorwork-promo-human-en-final.mp4` | ❌ Missing — this is the final with-audio target |
| Human voiceover recording | ❌ Not recorded yet |

---

## What Is Ready

| Asset | Status |
|---|---|
| Voiceover script (English) | ✅ `docs/video/HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md` |
| Recording guide | ✅ Visible on `/promo-video` page |
| Human footage clips (10 × Pexels) | ✅ `public/promo-video/source-clips/` |
| mux-and-build script | ✅ `scripts/mix-human-voiceover.sh` |
| Subtitle files (10 languages) | ✅ `public/promo-video/subtitles/human/` |

---

## How to Produce the Final Version

### Step 1 — Record the voiceover

Use the script in `docs/video/HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md`.

**Requirements:**
- Real human voice only — no TTS, no macOS `say`, no robot voice
- Format: **WAV 48 kHz** (preferred) or MP3 320 kbps
- Duration: ~55 seconds
- Tone: calm, professional
- Language: English

**Drop the file at:**
```
public/promo-video/source-clips/audio/corridorwork-vo-en-human.wav
```

### Step 2 — Mix audio with video

```bash
bash scripts/mix-human-voiceover.sh public/promo-video/source-clips/audio/corridorwork-vo-en-human.wav
```

This script uses `ffmpeg` to mux the voiceover with the silent human footage video
and produces:

```
public/promo-video/final/corridorwork-promo-human-en-final.mp4
```

### Step 3 — Verify audio track present

```bash
bash scripts/check-video-audio.sh
```

Expected output once done:
```
AUDIO_TRACK_PRESENT=true
File: public/promo-video/final/corridorwork-promo-human-en-final.mp4
```

### Step 4 — Commit and deploy

```bash
git add public/promo-video/final/corridorwork-promo-human-en-final.mp4
git commit -m "feat: add final human voiceover to promo video"
git push origin feature/global-talent-bridge-mvp-phase-1
```

Once pushed, Vercel auto-deploys. The `/promo-video` page will automatically:
- Show the final with-audio version as the primary player
- Remove the visual-preview warning banner
- Remove the `noindex` is **not** removed automatically — update metadata manually after verifying

### Step 5 — Remove noindex (manual, after verification)

After confirming audio is correct on the live site:
- Edit `app/promo-video/page.tsx`
- Remove `robots: 'noindex, nofollow'` from the metadata export
- Commit as `chore: remove noindex from promo-video after final voiceover`

---

## Rules — Always Apply

- **No robot voice** — no TTS, no macOS `say`, no ElevenLabs or similar without explicit approval
- **No fake voiceover** — do not claim a robot voice is a human voice
- **No job guarantee** — voiceover script must not promise employment, visa, or placement
- **No visa guarantee** — same
- **No fake revenue claims** — same
- **Escrow** — this video asset transfers with the sale; audio rights must be clear
- **Pexels Free License** — all footage is licensed under pexels.com/license; no YouTube clips

---

## Audio Check Script

Run at any time to check audio track status:

```bash
bash scripts/check-video-audio.sh
```

This script checks:
1. `final/corridorwork-promo-human-en.mp4` — primary silent preview
2. `final/corridorwork-promo-human-en-final.mp4` — final with-audio target
3. `corridorwork-promo-en.mp4` — technical draft (TTS audio, NOT final)

It does not run `ffmpeg`. It uses `ffprobe` only (read-only). It does not modify any files.

---

*Part of the CorridorWork video pipeline. See also:*
*[`HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md`](./HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md) · [`HUMAN_FOOTAGE_ASSET_LIST.md`](./HUMAN_FOOTAGE_ASSET_LIST.md)*
