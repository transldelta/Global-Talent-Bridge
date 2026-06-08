#!/bin/bash
# ============================================================
# scripts/mix-human-voiceover.sh
# CorridorWork — Voiceover Mix Script
#
# Mixes a real human voiceover with the human footage video.
# Accepts: .webm  .ogg  .m4a  .mp3  .wav
# Output:  public/promo-video/final/corridorwork-promo-human-en-final.mp4
#
# Usage:
#   bash scripts/mix-human-voiceover.sh <audio-file>
#   bash scripts/mix-human-voiceover.sh <audio-file> <output-video>
#
# Requirements: ffmpeg (brew install ffmpeg)
#
# Safety: no robot voice · no TTS · no macOS say · no Stripe ·
#         no email sending · no scraping · no job guarantee ·
#         no visa guarantee
# ============================================================

set -e

INPUT_AUDIO="${1}"
VIDEO_SOURCE="public/promo-video/final/corridorwork-promo-human-en.mp4"
OUTPUT_VIDEO="${2:-public/promo-video/final/corridorwork-promo-human-en-final.mp4}"
AUDIO_DIR="public/promo-video/source-clips/audio"
WAV_NORMALIZED="${AUDIO_DIR}/corridorwork-vo-en-human-normalized.wav"

# ── Colour helpers ────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
info()    { echo -e "${BLUE}[INFO]${NC}  $1"; }
success() { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ── Checks ────────────────────────────────────────────────────────────────────
echo ""
echo "======================================================"
echo "  CorridorWork — Human Voiceover Mix Script"
echo "======================================================"
echo ""

# ffmpeg required
if ! command -v ffmpeg &>/dev/null; then
  error "ffmpeg not found. Install with: brew install ffmpeg"
fi

# Input file required
if [ -z "$INPUT_AUDIO" ]; then
  echo "Usage: bash scripts/mix-human-voiceover.sh <audio-file> [output-video]"
  echo ""
  echo "Accepted formats: .webm  .ogg  .m4a  .mp3  .wav"
  echo "Example:"
  echo "  bash scripts/mix-human-voiceover.sh ~/Downloads/corridorwork-vo-en-human.webm"
  echo ""
  exit 1
fi

# Input file exists
if [ ! -f "$INPUT_AUDIO" ]; then
  error "Audio file not found: $INPUT_AUDIO"
fi

# Source video exists
if [ ! -f "$VIDEO_SOURCE" ]; then
  error "Source video not found: $VIDEO_SOURCE\nRun the human footage build script first."
fi

# Check audio extension
EXT="${INPUT_AUDIO##*.}"
EXT_LOWER=$(echo "$EXT" | tr '[:upper:]' '[:lower:]')
case "$EXT_LOWER" in
  webm|ogg|m4a|mp3|mp4|wav|aac) ;;
  *) error "Unsupported audio format: .$EXT_LOWER\nAccepted: .webm .ogg .m4a .mp3 .wav" ;;
esac

# ── Probe input ───────────────────────────────────────────────────────────────
info "Probing audio file: $INPUT_AUDIO"

AUDIO_DURATION=$(ffprobe -v quiet \
  -show_entries format=duration \
  -of csv=p=0 "$INPUT_AUDIO" 2>/dev/null || echo "?")

AUDIO_CHANNELS=$(ffprobe -v quiet \
  -select_streams a:0 \
  -show_entries stream=channels \
  -of csv=p=0 "$INPUT_AUDIO" 2>/dev/null || echo "?")

info "Duration: ${AUDIO_DURATION}s · Channels: ${AUDIO_CHANNELS}"

# Duration sanity check (skip if unknown)
if [ "$AUDIO_DURATION" != "?" ]; then
  DUR_INT=$(echo "$AUDIO_DURATION" | cut -d. -f1)
  if [ "$DUR_INT" -lt 20 ]; then
    warn "Recording is only ${DUR_INT}s — target is 55–60 seconds. Continue anyway? (Ctrl+C to abort)"
    sleep 3
  fi
  if [ "$DUR_INT" -gt 120 ]; then
    warn "Recording is ${DUR_INT}s — that seems long. Expected ~55–60s."
  fi
fi

VIDEO_DURATION=$(ffprobe -v quiet \
  -show_entries format=duration \
  -of csv=p=0 "$VIDEO_SOURCE" 2>/dev/null || echo "?")

info "Video duration: ${VIDEO_DURATION}s"

# ── Create audio dir ──────────────────────────────────────────────────────────
mkdir -p "$AUDIO_DIR"

# Copy input with original name for reference
ORIGINAL_COPY="${AUDIO_DIR}/corridorwork-vo-en-human.${EXT_LOWER}"
cp "$INPUT_AUDIO" "$ORIGINAL_COPY"
success "Input copied to: $ORIGINAL_COPY"

# ── Step 1: Convert + Normalize audio ────────────────────────────────────────
echo ""
info "Step 1: Normalizing audio (EBU R128 loudnorm)…"

ffmpeg -y -loglevel warning \
  -i "$INPUT_AUDIO" \
  -ar 48000 \
  -ac 2 \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=summary" \
  "$WAV_NORMALIZED"

if [ ! -f "$WAV_NORMALIZED" ]; then
  error "Audio normalization failed — WAV not created."
fi

NORM_SIZE=$(du -h "$WAV_NORMALIZED" | cut -f1)
success "Normalized WAV: $WAV_NORMALIZED ($NORM_SIZE)"

# ── Step 2: Verify normalized audio has content ───────────────────────────────
NORM_DURATION=$(ffprobe -v quiet \
  -show_entries format=duration \
  -of csv=p=0 "$WAV_NORMALIZED" 2>/dev/null || echo "?")
info "Normalized audio duration: ${NORM_DURATION}s"

# ── Step 3: Mix voiceover with video ─────────────────────────────────────────
echo ""
info "Step 2: Mixing voiceover with human footage video…"
info "  Video: $VIDEO_SOURCE"
info "  Audio: $WAV_NORMALIZED"
info "  Output: $OUTPUT_VIDEO"
echo ""

ffmpeg -y -loglevel warning \
  -i "$VIDEO_SOURCE" \
  -i "$WAV_NORMALIZED" \
  -map 0:v:0 \
  -map 1:a:0 \
  -c:v copy \
  -c:a aac -b:a 192k \
  -shortest \
  "$OUTPUT_VIDEO"

if [ ! -f "$OUTPUT_VIDEO" ]; then
  error "Mix failed — output file not created."
fi

# ── Step 4: Verify output ──────────────────────────────────────────────────────
echo ""
info "Verifying output…"

OUT_DURATION=$(ffprobe -v quiet \
  -show_entries format=duration \
  -of csv=p=0 "$OUTPUT_VIDEO" 2>/dev/null || echo "?")

HAS_AUDIO=$(ffprobe -v quiet \
  -select_streams a \
  -show_entries stream=codec_name \
  -of csv=p=0 "$OUTPUT_VIDEO" 2>/dev/null)

HAS_VIDEO=$(ffprobe -v quiet \
  -select_streams v \
  -show_entries stream=codec_name \
  -of csv=p=0 "$OUTPUT_VIDEO" 2>/dev/null)

OUT_SIZE=$(du -h "$OUTPUT_VIDEO" | cut -f1)

echo ""
echo "======================================================"
success "DONE — Final video with human voiceover:"
echo ""
echo "  File:     $OUTPUT_VIDEO"
echo "  Size:     $OUT_SIZE"
echo "  Duration: ${OUT_DURATION}s"
echo "  Video:    ${HAS_VIDEO:-MISSING!}"
echo "  Audio:    ${HAS_AUDIO:-MISSING!}"
echo "======================================================"

if [ -z "$HAS_AUDIO" ]; then
  error "Output has NO audio track! Something went wrong with the mix."
fi

echo ""
echo "Next steps:"
echo "  1. git add public/promo-video/final/corridorwork-promo-human-en-final.mp4"
echo "  2. git commit -m 'feat: Add human voiceover to promo video'"
echo "  3. git push"
echo "  → /promo-video will automatically show 'Human voiceover version'"
echo ""
