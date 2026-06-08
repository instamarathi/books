# Mahabharat Reel System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a self-contained reel generation system for multi-character, multi-image scripted reels under `mahabharat/`.

**Architecture:** Python CLI handles validation, ElevenLabs audio generation, Whisper transcription, subtitle preparation, and Remotion staging/render orchestration. A local Remotion project renders image-backed vertical reels from staged audio and subtitle JSON.

**Tech Stack:** Python 3.11 via `uv run python`, pytest, httpx, python-dotenv, ffmpeg, OpenAI audio transcriptions with `whisper-1`, ElevenLabs TTS, Remotion 4, React, TypeScript.

---

### Task 1: Python Package And Script Schema

**Files:**
- Create: `mahabharat/pyproject.toml`
- Create: `mahabharat/scripts/reels/__init__.py`
- Create: `mahabharat/scripts/reels/schema.py`
- Create: `mahabharat/tests/test_reel_schema.py`

- [ ] Write failing tests for script loading, image limit, and missing image detection.
- [ ] Run `uv run python -m pytest tests/test_reel_schema.py` and confirm failure.
- [ ] Implement dataclasses and validation in `scripts/reels/schema.py`.
- [ ] Run the test file and confirm pass.

### Task 2: Subtitle Preparation

**Files:**
- Create: `mahabharat/scripts/reels/subtitles.py`
- Create: `mahabharat/tests/test_reel_subtitles.py`

- [ ] Write failing tests that assign Whisper words to timeline lines by timestamp midpoint.
- [ ] Write failing tests for SRT output.
- [ ] Run `uv run python -m pytest tests/test_reel_subtitles.py` and confirm failure.
- [ ] Implement Remotion subtitle conversion and SRT formatting.
- [ ] Run the test file and confirm pass.

### Task 3: CLI And External API Commands

**Files:**
- Create: `mahabharat/scripts/reels/reel_system.py`
- Create: `mahabharat/tests/test_reel_cli.py`

- [ ] Write failing tests for `validate` and `prepare-remotion` command behavior using local fixtures.
- [ ] Run `uv run python -m pytest tests/test_reel_cli.py` and confirm failure.
- [ ] Implement CLI parsing, validation command, audio generation command, transcription command, prepare command, render command, and build command.
- [ ] Keep API commands idle unless explicitly invoked.
- [ ] Run CLI tests and confirm pass.

### Task 4: Remotion Project

**Files:**
- Create: `mahabharat/remotion-reels/package.json`
- Create: `mahabharat/remotion-reels/tsconfig.json`
- Create: `mahabharat/remotion-reels/remotion.config.ts`
- Create: `mahabharat/remotion-reels/src/index.ts`
- Create: `mahabharat/remotion-reels/src/Root.tsx`
- Create: `mahabharat/remotion-reels/src/Reel.tsx`
- Create: `mahabharat/remotion-reels/src/types.ts`

- [ ] Implement a Remotion composition that reads staged audio, images, and subtitle JSON.
- [ ] Add TypeScript typecheck script.
- [ ] Run `npm --prefix remotion-reels install` if dependencies are absent.
- [ ] Run `npm --prefix remotion-reels run typecheck`.

### Task 5: Karn-Kunti Metadata Skeleton

**Files:**
- Create: `mahabharat/reels/karn-kunti/series.json`
- Create: `mahabharat/reels/karn-kunti/voices.json`
- Create directories only under `mahabharat/reels/karn-kunti/episodes/.gitkeep` if needed.

- [ ] Add series metadata and voice metadata.
- [ ] Do not create final episode scripts or render reels.
- [ ] Run all Python and Remotion checks.
