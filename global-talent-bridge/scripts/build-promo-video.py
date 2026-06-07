#!/usr/bin/env python3
"""
CorridorWork Promo Video Builder
Generates: corridorwork-promo-en.mp4 (with audio)
           corridorwork-promo-en-noaudio.mp4 (video only fallback)
Tools: Pillow + OpenCV + macOS say + ffmpeg
"""

import cv2
import numpy as np
import subprocess
import os
import sys
from PIL import Image, ImageDraw, ImageFont
import tempfile
import shutil

# ── Config ────────────────────────────────────────────────────────────────────

OUT_DIR   = "/Users/brahimbenabla/Global-Talent-Bridge/global-talent-bridge/public/promo-video"
W, H      = 1280, 720
FPS       = 25
FONT_DIR  = "/System/Library/Fonts"

# ── Color palette (dark SaaS / CorridorWork) ─────────────────────────────────

BG_DARK     = (15,  23,  42)   # slate-950
BG_INDIGO   = (30,  27,  75)   # indigo-950
BG_VIOLET   = (46,  16,  101)  # violet-950
BG_BLUE     = (23,  37,  84)   # blue-950
BG_SLATE    = (2,   6,   23)   # near-black
ACCENT      = (99,  102, 241)  # indigo-500
ACCENT2     = (139, 92,  246)  # violet-500
WHITE       = (255, 255, 255)
LIGHT_GRAY  = (148, 163, 184)  # slate-400
AMBER       = (251, 191, 36)   # amber-400
GREEN       = (74,  222, 128)  # green-400
CYAN        = (34,  211, 238)  # cyan-400

# ── Scenes ────────────────────────────────────────────────────────────────────

SCENES = [
    {
        "id":       "hook",
        "title":    "SCENE 1 — THE HOOK",
        "duration": 8,  # seconds
        "bg":       BG_SLATE,
        "accent":   ACCENT,
        "lines": [
            ("MILLIONS OF JOBS.", WHITE, 64),
            ("MILLIONS OF SKILLED WORKERS.", LIGHT_GRAY, 48),
            ("STILL DISCONNECTED.", ACCENT, 52),
        ],
        "tag":      "0:00 – 0:08",
        "voice":    "Millions of jobs. Millions of skilled workers. Still disconnected. Every day, companies struggle to find talent while skilled professionals struggle to find opportunity.",
    },
    {
        "id":       "introduce",
        "title":    "SCENE 2 — INTRODUCING CORRIDORWORK",
        "duration": 8,
        "bg":       BG_INDIGO,
        "accent":   ACCENT2,
        "lines": [
            ("INTRODUCING", LIGHT_GRAY, 36),
            ("CorridorWork", WHITE, 80),
            ("corridorwork.com", ACCENT, 32),
        ],
        "tag":      "0:08 – 0:16",
        "voice":    "Introducing CorridorWork. We help connect employers with qualified international talent through structured, compliance-first global migration corridors.",
    },
    {
        "id":       "solution",
        "title":    "SCENE 3 — THE SOLUTION",
        "duration": 9,
        "bg":       BG_BLUE,
        "accent":   CYAN,
        "lines": [
            ("SMARTER MATCHING.", WHITE, 58),
            ("GLOBAL REACH.", CYAN, 58),
            ("BETTER OPPORTUNITIES.", LIGHT_GRAY, 48),
        ],
        "tag":      "0:16 – 0:25",
        "voice":    "Smarter matching. Global reach. Better opportunities. Our platform identifies workforce demand, analyzes talent corridors, and connects the right candidates with the right employers — transparently and without shortcuts.",
    },
    {
        "id":       "features",
        "title":    "SCENE 4 — THE FEATURES",
        "duration": 9,
        "bg":       BG_DARK,
        "accent":   GREEN,
        "lines": [
            ("21 SECTORS", GREEN, 52),
            ("15+ GLOBAL CORRIDORS", WHITE, 48),
            ("COMPLIANCE-FIRST ARCHITECTURE", LIGHT_GRAY, 36),
            ("INBOUND-DRIVEN PLATFORM", ACCENT, 36),
        ],
        "tag":      "0:25 – 0:34",
        "voice":    "Twenty-one sectors. Fifteen-plus global talent corridors. A compliance-first architecture built for employers, candidates, agencies, and investors — with zero false promises.",
    },
    {
        "id":       "forwhom",
        "title":    "SCENE 5 — FOR WHOM",
        "duration": 8,
        "bg":       BG_VIOLET,
        "accent":   AMBER,
        "lines": [
            ("FOR EMPLOYERS.", WHITE, 52),
            ("FOR TALENT.", AMBER, 52),
            ("FOR GROWTH.", LIGHT_GRAY, 52),
        ],
        "tag":      "0:34 – 0:42",
        "voice":    "For employers seeking structured international talent. For professionals exploring global career corridors. For agencies ready to scale. For investors in proven SaaS infrastructure.",
    },
    {
        "id":       "cta",
        "title":    "SCENE 6 — CALL TO ACTION",
        "duration": 10,
        "bg":       BG_INDIGO,
        "accent":   ACCENT,
        "lines": [
            ("CorridorWork", WHITE, 80),
            ("The structured path to global talent.", LIGHT_GRAY, 36),
            ("corridorwork.com", ACCENT, 44),
            ("Express interest — no commitment", LIGHT_GRAY, 28),
        ],
        "tag":      "0:42 – 0:52",
        "voice":    "Explore CorridorWork today. The structured path to global talent. Visit corridorwork dot com and express your interest — no commitment required.",
    },
]

# ── Font loading ──────────────────────────────────────────────────────────────

def get_font(size, bold=False):
    """Load system font, fallback to default."""
    candidates = []
    if bold:
        candidates = [
            "/System/Library/Fonts/Helvetica.ttc",
            "/System/Library/Fonts/HelveticaNeue.ttc",
            "/System/Library/Fonts/SF-Pro-Display-Bold.otf",
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        ]
    else:
        candidates = [
            "/System/Library/Fonts/Helvetica.ttc",
            "/System/Library/Fonts/HelveticaNeue.ttc",
            "/System/Library/Fonts/SF-Pro-Display-Regular.otf",
            "/System/Library/Fonts/Supplemental/Arial.ttf",
        ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    # Absolute fallback
    try:
        return ImageFont.load_default()
    except Exception:
        return ImageFont.load_default()

# ── Frame generation ──────────────────────────────────────────────────────────

def rgb_to_bgr(color):
    return (color[2], color[1], color[0])

def make_gradient_frame(bg_top, bg_bottom, width=W, height=H):
    """Create a vertical gradient background as numpy array (BGR)."""
    img = np.zeros((height, width, 3), dtype=np.uint8)
    for y in range(height):
        t = y / height
        r = int(bg_top[0] * (1 - t) + bg_bottom[0] * t)
        g = int(bg_top[1] * (1 - t) + bg_bottom[1] * t)
        b = int(bg_top[2] * (1 - t) + bg_bottom[2] * t)
        img[y, :] = [b, g, r]  # BGR
    return img

def draw_dot_grid(img, color=(255,255,255), alpha=0.03):
    """Subtle dot grid overlay."""
    overlay = img.copy()
    step = 40
    for y in range(0, H, step):
        for x in range(0, W, step):
            cv2.circle(overlay, (x, y), 1, rgb_to_bgr(color), -1)
    return cv2.addWeighted(img, 1 - alpha, overlay, alpha, 0)

def draw_corner_accent(img, color, size=120, thickness=3):
    """Draw corner bracket decorations."""
    c = rgb_to_bgr(color)
    # Top-left
    cv2.line(img, (40, 40), (40 + size, 40), c, thickness)
    cv2.line(img, (40, 40), (40, 40 + size), c, thickness)
    # Top-right
    cv2.line(img, (W - 40, 40), (W - 40 - size, 40), c, thickness)
    cv2.line(img, (W - 40, 40), (W - 40, 40 + size), c, thickness)
    # Bottom-left
    cv2.line(img, (40, H - 40), (40 + size, H - 40), c, thickness)
    cv2.line(img, (40, H - 40), (40, H - 40 - size), c, thickness)
    # Bottom-right
    cv2.line(img, (W - 40, H - 40), (W - 40 - size, H - 40), c, thickness)
    cv2.line(img, (W - 40, H - 40), (W - 40, H - 40 - size), c, thickness)
    return img

def draw_scene_frame(scene, frame_idx, total_frames):
    """Generate a single frame for a scene."""
    # Gradient background: slightly lighter variant at top
    bg = scene["bg"]
    bg_light = tuple(min(255, c + 20) for c in bg)
    frame = make_gradient_frame(bg_light, bg)

    # Dot grid
    frame = draw_dot_grid(frame, color=scene["accent"])

    # Corner accents
    frame = draw_corner_accent(frame, scene["accent"])

    # Thin horizontal accent line at top
    cv2.line(frame, (0, 6), (W, 6), rgb_to_bgr(scene["accent"]), 3)
    cv2.line(frame, (0, H - 6), (W, H - 6), rgb_to_bgr(scene["accent"]), 3)

    # Convert to PIL for text rendering
    pil_img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    draw = ImageDraw.Draw(pil_img)

    lines = scene["lines"]
    total_height = 0
    rendered = []
    for text, color, size in lines:
        font = get_font(size, bold=(size >= 48))
        bbox = draw.textbbox((0, 0), text, font=font)
        tw = bbox[2] - bbox[0]
        th = bbox[3] - bbox[1]
        rendered.append((text, color, size, font, tw, th))
        total_height += th + 18

    y_start = (H - total_height) // 2 - 30

    # Fade-in effect: first 12 frames, fade-out: last 8 frames
    fade_in_frames  = min(15, total_frames // 6)
    fade_out_frames = min(10, total_frames // 8)
    if frame_idx < fade_in_frames:
        alpha = frame_idx / fade_in_frames
    elif frame_idx > total_frames - fade_out_frames:
        alpha = (total_frames - frame_idx) / fade_out_frames
    else:
        alpha = 1.0
    alpha = max(0.0, min(1.0, alpha))

    # Slight slide-in from left
    slide_x = int((1.0 - alpha) * 60)

    for i, (text, color, size, font, tw, th) in enumerate(rendered):
        # Stagger animation per line
        line_alpha = max(0.0, min(1.0, alpha * 1.2 - i * 0.15))
        line_slide = int((1.0 - line_alpha) * 80)
        x = (W - tw) // 2 + line_slide + slide_x
        y = y_start

        # Draw subtle shadow
        shadow_color = tuple(max(0, c - 60) for c in color)
        draw.text((x + 3, y + 3), text, font=font,
                  fill=(*shadow_color, int(100 * line_alpha)))

        # Draw main text with fade
        draw.text((x, y), text, font=font,
                  fill=(*color, int(255 * line_alpha)))

        y_start += th + 18

    # Scene tag (bottom-left, small)
    tag_font = get_font(20)
    draw.text((50, H - 60), scene["tag"], font=tag_font,
              fill=(*LIGHT_GRAY, int(180 * alpha)))

    # CorridorWork watermark (bottom-right)
    wm_font = get_font(22)
    wm_text = "CorridorWork"
    wm_bbox = draw.textbbox((0, 0), wm_text, font=wm_font)
    wm_w = wm_bbox[2] - wm_bbox[0]
    draw.text((W - wm_w - 50, H - 60), wm_text, font=wm_font,
              fill=(*scene["accent"], int(160 * alpha)))

    # Convert back to BGR numpy
    result = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    return result

# ── Transition frame ──────────────────────────────────────────────────────────

def make_transition(from_scene, to_scene, n_frames=12):
    """Simple fade-through-black transition."""
    frames = []
    for i in range(n_frames):
        t = i / n_frames
        # Fade out
        bg = from_scene["bg"]
        frame = make_gradient_frame(bg, tuple(max(0, c - 20) for c in bg))
        alpha = max(0.0, 1.0 - t * 2.5)
        black = np.zeros_like(frame)
        blended = cv2.addWeighted(frame, alpha, black, 1 - alpha, 0)
        frames.append(blended)
    return frames

# ── Audio generation ──────────────────────────────────────────────────────────

def generate_audio(scenes, audio_dir):
    """Generate AIFF audio per scene using macOS say, return list of paths."""
    audio_files = []
    voice = "Samantha"  # clear American English voice

    for scene in scenes:
        out_path = os.path.join(audio_dir, f"{scene['id']}.aiff")
        text = scene["voice"]
        try:
            result = subprocess.run(
                ["say", "-v", voice, "-o", out_path, text],
                capture_output=True, timeout=30
            )
            if result.returncode == 0 and os.path.exists(out_path):
                audio_files.append((scene["id"], out_path))
                print(f"  ✅ Audio: {scene['id']} ({os.path.getsize(out_path)//1024}KB)")
            else:
                print(f"  ⚠️  Audio failed for {scene['id']}: {result.stderr.decode()}")
                audio_files.append((scene["id"], None))
        except Exception as e:
            print(f"  ⚠️  Audio error {scene['id']}: {e}")
            audio_files.append((scene["id"], None))

    return audio_files

# ── Video-only MP4 ────────────────────────────────────────────────────────────

def build_video_only(scenes, out_path):
    """Build MP4 with animated slides, no audio."""
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    writer = cv2.VideoWriter(out_path, fourcc, FPS, (W, H))

    print(f"\n📹 Building video-only MP4: {out_path}")

    for i, scene in enumerate(scenes):
        n_frames = scene["duration"] * FPS
        print(f"  Scene {i+1}: {scene['id']} ({n_frames} frames @ {FPS}fps)")
        for f in range(n_frames):
            frame = draw_scene_frame(scene, f, n_frames)
            writer.write(frame)

        # Transition (except after last scene)
        if i < len(scenes) - 1:
            t_frames = make_transition(scene, scenes[i + 1])
            for tf in t_frames:
                writer.write(tf)

    writer.release()
    size_mb = os.path.getsize(out_path) / 1024 / 1024
    print(f"  ✅ Video-only MP4: {size_mb:.1f} MB")
    return out_path

# ── Combined audio+video MP4 ──────────────────────────────────────────────────

def build_video_with_audio(scenes, audio_files, video_only_path, out_path):
    """Combine video frames + scene audio into final MP4 using ffmpeg."""
    print(f"\n🔊 Adding audio to video...")

    # Check ffmpeg available
    ffmpeg = shutil.which("ffmpeg") or "/opt/homebrew/bin/ffmpeg"
    if not os.path.exists(ffmpeg):
        print("  ⚠️  ffmpeg not found — video-only version will be used")
        return None

    # Build per-scene audio+video clips, then concatenate
    tmpdir = tempfile.mkdtemp(prefix="cw_video_")
    clip_list = []

    try:
        scene_audio = {sid: path for sid, path in audio_files}

        for i, scene in enumerate(scenes):
            vid_clip  = os.path.join(tmpdir, f"scene_{i:02d}_vid.mp4")
            clip_path = os.path.join(tmpdir, f"scene_{i:02d}.mp4")

            n_frames = scene["duration"] * FPS
            # Build mini video for this scene
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            writer = cv2.VideoWriter(vid_clip, fourcc, FPS, (W, H))
            for f in range(n_frames):
                writer.write(draw_scene_frame(scene, f, n_frames))
            # Add transition frames
            if i < len(scenes) - 1:
                for tf in make_transition(scene, scenes[i + 1]):
                    writer.write(tf)
            writer.release()

            audio_path = scene_audio.get(scene["id"])

            if audio_path and os.path.exists(audio_path):
                # Combine video + audio, pad/trim to video length
                cmd = [
                    ffmpeg, "-y",
                    "-i", vid_clip,
                    "-i", audio_path,
                    "-c:v", "libx264",
                    "-c:a", "aac",
                    "-shortest",
                    "-movflags", "+faststart",
                    clip_path
                ]
            else:
                # Video only for this scene
                cmd = [
                    ffmpeg, "-y",
                    "-i", vid_clip,
                    "-c:v", "libx264",
                    "-movflags", "+faststart",
                    clip_path
                ]

            result = subprocess.run(cmd, capture_output=True, timeout=120)
            if result.returncode == 0:
                clip_list.append(clip_path)
                print(f"  ✅ Scene {i+1} clip: {os.path.getsize(clip_path)//1024}KB")
            else:
                print(f"  ⚠️  Scene {i+1} clip failed, using silent fallback")
                clip_list.append(vid_clip)

        # Write concat file
        concat_file = os.path.join(tmpdir, "concat.txt")
        with open(concat_file, "w") as f:
            for clip in clip_list:
                f.write(f"file '{clip}'\n")

        # Concatenate all clips
        cmd = [
            ffmpeg, "-y",
            "-f", "concat", "-safe", "0",
            "-i", concat_file,
            "-c:v", "libx264",
            "-c:a", "aac",
            "-movflags", "+faststart",
            "-preset", "fast",
            out_path
        ]
        result = subprocess.run(cmd, capture_output=True, timeout=300)
        if result.returncode == 0:
            size_mb = os.path.getsize(out_path) / 1024 / 1024
            print(f"  ✅ Final MP4 with audio: {size_mb:.1f} MB → {out_path}")
            return out_path
        else:
            print(f"  ⚠️  Final concat failed: {result.stderr.decode()[-300:]}")
            return None

    except Exception as e:
        print(f"  ⚠️  Audio+video error: {e}")
        return None
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)

# ── SRT generation ────────────────────────────────────────────────────────────

def seconds_to_srt_time(s):
    h = int(s // 3600)
    m = int((s % 3600) // 60)
    sec = s % 60
    ms = int((sec - int(sec)) * 1000)
    return f"{h:02d}:{m:02d}:{int(sec):02d},{ms:03d}"

SRT_CONTENT = {
    "en": [
        ("Millions of jobs.", "Millions of skilled workers.", 0, 4),
        ("Still disconnected.", "", 4, 8),
        ("Introducing CorridorWork.", "", 8, 11),
        ("We connect employers with qualified international talent.", "", 11, 16),
        ("Smarter matching. Global reach.", "Better opportunities.", 16, 21),
        ("21 sectors. 15+ global talent corridors.", "", 21, 25),
        ("Compliance-first. Zero false promises.", "", 25, 30),
        ("For employers seeking structured international talent.", "", 30, 34),
        ("For professionals exploring global career corridors.", "", 34, 38),
        ("For agencies and investors.", "", 38, 42),
        ("Explore CorridorWork.", "The structured path to global talent.", 42, 47),
        ("corridorwork.com", "Express interest — no commitment.", 47, 52),
    ],
    "de": [
        ("Millionen Jobs.", "Millionen qualifizierter Fachkräfte.", 0, 4),
        ("Noch immer getrennt.", "", 4, 8),
        ("CorridorWork stellt vor.", "", 8, 11),
        ("Wir verbinden Arbeitgeber mit internationalem Talent.", "", 11, 16),
        ("Intelligenteres Matching. Globale Reichweite.", "Bessere Chancen.", 16, 21),
        ("21 Bereiche. 15+ globale Talent-Korridore.", "", 21, 25),
        ("Compliance-First. Keine falschen Versprechen.", "", 25, 30),
        ("Für Arbeitgeber, die strukturiertes Talent suchen.", "", 30, 34),
        ("Für Fachkräfte, die globale Korridore erkunden.", "", 34, 38),
        ("Für Agenturen und Investoren.", "", 38, 42),
        ("Entdecken Sie CorridorWork.", "Der strukturierte Weg zu globalem Talent.", 42, 47),
        ("corridorwork.com", "Interesse bekunden — unverbindlich.", 47, 52),
    ],
    "fr": [
        ("Des millions d'emplois.", "Des millions de professionnels qualifiés.", 0, 4),
        ("Toujours déconnectés.", "", 4, 8),
        ("Découvrez CorridorWork.", "", 8, 11),
        ("Nous connectons employeurs et talents internationaux.", "", 11, 16),
        ("Matching intelligent. Portée mondiale.", "Meilleures opportunités.", 16, 21),
        ("21 secteurs. 15+ corridors mondiaux.", "", 21, 25),
        ("Conformité d'abord. Zéro fausse promesse.", "", 25, 30),
        ("Pour les employeurs cherchant des talents internationaux.", "", 30, 34),
        ("Pour les professionnels explorant des corridors mondiaux.", "", 34, 38),
        ("Pour les agences et investisseurs.", "", 38, 42),
        ("Découvrez CorridorWork.", "La voie structurée vers les talents mondiaux.", 42, 47),
        ("corridorwork.com", "Manifestez votre intérêt — sans engagement.", 47, 52),
    ],
    "ar": [
        ("ملايين الوظائف.", "ملايين المحترفين المهرة.", 0, 4),
        ("لا يزالون منفصلين.", "", 4, 8),
        ("نقدم CorridorWork.", "", 8, 11),
        ("نربط أصحاب العمل بالمواهب الدولية.", "", 11, 16),
        ("مطابقة أذكى. وصول عالمي.", "فرص أفضل.", 16, 21),
        ("21 قطاعاً. أكثر من 15 ممراً عالمياً.", "", 21, 25),
        ("الامتثال أولاً. صفر من الوعود الكاذبة.", "", 25, 30),
        ("لأصحاب العمل الباحثين عن المواهب الدولية.", "", 30, 34),
        ("للمحترفين الذين يستكشفون ممرات المسيرة المهنية.", "", 34, 38),
        ("للوكالات والمستثمرين.", "", 38, 42),
        ("استكشف CorridorWork.", "المسار المنظم للمواهب العالمية.", 42, 47),
        ("corridorwork.com", "أبدِ اهتمامك — بدون التزام.", 47, 52),
    ],
    "es": [
        ("Millones de empleos.", "Millones de profesionales calificados.", 0, 4),
        ("Todavía desconectados.", "", 4, 8),
        ("Presentamos CorridorWork.", "", 8, 11),
        ("Conectamos empleadores con talento internacional.", "", 11, 16),
        ("Matching más inteligente. Alcance global.", "Mejores oportunidades.", 16, 21),
        ("21 sectores. Más de 15 corredores globales.", "", 21, 25),
        ("Cumplimiento primero. Cero falsas promesas.", "", 25, 30),
        ("Para empleadores que buscan talento estructurado.", "", 30, 34),
        ("Para profesionales que exploran corredores globales.", "", 34, 38),
        ("Para agencias e inversores.", "", 38, 42),
        ("Explora CorridorWork.", "El camino estructurado hacia el talento global.", 42, 47),
        ("corridorwork.com", "Expresa tu interés — sin compromiso.", 47, 52),
    ],
    "pt": [
        ("Milhões de empregos.", "Milhões de profissionais qualificados.", 0, 4),
        ("Ainda desconectados.", "", 4, 8),
        ("Apresentamos CorridorWork.", "", 8, 11),
        ("Conectamos empregadores com talentos internacionais.", "", 11, 16),
        ("Matching mais inteligente. Alcance global.", "Melhores oportunidades.", 16, 21),
        ("21 setores. Mais de 15 corredores globais.", "", 21, 25),
        ("Conformidade primeiro. Zero falsas promessas.", "", 25, 30),
        ("Para empregadores buscando talentos internacionais.", "", 30, 34),
        ("Para profissionais explorando corredores globais.", "", 34, 38),
        ("Para agências e investidores.", "", 38, 42),
        ("Explore o CorridorWork.", "O caminho estruturado para talentos globais.", 42, 47),
        ("corridorwork.com", "Manifeste seu interesse — sem compromisso.", 47, 52),
    ],
    "hi": [
        ("लाखों नौकरियां।", "लाखों कुशल पेशेवर।", 0, 4),
        ("अभी भी असंबद्ध।", "", 4, 8),
        ("CorridorWork से मिलें।", "", 8, 11),
        ("हम नियोक्ताओं को अंतरराष्ट्रीय प्रतिभाओं से जोड़ते हैं।", "", 11, 16),
        ("स्मार्ट मिलान। वैश्विक पहुंच।", "बेहतर अवसर।", 16, 21),
        ("21 क्षेत्र। 15+ वैश्विक प्रतिभा गलियारे।", "", 21, 25),
        ("अनुपालन पहले। शून्य झूठे वादे।", "", 25, 30),
        ("नियोक्ताओं के लिए जो संरचित प्रतिभा चाहते हैं।", "", 30, 34),
        ("पेशेवरों के लिए जो वैश्विक करियर गलियारे खोजते हैं।", "", 34, 38),
        ("एजेंसियों और निवेशकों के लिए।", "", 38, 42),
        ("CorridorWork देखें।", "वैश्विक प्रतिभा का संरचित मार्ग।", 42, 47),
        ("corridorwork.com", "रुचि व्यक्त करें — बिना किसी प्रतिबद्धता के।", 47, 52),
    ],
    "ur": [
        ("لاکھوں ملازمتیں۔", "لاکھوں ماہر پیشہ ور۔", 0, 4),
        ("ابھی بھی منقطع۔", "", 4, 8),
        ("CorridorWork سے ملیں۔", "", 8, 11),
        ("ہم آجروں کو بین الاقوامی ہنر سے جوڑتے ہیں۔", "", 11, 16),
        ("ذہین ملاپ۔ عالمی رسائی۔", "بہتر مواقع۔", 16, 21),
        ("21 شعبے۔ 15+ عالمی راہداریاں۔", "", 21, 25),
        ("تعمیل پہلے۔ کوئی جھوٹا وعدہ نہیں۔", "", 25, 30),
        ("آجروں کے لیے جو منظم ہنر چاہتے ہیں۔", "", 30, 34),
        ("پیشہ وروں کے لیے جو عالمی کریئر راہداریاں تلاش کرتے ہیں۔", "", 34, 38),
        ("ایجنسیوں اور سرمایہ کاروں کے لیے۔", "", 38, 42),
        ("CorridorWork دیکھیں۔", "عالمی ہنر کا منظم راستہ۔", 42, 47),
        ("corridorwork.com", "دلچسپی ظاہر کریں — بغیر کسی وابستگی کے۔", 47, 52),
    ],
    "fil": [
        ("Milyun-milyong trabaho.", "Milyun-milyong kwalipikadong propesyonal.", 0, 4),
        ("Hindi pa rin konektado.", "", 4, 8),
        ("Ipinakilala ang CorridorWork.", "", 8, 11),
        ("Ikinokonekta namin ang mga employer sa internasyonal na talento.", "", 11, 16),
        ("Mas matalinong pagtatugma. Pandaigdigang abot.", "Mas magagandang pagkakataon.", 16, 21),
        ("21 sektor. Mahigit 15 pandaigdigang corridor.", "", 21, 25),
        ("Pagsunod muna. Zero na maling pangako.", "", 25, 30),
        ("Para sa mga employer na naghahanap ng internasyonal na talento.", "", 30, 34),
        ("Para sa mga propesyonal na nag-eeksplora ng career corridor.", "", 34, 38),
        ("Para sa mga ahensiya at mamumuhunan.", "", 38, 42),
        ("I-explore ang CorridorWork.", "Ang nakaayos na landas tungo sa pandaigdigang talento.", 42, 47),
        ("corridorwork.com", "Ipahayag ang interes — walang pangako.", 47, 52),
    ],
    "tr": [
        ("Milyonlarca iş fırsatı.", "Milyonlarca nitelikli profesyonel.", 0, 4),
        ("Hâlâ bağlantısız.", "", 4, 8),
        ("CorridorWork'ü tanıtıyoruz.", "", 8, 11),
        ("İşverenleri uluslararası yeteneklerle buluşturuyoruz.", "", 11, 16),
        ("Daha akıllı eşleştirme. Küresel erişim.", "Daha iyi fırsatlar.", 16, 21),
        ("21 sektör. 15'ten fazla küresel koridor.", "", 21, 25),
        ("Uyumluluk önce. Sıfır yanlış vaat.", "", 25, 30),
        ("Yapılandırılmış yetenek arayan işverenler için.", "", 30, 34),
        ("Küresel kariyer koridorlarını keşfeden profesyoneller için.", "", 34, 38),
        ("Ajanslar ve yatırımcılar için.", "", 38, 42),
        ("CorridorWork'ü keşfedin.", "Küresel yeteneğe giden yapılandırılmış yol.", 42, 47),
        ("corridorwork.com", "İlginizi belirtin — taahhüt yok.", 47, 52),
    ],
}

def build_srt(lang_code, entries, out_path):
    """Write an SRT subtitle file."""
    lines = []
    for i, entry in enumerate(entries, start=1):
        line1, line2, start, end = entry
        t_start = seconds_to_srt_time(start)
        t_end   = seconds_to_srt_time(end)
        text = line1 + (f"\n{line2}" if line2 else "")
        lines.append(f"{i}\n{t_start} --> {t_end}\n{text}\n")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"  ✅ SRT [{lang_code}]: {out_path}")

# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("CorridorWork Promo Video Builder")
    print("=" * 60)

    os.makedirs(OUT_DIR, exist_ok=True)
    srt_dir = os.path.join(OUT_DIR, "subtitles")
    os.makedirs(srt_dir, exist_ok=True)

    # 1. Build video-only MP4
    video_only_path = os.path.join(OUT_DIR, "corridorwork-promo-en-noaudio.mp4")
    build_video_only(SCENES, video_only_path)

    # 2. Generate audio
    audio_dir = tempfile.mkdtemp(prefix="cw_audio_")
    print(f"\n🎙️  Generating audio (macOS say, voice=Samantha)...")
    audio_files = generate_audio(SCENES, audio_dir)

    # 3. Build with audio using ffmpeg
    video_audio_path = os.path.join(OUT_DIR, "corridorwork-promo-en.mp4")
    result = build_video_with_audio(SCENES, audio_files, video_only_path, video_audio_path)

    # 4. Generate all SRT files
    print(f"\n📝 Generating SRT subtitle files...")
    for lang_code, entries in SRT_CONTENT.items():
        srt_path = os.path.join(srt_dir, f"corridorwork-promo-{lang_code}.srt")
        build_srt(lang_code, entries, srt_path)

    # 5. Cleanup audio temp
    shutil.rmtree(audio_dir, ignore_errors=True)

    # 6. Report
    print("\n" + "=" * 60)
    print("BUILD COMPLETE")
    print("=" * 60)

    files = os.listdir(OUT_DIR)
    print(f"\nFiles in {OUT_DIR}:")
    for f in sorted(files):
        full = os.path.join(OUT_DIR, f)
        if os.path.isfile(full):
            size = os.path.getsize(full) / 1024 / 1024
            print(f"  {f} ({size:.1f} MB)")

    srt_files = os.listdir(srt_dir)
    print(f"\nSRT files ({len(srt_files)}):")
    for f in sorted(srt_files):
        print(f"  {f}")

    main_video = video_audio_path if result else video_only_path
    print(f"\n✅ Main video: {main_video}")
    print(f"   Has audio: {'YES' if result else 'NO (video-only)'}")
    print(f"\n▶️  To view:  open '{main_video}'")

if __name__ == "__main__":
    main()
