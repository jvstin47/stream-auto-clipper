"""Universal high-impact pro gaming thumbnail engine with mathematical alignment.

Features:
- Automated frame extraction scoring (Laplacian sharpness + HSV saturation).
- 1:1 Profile Safe Zone optimization for Instagram Reels and YouTube Shorts.
- Dynamic category badging (Pursuit, Combat, Stealth, Speed, Heist) with chromatic color palettes.
- Multi-layer 3D typography with subpixel glyph centering and drop shadows.
"""
import os, sys, glob, json, re
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS_DIR = os.path.join(HERE, "assets", "fonts")
if not os.path.isdir(FONTS_DIR):
    FONTS_DIR = os.path.join(HERE, "production", "fonts")

FONT_KANIT = os.path.join(FONTS_DIR, "Kanit-Black.ttf")
FONT_RUSSO = os.path.join(FONTS_DIR, "RussoOne-Regular.ttf")

CATEGORIES = [
    {
        "keywords": ["police", "pursuit", "chase", "evasion", "cops", "wanted"],
        "badge": "WANTED: 5 STARS  \u2022  ACTION",
        "badge_bg": "#2563EB",
        "badge_border": "#3B82F6",
        "l1_color": "#00F0FF",   # Siren Cyan
        "l2_color": "#FF2A55",   # Siren Red
        "pill_border": "#00F0FF"
    },
    {
        "keywords": ["shootout", "ambush", "raid", "fight", "combat", "gunfight", "rampage"],
        "badge": "HEAT LEVEL: 5-STAR",
        "badge_bg": "#DC2626",
        "badge_border": "#EF4444",
        "l1_color": "#FFFFFF",
        "l2_color": "#FFDD00",   # Solar Gold
        "pill_border": "#FFDD00"
    },
    {
        "keywords": ["stealth", "escape", "infiltration", "secret", "covert"],
        "badge": "STEALTH MISSION  \u2022  CLUTCH",
        "badge_bg": "#059669",
        "badge_border": "#10B981",
        "l1_color": "#FFFFFF",
        "l2_color": "#00FF88",   # Toxic Emerald
        "pill_border": "#00FF88"
    },
    {
        "keywords": ["stunt", "drift", "speed", "jump", "supercar", "air", "highway", "tracks"],
        "badge": "EXTREME SPEED  \u2022  STUNT",
        "badge_bg": "#D946EF",
        "badge_border": "#F0ABFC",
        "l1_color": "#FFFFFF",
        "l2_color": "#FF00A0",   # Hot Magenta
        "pill_border": "#FF00A0"
    },
    {
        "keywords": ["heist", "breakout", "yacht", "gang", "hideout", "cash", "bank", "vault"],
        "badge": "HEIST OPERATION  \u2022  CLUTCH",
        "badge_bg": "#D97706",
        "badge_border": "#F59E0B",
        "l1_color": "#FFFFFF",
        "l2_color": "#FFDD00",   # Solar Gold
        "pill_border": "#FFDD00"
    }
]

DEFAULT_CAT = {
    "badge": "STREAM HIGHLIGHT",
    "badge_bg": "#E10A19",
    "badge_border": "#FF4455",
    "l1_color": "#FFFFFF",
    "l2_color": "#FFDD00",
    "pill_border": "#FFDD00"
}


def get_category(title: str):
    t_low = title.lower()
    for cat in CATEGORIES:
        for kw in cat["keywords"]:
            if kw in t_low:
                return cat
    return DEFAULT_CAT


def pick_best_frame(mp4_path):
    cap = cv2.VideoCapture(mp4_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    dur = total / fps

    # Sample candidate timestamps between 4s and dur-4s
    sample_times = np.linspace(4.0, max(5.0, dur - 4.0), 14)
    best_frame = None
    best_score = -1.0

    for t in sample_times:
        cap.set(cv2.CAP_PROP_POS_MSEC, int(t * 1000))
        ret, frame = cap.read()
        if not ret or frame is None:
            continue

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        sat_mean = np.mean(hsv[:, :, 1])

        score = lap_var + sat_mean * 2.2
        if score > best_score:
            best_score = score
            best_frame = frame

    cap.release()
    if best_frame is None:
        cap = cv2.VideoCapture(mp4_path)
        cap.set(cv2.CAP_PROP_POS_MSEC, 5000)
        ret, best_frame = cap.read()
        cap.release()

    return best_frame


def get_fitted_font(draw, text, font_path=FONT_KANIT, max_w=940, max_size=125, min_size=70):
    size = max_size
    while size > min_size:
        f = ImageFont.truetype(font_path, size) if os.path.isfile(font_path) else ImageFont.load_default()
        bb = draw.textbbox((0, 0), text, font=f)
        if (bb[2] - bb[0]) <= max_w:
            return f
        size -= 5
    return ImageFont.truetype(font_path, min_size) if os.path.isfile(font_path) else ImageFont.load_default()


def draw_exact_centered_text(draw, cx, cy, text, font, fill_c, stroke_c="#000000", stroke_w=9, depth=5):
    """Mathematically centers text bounding box exactly on (cx, cy) with 3D drop shadow."""
    bb = draw.textbbox((0, 0), text, font=font)
    tw = bb[2] - bb[0]
    th = bb[3] - bb[1]
    x = cx - tw // 2 - bb[0]
    y = cy - th // 2 - bb[1]

    for i in range(depth):
        d_off = 3 + i * 2.5
        draw.text((x + d_off, y + d_off), text, font=font, fill=(0, 0, 0, 210),
                  stroke_width=stroke_w + 3, stroke_fill=(0, 0, 0, 210))
    draw.text((x, y), text, font=font, fill=fill_c, stroke_width=stroke_w, stroke_fill=stroke_c)
    return x, y, tw, th


def draw_angled_badge(tdraw, cx, cy, text, font, fill_c, stroke_c):
    bb = tdraw.textbbox((0, 0), text, font=font)
    bw, bh = bb[2] - bb[0], bb[3] - bb[1]
    pw, ph = bw + 64, bh + 22
    bx0, by0 = cx - pw // 2, cy - ph // 2
    bx1, by1 = bx0 + pw, by0 + ph
    skew = 16
    poly = [(bx0 + skew, by0), (bx1 + skew, by0), (bx1 - skew, by1), (bx0 - skew, by1)]
    tdraw.polygon(poly, fill=fill_c)
    tdraw.line(poly + [poly[0]], fill=stroke_c, width=3)
    tx = cx - (bb[2] - bb[0]) // 2 - bb[0]
    ty = cy - (bb[3] - bb[1]) // 2 - bb[1]
    tdraw.text((tx, ty), text, font=font, fill="#FFFFFF")


def draw_live_pill(tdraw, cx, cy, text, font, border_c="#FFDD00"):
    bb = tdraw.textbbox((0, 0), text, font=font)
    pw_text, ph_text = bb[2] - bb[0], bb[3] - bb[1]
    pill_box_w = pw_text + 84
    pill_box_h = ph_text + 28
    px0 = cx - pill_box_w // 2
    py0 = cy - pill_box_h // 2
    px1, py1 = px0 + pill_box_w, py0 + pill_box_h
    tdraw.rounded_rectangle([px0, py0, px1, py1], radius=pill_box_h // 2,
                            fill=(12, 12, 18, 235), outline=border_c, width=3)
    dot_radius = 8
    dot_cx = px0 + 26
    dot_cy = cy
    tdraw.ellipse([dot_cx - dot_radius, dot_cy - dot_radius, dot_cx + dot_radius, dot_cy + dot_radius], fill="#FF1A1A")
    text_x = px0 + 44
    text_y = cy - ph_text // 2 - bb[1]
    tdraw.text((text_x, text_y), text, font=font, fill="#FFFFFF")


def generate_thumbnail(
    mp4_path: str,
    format_type: str,
    out_path: str,
    creator_name: str = "CREATOR GAMING",
    game_title: str = "HIGHLIGHT",
    handle: str = "streamer",
    platform: str = "TWITCH.TV",
    hook_title: str = "",
    base_image_path: str = ""
) -> bool:
    w, h = 1080, 1920

    if base_image_path and os.path.isfile(base_image_path):
        raw = Image.open(base_image_path).convert("RGB")
        base_img = raw.resize((w, h), Image.Resampling.LANCZOS)
    else:
        frame = pick_best_frame(mp4_path)
        if frame is None:
            print(f"Error reading frame from {mp4_path}")
            return False

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        img = Image.fromarray(frame_rgb)
        img = ImageEnhance.Contrast(img).enhance(1.25)
        img = ImageEnhance.Color(img).enhance(1.30)
        img = ImageEnhance.Brightness(img).enhance(1.03)

        vignette = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        vdraw = ImageDraw.Draw(vignette)
        for i in range(320):
            alpha = int(210 * (1.0 - i / 320.0)**1.5)
            vdraw.line([(0, i), (w, i)], fill=(0, 0, 0, alpha))
            vdraw.line([(0, h - i), (w, h - i)], fill=(0, 0, 0, alpha))

        base_img = Image.alpha_composite(img.convert("RGBA"), vignette).convert("RGB")

    text_canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(text_canvas)

    cat = get_category(hook_title or game_title)

    font_kanit_huge = ImageFont.truetype(FONT_KANIT, 150) if os.path.isfile(FONT_KANIT) else ImageFont.load_default()
    font_badge = ImageFont.truetype(FONT_RUSSO, 28) if os.path.isfile(FONT_RUSSO) else ImageFont.load_default()
    font_pill = ImageFont.truetype(FONT_KANIT, 36) if os.path.isfile(FONT_KANIT) else ImageFont.load_default()

    if format_type == "SafeZone Hero" or base_image_path:
        # Chest safe-zone: Y in [1380, 1560]
        # Top category badge
        badge_text = cat["badge"]
        draw_angled_badge(tdraw, w // 2, 115, badge_text, font_badge, cat["badge_bg"], cat["badge_border"])

        words = (hook_title or creator_name).strip().split()
        if len(words) >= 4:
            l1, l2 = f"{words[0]} {words[1]}".upper(), f"{words[-2]} {words[-1]}".upper()
        elif len(words) == 3:
            l1, l2 = words[0].upper(), f"{words[1]} {words[2]}".upper()
        elif len(words) == 2:
            l1, l2 = words[0].upper(), words[1].upper()
        else:
            l1, l2 = (words[0].upper() if words else "EPIC"), "CLUTCH"

        f1 = get_fitted_font(tdraw, l1, FONT_KANIT, max_w=940, max_size=125, min_size=70)
        f2 = get_fitted_font(tdraw, l2, FONT_KANIT, max_w=940, max_size=125, min_size=70)

        draw_exact_centered_text(tdraw, w // 2, 1410, l1, f1, fill_c=cat["l1_color"], stroke_w=10, depth=6)
        draw_exact_centered_text(tdraw, w // 2, 1525, l2, f2, fill_c=cat["l2_color"], stroke_w=10, depth=6)

        pill_text = f"{platform.upper()}/{handle.upper()}"
        draw_live_pill(tdraw, w // 2, 1830, pill_text, font_pill, border_c=cat["pill_border"])

    elif format_type == "Format B":
        # Format B: 16:9 gameplay sits in center (y=656..1264)
        badge_text = f"{game_title.upper()}  \u2022  OFFICIAL HIGHLIGHT"
        draw_angled_badge(tdraw, w // 2, 230, badge_text, font_badge, cat["badge_bg"], cat["badge_border"])

        parts = creator_name.strip().split(None, 1)
        line1 = parts[0].upper()
        line2 = parts[1].upper() if len(parts) > 1 else "GAMING"

        draw_exact_centered_text(tdraw, w // 2, 350, line1, font_kanit_huge, fill_c="#FFFFFF", stroke_w=10, depth=6)
        draw_exact_centered_text(tdraw, w // 2, 495, line2, font_kanit_huge, fill_c="#FFDD00", stroke_w=10, depth=6)

        pill_text = f"{platform.upper()} / {handle.upper()}"
        draw_live_pill(tdraw, w // 2, 1430, pill_text, font_pill, border_c=cat["pill_border"])

    else:
        # Format A: Stacked 9:16
        panel_cx = w // 2
        panel_cy = 1420
        panel_w = 900
        panel_h = 160
        px1 = panel_cx - panel_w // 2
        py1 = panel_cy - panel_h // 2
        px2 = px1 + panel_w
        py2 = py1 + panel_h

        tdraw.rounded_rectangle([px1, py1, px2, py2], radius=20,
                                fill=(10, 10, 16, 220), outline=(255, 221, 0, 180), width=3)

        badge_text = f"{game_title.upper()}  \u2022  OFFICIAL HIGHLIGHT"
        draw_angled_badge(tdraw, w // 2, py1 + 38, badge_text, font_badge, cat["badge_bg"], cat["badge_border"])

        parts = creator_name.strip().split(None, 1)
        line1 = parts[0].upper()
        line2 = parts[1].upper() if len(parts) > 1 else "GAMING"

        font_kanit_title = ImageFont.truetype(FONT_KANIT, 105) if os.path.isfile(FONT_KANIT) else ImageFont.load_default()
        draw_exact_centered_text(tdraw, w // 2, py1 + 106, f"{line1} {line2}", font_kanit_title, fill_c="#FFDD00", stroke_w=7)

    final_img = Image.alpha_composite(base_img.convert("RGBA"), text_canvas).convert("RGB")
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    final_img.save(out_path, "JPEG", quality=95)
    return True


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Universal Pro Gaming Thumbnail Generator")
    parser.add_argument("mp4", nargs="?", default="", help="Path to input MP4 video")
    parser.add_argument("--format", choices=["Format A", "Format B", "SafeZone Hero"], default="Format B")
    parser.add_argument("--base-image", default="", help="Optional base template image")
    parser.add_argument("--hook", default="", help="Custom hook title to render")
    parser.add_argument("--out", default="thumbnail.jpg", help="Output JPG path")
    parser.add_argument("--creator", default="CREATOR GAMING", help="Creator name")
    parser.add_argument("--game", default="GAMEPLAY", help="Game or stream title")
    parser.add_argument("--platform", default="STREAM", help="Stream platform (KICK.COM, TWITCH, YOUTUBE)")
    parser.add_argument("--handle", default="streamer", help="Creator handle")
    args = parser.parse_args()

    ok = generate_thumbnail(args.mp4, args.format, args.out, creator_name=args.creator,
                            game_title=args.game, handle=args.handle, platform=args.platform,
                            hook_title=args.hook, base_image_path=args.base_image)
    if ok:
        print(f"Generated {args.out}")
