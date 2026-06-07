#!/usr/bin/env bash
# =============================================================================
# scripts/build-human-promo-video.sh
# CorridorWork — Human Footage Promo Video Build Pipeline
#
# Usage:
#   bash scripts/build-human-promo-video.sh
#
# Requirements:
#   - ffmpeg (brew install ffmpeg)
#   - Licensed clips in public/promo-video/source-clips/
#     See docs/video/HUMAN_FOOTAGE_ASSET_LIST.md
#
# Output:
#   public/promo-video/final/corridorwork-promo-human-en.mp4
#
# Safety:
#   No job guarantee · No visa guarantee · No fake revenue · No Stripe ·
#   No email sending · No scraping · No unlicensed media
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

CLIPS_DIR="${ROOT_DIR}/public/promo-video/source-clips"
OUTPUT_DIR="${ROOT_DIR}/public/promo-video/final"
WORK_DIR="${ROOT_DIR}/public/promo-video/_build_tmp"

OUTPUT_FILE="${OUTPUT_DIR}/corridorwork-promo-human-en.mp4"
CONCAT_LIST="${WORK_DIR}/concat_list.txt"

# Video settings
WIDTH=1280
HEIGHT=720
FPS=25
FONT_COLOR="white"
BOX_COLOR="black@0.5"

# Brand
BRAND="CorridorWork"
DOMAIN="corridorwork.com"

# =============================================================================
# Helpers
# =============================================================================

log()  { echo "▶ $*"; }
ok()   { echo "✅ $*"; }
warn() { echo "⚠️  $*"; }
fail() { echo "❌ $*"; exit 1; }

check_ffmpeg() {
  command -v ffmpeg >/dev/null 2>&1 || fail "ffmpeg not found. Install with: brew install ffmpeg"
  log "ffmpeg found: $(ffmpeg -version 2>&1 | head -1)"
}

clip_exists() {
  local f="${CLIPS_DIR}/$1"
  [[ -f "$f" ]]
}

# =============================================================================
# Scene definitions
# Each scene: clip_file | duration_sec | text_line1 | text_line2 | text_line3
# =============================================================================

declare -a SCENES=(
  "01-empty-office.mp4|8|MILLIONS OF JOBS.||MILLIONS OF SKILLED WORKERS."
  "02-hr-team.mp4|8|STILL DISCONNECTED.||"
  "03-candidates-global.mp4|9|Talent is global.|Opportunity should be connected.|"
  "09-world-map-globe.mp4|8|Introducing CorridorWork.|A global talent corridor platform.|${DOMAIN}"
  "04-healthcare-worker.mp4|3|Healthcare.||"
  "05-it-developer.mp4|3|Technology.||"
  "06-construction-worker.mp4|3|Engineering & Construction.||"
  "12-logistics-worker.mp4|3|Logistics. Hospitality.||"
  "07-candidate-laptop.mp4|5|For candidates.|Ready to move and contribute.|"
  "08-employer-interview.mp4|5|For employers.|Looking to hire internationally.|"
  "10-diverse-team.mp4|8|For partners.|Building global mobility programmes.|"
  "14-corridorwork-logo.mp4|6|${BRAND}|${DOMAIN}|Connecting global talent with opportunity."
)

# Fallback: if a clip is missing, generate a dark title slide instead
make_title_slide() {
  local out="$1"
  local dur="$2"
  local text1="$3"
  local text2="${4:-}"
  local text3="${5:-}"

  local filter="color=c=#0d1117:size=${WIDTH}x${HEIGHT}:duration=${dur},fps=${FPS}"
  local vf="drawtext=text='${text1}':fontcolor=${FONT_COLOR}:fontsize=42:x=(w-text_w)/2:y=(h-text_h)/2-40:box=1:boxcolor=${BOX_COLOR}:boxborderw=10"

  if [[ -n "$text2" ]]; then
    vf="${vf},drawtext=text='${text2}':fontcolor=${FONT_COLOR}:fontsize=32:x=(w-text_w)/2:y=(h-text_h)/2+10:box=1:boxcolor=${BOX_COLOR}:boxborderw=8"
  fi
  if [[ -n "$text3" ]]; then
    vf="${vf},drawtext=text='${text3}':fontcolor=#818cf8:fontsize=26:x=(w-text_w)/2:y=(h-text_h)/2+60:box=1:boxcolor=${BOX_COLOR}:boxborderw=8"
  fi

  # Add fade in/out
  vf="${vf},fade=t=in:st=0:d=0.4,fade=t=out:st=$((dur-1)):d=0.6"

  ffmpeg -y -hide_banner -loglevel error \
    -f lavfi -i "${filter}" \
    -vf "${vf}" \
    -c:v libx264 -preset fast -crf 22 \
    -t "${dur}" \
    "${out}"
}

process_clip() {
  local clip_file="$1"
  local dur="$2"
  local text1="$3"
  local text2="${4:-}"
  local text3="${5:-}"
  local out="$6"

  local src="${CLIPS_DIR}/${clip_file}"

  if [[ ! -f "$src" ]]; then
    warn "Clip missing: ${clip_file} — generating title slide fallback"
    make_title_slide "${out}" "${dur}" "${text1}" "${text2}" "${text3}"
    return
  fi

  log "Processing: ${clip_file}"

  local vf="scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2:black"
  vf="${vf},fps=${FPS}"

  # Text overlay
  if [[ -n "$text1" ]]; then
    # Escape special chars for ffmpeg
    local t1="${text1//:/\\:}"
    vf="${vf},drawtext=text='${t1}':fontcolor=${FONT_COLOR}:fontsize=38:x=(w-text_w)/2:y=h-140:box=1:boxcolor=${BOX_COLOR}:boxborderw=10"
  fi
  if [[ -n "$text2" ]]; then
    local t2="${text2//:/\\:}"
    vf="${vf},drawtext=text='${t2}':fontcolor=${FONT_COLOR}:fontsize=28:x=(w-text_w)/2:y=h-95:box=1:boxcolor=${BOX_COLOR}:boxborderw=8"
  fi
  if [[ -n "$text3" ]]; then
    local t3="${text3//:/\\:}"
    vf="${vf},drawtext=text='${t3}':fontcolor=#a5b4fc:fontsize=22:x=(w-text_w)/2:y=h-58:box=1:boxcolor=${BOX_COLOR}:boxborderw=6"
  fi

  # Fade in + out
  vf="${vf},fade=t=in:st=0:d=0.4,fade=t=out:st=$((dur-1)):d=0.6"

  ffmpeg -y -hide_banner -loglevel error \
    -i "${src}" \
    -t "${dur}" \
    -vf "${vf}" \
    -an \
    -c:v libx264 -preset fast -crf 22 \
    "${out}"
}

# =============================================================================
# Main
# =============================================================================

main() {
  log "CorridorWork — Human Footage Promo Video Build"
  log "Root: ${ROOT_DIR}"
  log ""

  check_ffmpeg

  # Check clips dir exists
  [[ -d "$CLIPS_DIR" ]] || fail "Source clips dir not found: ${CLIPS_DIR}"

  # Count available clips
  CLIP_COUNT=$(find "${CLIPS_DIR}" -name "*.mp4" -o -name "*.mov" -o -name "*.webm" 2>/dev/null | wc -l | tr -d ' ')
  log "Found ${CLIP_COUNT} clip(s) in source-clips/"

  if [[ "$CLIP_COUNT" -eq 0 ]]; then
    warn ""
    warn "NO CLIPS FOUND."
    warn "Pipeline is ready but needs licensed human footage clips."
    warn ""
    warn "Required clips: See docs/video/HUMAN_FOOTAGE_ASSET_LIST.md"
    warn "Free sources:   Pexels · Mixkit · Coverr · Pixabay"
    warn ""
    warn "Continuing with title-slide fallbacks for all scenes..."
    warn "(Output will be a slide video — not the human footage version)"
    warn ""
  fi

  # Create work/output dirs
  mkdir -p "${WORK_DIR}" "${OUTPUT_DIR}"

  # Build scene clips
  log "Building ${#SCENES[@]} scenes..."
  > "${CONCAT_LIST}"

  SCENE_IDX=0
  for scene_def in "${SCENES[@]}"; do
    IFS='|' read -r clip_file dur text1 text2 text3 <<< "${scene_def}"
    SCENE_IDX=$((SCENE_IDX + 1))
    SCENE_OUT="${WORK_DIR}/scene_$(printf '%02d' $SCENE_IDX).mp4"

    process_clip "${clip_file}" "${dur}" "${text1}" "${text2}" "${text3}" "${SCENE_OUT}"
    echo "file '${SCENE_OUT}'" >> "${CONCAT_LIST}"
  done

  ok "All scenes processed"

  # Concatenate scenes
  log "Concatenating scenes into final video..."
  ffmpeg -y -hide_banner -loglevel error \
    -f concat -safe 0 -i "${CONCAT_LIST}" \
    -c:v libx264 -preset fast -crf 20 -movflags +faststart \
    "${OUTPUT_FILE}"

  ok "Final video: ${OUTPUT_FILE}"
  log "Duration: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "${OUTPUT_FILE}" 2>/dev/null | xargs printf '%.1f' 2>/dev/null || echo 'unknown')s"
  log "Size:      $(du -sh "${OUTPUT_FILE}" | cut -f1)"

  # Check voiceover audio
  AUDIO_DIR="${CLIPS_DIR}/audio"
  VO_FILE="${AUDIO_DIR}/corridorwork-vo-en-master.wav"
  if [[ -f "$VO_FILE" ]]; then
    log ""
    log "Voiceover found: ${VO_FILE}"
    log "Merging audio into final video..."
    FINAL_WITH_VO="${OUTPUT_DIR}/corridorwork-promo-human-en-vo.mp4"
    ffmpeg -y -hide_banner -loglevel error \
      -i "${OUTPUT_FILE}" \
      -i "${VO_FILE}" \
      -c:v copy -c:a aac -shortest \
      "${FINAL_WITH_VO}"
    ok "Final with voiceover: ${FINAL_WITH_VO}"
  else
    warn ""
    warn "No voiceover file found at: ${VO_FILE}"
    warn "Record voiceover per docs/video/HUMAN_FOOTAGE_VOICEOVER_SCRIPT.md"
    warn "Then re-run this script to merge audio."
  fi

  # Clean up work dir
  rm -rf "${WORK_DIR}"
  ok "Build complete."
  echo ""
  echo "Output: ${OUTPUT_FILE}"
  echo "Next:   Upload to public/promo-video/final/ and commit"
  echo "Page:   https://corridorwork.com/promo-video"
}

main "$@"
