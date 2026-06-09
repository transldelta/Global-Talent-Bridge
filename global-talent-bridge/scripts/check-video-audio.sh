#!/usr/bin/env bash
# scripts/check-video-audio.sh
#
# CorridorWork — Video Audio Track Check
#
# Checks whether the promo video files contain an audio track.
# Uses ffprobe (read-only). Does NOT modify any files.
# Does NOT run ffmpeg. Does NOT upload or send anything.
#
# Usage: bash scripts/check-video-audio.sh
# Exit code: 0 always (informational only — does not break the build)

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VIDEO_DIR="${REPO_ROOT}/public/promo-video"

echo "CorridorWork — Video Audio Track Check"
echo "======================================="
echo ""

check_audio() {
  local filepath="$1"
  local label="$2"
  local filename
  filename="$(basename "$filepath")"

  if [ ! -f "$filepath" ]; then
    echo "  FILE_EXISTS=false"
    echo "  AUDIO_TRACK_PRESENT=false"
    echo "  File: ${filename} (not found)"
    echo ""
    return
  fi

  # Use ffprobe to list streams; grep for audio codec type
  # Suppress all other output with -v quiet
  if command -v ffprobe &>/dev/null; then
    local audio_streams
    audio_streams=$(ffprobe -v quiet -show_streams -select_streams a "$filepath" 2>/dev/null | grep -c "codec_type=audio" || true)
    if [ "$audio_streams" -gt 0 ]; then
      echo "  FILE_EXISTS=true"
      echo "  AUDIO_TRACK_PRESENT=true"
      echo "  File: ${filename}"
      echo "  Audio streams: ${audio_streams}"
    else
      echo "  FILE_EXISTS=true"
      echo "  AUDIO_TRACK_PRESENT=false"
      echo "  File: ${filename} — no audio track"
    fi
  else
    echo "  ffprobe not found — install ffmpeg to enable audio track check"
    echo "  FILE_EXISTS=true"
    echo "  AUDIO_TRACK_PRESENT=unknown"
  fi
  echo ""
}

echo "1. Primary human footage (visual preview — target: silent):"
check_audio "${VIDEO_DIR}/final/corridorwork-promo-human-en.mp4" "human-silent"

echo "2. Final with-audio target (this file enables the voiceover player):"
check_audio "${VIDEO_DIR}/final/corridorwork-promo-human-en-final.mp4" "human-final"

echo "3. Technical draft (TTS audio — NOT final, not for sale use):"
check_audio "${VIDEO_DIR}/corridorwork-promo-en.mp4" "tts-draft"

echo "======================================="
echo ""
echo "Summary:"
if [ -f "${VIDEO_DIR}/final/corridorwork-promo-human-en-final.mp4" ]; then
  final_audio=$(ffprobe -v quiet -show_streams -select_streams a \
    "${VIDEO_DIR}/final/corridorwork-promo-human-en-final.mp4" 2>/dev/null | \
    grep -c "codec_type=audio" || true)
  if [ "$final_audio" -gt 0 ]; then
    echo "  ✅ FINAL VERSION WITH AUDIO EXISTS — ready to review"
    echo "  Next step: verify on /promo-video, then remove noindex from metadata"
  else
    echo "  ⚠️  Final file exists but has no audio track — re-run scripts/mix-human-voiceover.sh"
  fi
else
  echo "  ⚠️  FINAL_AUDIO_PRESENT=false"
  echo "  /promo-video is visual preview only. noindex is active."
  echo "  Next step: record voiceover → run scripts/mix-human-voiceover.sh"
  echo "  See: docs/video/final-voiceover-required.md"
fi

echo ""
echo "No files were modified. This script is read-only."
exit 0
