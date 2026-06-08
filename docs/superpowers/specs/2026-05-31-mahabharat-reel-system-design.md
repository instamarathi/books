# Mahabharat Reel System Design

## Goal

Build a self-contained reel generation system in this repository for scripted, multi-character, image-backed mythological reels.

The system must not generate Karn-Kunti reels during implementation. It should provide commands that can later generate audio, transcribe timings, prepare subtitle data, and render reels when explicitly run.

## Scope

The first target series is `mahabharat/reels/karn-kunti`, but the tooling should work for any series folder with the same structure.

The sibling `../../elevenlabs` project may be used as a reference, but this repository must contain its own Python scripts, Remotion project, schemas, and tests.

## Episode Layout

Each episode uses this shape:

```text
mahabharat/reels/<series>/
  series.json
  voices.json
  episodes/
    ep-01-example/
      script.json
      images/
        01-opening.png
        02-reaction.png
      audio/
        parts/
        mixed.mp3
        timeline.json
      transcripts/
        whisper.json
      subtitles/
        remotion.json
        captions.srt
      output/
        reel.mp4
```

`script.json` is the source of truth for spoken text, speaker, and image selection:

```json
{
  "episode": 1,
  "title": "पहला प्रश्न",
  "slug": "pehla-prashn",
  "lines": [
    {
      "id": "l001",
      "speaker": "narrator",
      "image": "01-room.png",
      "text": "मृत्यु और अगले जन्म के बीच, कर्ण ने आंखें खोलीं।"
    }
  ]
}
```

An episode may use up to five images. Images live in `images/`, and every script line names the image active during that line.

## Voice Metadata

`voices.json` maps speaker IDs to ElevenLabs voice IDs and settings. For Karn-Kunti the recommended starting voices are:

- `narrator`: `bTQ95wUqqzrQbvYGBBR5` — Viraj, mythological/historical Hindi storyteller
- `kunti`: `FDQcYNtvPtQjNlTyU3du` — Sumi, soft emotional Hindi female voice
- `karn`: `1PHmt5lVKyg7LZUAnPcc` — Krishna, immersive suspenseful Hindi male voice

## Pipeline

1. Validate `script.json`, `voices.json`, and referenced image files.
2. Generate one ElevenLabs audio part per script line.
3. Stitch audio parts into `audio/mixed.mp3` with a configurable gap.
4. Write `audio/timeline.json` with line IDs, speakers, images, and start/end times.
5. Run OpenAI `whisper-1` transcription on `mixed.mp3` using `response_format="verbose_json"` and `timestamp_granularities=["word"]`.
6. Assign Whisper words to script lines by word midpoint against `timeline.json`.
7. Write Remotion data to `subtitles/remotion.json`.
8. Write an optional `captions.srt`.
9. Stage assets into the local Remotion project and render `output/reel.mp4`.

Whisper word timings are the subtitle source of truth. ElevenLabs timestamps can be added later as a fallback, but are not required for the first implementation.

## Commands

Commands are exposed through one Python CLI:

```bash
uv run python scripts/reels/reel_system.py validate mahabharat/reels/karn-kunti/episodes/ep-01-pehla-prashn
uv run python scripts/reels/reel_system.py generate-audio mahabharat/reels/karn-kunti/episodes/ep-01-pehla-prashn
uv run python scripts/reels/reel_system.py transcribe mahabharat/reels/karn-kunti/episodes/ep-01-pehla-prashn
uv run python scripts/reels/reel_system.py prepare-remotion mahabharat/reels/karn-kunti/episodes/ep-01-pehla-prashn
uv run python scripts/reels/reel_system.py render mahabharat/reels/karn-kunti/episodes/ep-01-pehla-prashn
uv run python scripts/reels/reel_system.py build mahabharat/reels/karn-kunti/episodes/ep-01-pehla-prashn
```

`build` runs the full pipeline. Implementation and tests must not call `build`.

## Remotion

Create `mahabharat/remotion-reels/` with a self-contained Remotion app. It renders:

- 1080x1920 vertical video
- active image as full-frame background
- subtle image crossfade when the active script image changes
- bottom subtitle band with word-level highlighting
- mixed audio as the only required audio track

The renderer reads staged files from `remotion-reels/public/current/`:

```text
audio.mp3
subtitles.json
images/<episode images>
```

## Environment

The system reads secrets from environment variables:

- `ELEVEN_LABS_API_KEY` for ElevenLabs
- `OPENAI_API_KEY` for Whisper transcription

For local convenience it may load `.env` files, but no secrets are committed.

## Verification

Tests cover:

- valid and invalid script loading
- max-five-image enforcement
- missing image detection
- converting timeline plus Whisper words into Remotion subtitle JSON
- SRT formatting
- Remotion staging copies expected files without rendering

Manual verification after implementation:

```bash
uv run python -m pytest mahabharat/tests
npm --prefix mahabharat/remotion-reels run typecheck
```
