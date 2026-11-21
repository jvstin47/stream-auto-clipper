"""Universal high-impact pro gaming thumbnail engine with mathematical alignment."""
import os, sys, glob, json
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS_DIR = os.path.join(HERE, "assets", "fonts")
if not os.path.isdir(FONTS_DIR):
    FONTS_DIR = os.path.join(HERE, "production", "fonts")

FONT_KANIT = os.path.join(FONTS_DIR, "Kanit-Black.ttf")
FONT_RUSSO = os.path.join(FONTS_DIR, "RussoOne-Regular.ttf")

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
        
        # Sharpness via Laplacian variance
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        lap_var = cv2.Laplacian(gray, cv2.CV_64F).var()
        # Saturation mean
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

def draw_exact_centered_text(draw, cx, cy, text, font, fill_c, stroke_c="#000000", stroke_w=9, depth=5):
    """Mathematically centers text bounding box exactly on (cx, cy) with 3D drop shadow."""
    bb = draw.textbbox((0, 0), text, font=font)
    tw = bb[2] - bb[0]
    th = bb[3] - bb[1]
    # Precise offset accounting for internal glyph bearing
    x = cx - tw // 2 - bb[0]
    y = cy - th // 2 - bb[1]
    
    for i in range(depth):
        d_off = 3 + i * 2.5
        draw.text((x + d_off, y + d_off), text, font=font, fill=(0, 0, 0, 210),
                  stroke_width=stroke_w + 3, stroke_fill=(0, 0, 0, 210))
    draw.text((x, y), text, font=font, fill=fill_c, stroke_width=stroke_w, stroke_fill=stroke_c)
    return x, y, tw, th

def generate_thumbnail(
    mp4_path: str,
    format_type: str,
    out_path: str,
    creator_name: str = "EAGLE GAMING",
    game_title: str = "GTA 6",
    handle: str = "EAGLEGAMING",
    platform: str = "KICK.COM"
) -> bool:
    frame = pick_best_frame(mp4_path)
    if frame is None:
        print(f"Error reading frame from {mp4_path}")
        return False
        
    # 1. Pro Color Grading
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(frame_rgb)
    img = ImageEnhance.Contrast(img).enhance(1.25)
    img = ImageEnhance.Color(img).enhance(1.30)
    img = ImageEnhance.Brightness(img).enhance(1.03)
    
    w, h = img.size # 1080, 1920
    
    # 2. Cinematic Vignette
    vignette = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    vdraw = ImageDraw.Draw(vignette)
    for i in range(320):
        alpha = int(210 * (1.0 - i / 320.0)**1.5)
        vdraw.line([(0, i), (w, i)], fill=(0, 0, 0, alpha))
        vdraw.line([(0, h - i), (w, h - i)], fill=(0, 0, 0, alpha))
        
    base_img = Image.alpha_composite(img.convert("RGBA"), vignette).convert("RGB")
    
    # 3. Typography & Graphics Overlay
    text_canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    tdraw = ImageDraw.Draw(text_canvas)
    
    # Split creator name into two words if possible for bold stacked display
    parts = creator_name.strip().split(None, 1)
    line1 = parts[0].upper()
    line2 = parts[1].upper() if len(parts) > 1 else "GAMING"
    
    if format_type == "Format B":
        # Format B: 16:9 gameplay sits in center (y=656..1264)
        font_kanit_huge = ImageFont.truetype(FONT_KANIT, 150)
        font_badge = ImageFont.truetype(FONT_RUSSO, 30)
        font_pill = ImageFont.truetype(FONT_KANIT, 40)
        
        # --- TOP BADGE: Symmetrical angled red polygon ---
        badge_text = f"{game_title.upper()}  \u2022  OFFICIAL HIGHLIGHT"
        bb_b = tdraw.textbbox((0, 0), badge_text, font=font_badge)
        bw, bh = bb_b[2] - bb_b[0], bb_b[3] - bb_b[1]
        
        badge_cx = w // 2
        badge_cy = 230
        badge_pad_x = 34
        badge_pad_y = 10
        b_w = bw + badge_pad_x * 2
        b_h = bh + badge_pad_y * 2
        bx1 = badge_cx - b_w // 2
        by1 = badge_cy - b_h // 2
        bx2 = bx1 + b_w
        by2 = by1 + b_h
        
        skew = 16
        poly = [
            (bx1 + skew, by1),
            (bx2 + skew, by1),
            (bx2 - skew, by2),
            (bx1 - skew, by2)
        ]
        tdraw.polygon(poly, fill=(225, 10, 25, 245))
        tdraw.text((badge_cx - bw // 2 - bb_b[0], badge_cy - bh // 2 - bb_b[1]),
                   badge_text, font=font_badge, fill="#FFFFFF")
        
        # --- HERO TITLE: STACKED BOLD 150pt ---
        draw_exact_centered_text(tdraw, w // 2, 350, line1, font_kanit_huge, fill_c="#FFFFFF", stroke_w=10, depth=6)
        draw_exact_centered_text(tdraw, w // 2, 495, line2, font_kanit_huge, fill_c="#FFDD00", stroke_w=10, depth=6)
        
        # --- BOTTOM CALLOUT PILL ---
        pill_text = f"{platform.upper()} / {handle.upper()}"
        bb_p = tdraw.textbbox((0, 0), pill_text, font=font_pill)
        pw, ph = bb_p[2] - bb_p[0], bb_p[3] - bb_p[1]
        
        pill_cx = w // 2
        pill_cy = 1430
        pill_h = 76
        dot_r = 8
        dot_gap = 18
        total_content_w = dot_r * 2 + dot_gap + pw
        pill_w = total_content_w + 70
        
        px1 = pill_cx - pill_w // 2
        py1 = pill_cy - pill_h // 2
        px2 = px1 + pill_w
        py2 = py1 + pill_h
        
        tdraw.rounded_rectangle([px1, py1, px2, py2], radius=16,
                                fill=(12, 12, 18, 235), outline=(255, 221, 0, 180), width=3)
        
        content_start_x = pill_cx - total_content_w // 2
        dot_cx = content_start_x + dot_r
        dot_cy = pill_cy
        
        tdraw.ellipse([dot_cx - dot_r - 3, dot_cy - dot_r - 3, dot_cx + dot_r + 3, dot_cy + dot_r + 3], fill=(225, 10, 25, 80))
        tdraw.ellipse([dot_cx - dot_r, dot_cy - dot_r, dot_cx + dot_r, dot_cy + dot_r], fill=(235, 20, 30, 255))
        
        text_x = content_start_x + dot_r * 2 + dot_gap - bb_p[0]
        text_y = pill_cy - ph // 2 - bb_p[1]
        tdraw.text((text_x, text_y), pill_text, font=font_pill, fill="#FFFFFF")
        
    else:
        # Format A: Stacked 9:16 (Top facecam, bottom gameplay)
        font_kanit_title = ImageFont.truetype(FONT_KANIT, 105)
        font_badge = ImageFont.truetype(FONT_RUSSO, 26)
        
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
        bb_b = tdraw.textbbox((0, 0), badge_text, font=font_badge)
        bw, bh = bb_b[2] - bb_b[0], bb_b[3] - bb_b[1]
        badge_cx = w // 2
        badge_cy = py1 + 38
        skew = 14
        b_w = bw + 48
        b_h = bh + 14
        bx1 = badge_cx - b_w // 2
        by1 = badge_cy - b_h // 2
        bx2 = bx1 + b_w
        by2 = by1 + b_h
        
        poly = [
            (bx1 + skew, by1),
            (bx2 + skew, by1),
            (bx2 - skew, by2),
            (bx1 - skew, by2)
        ]
        tdraw.polygon(poly, fill=(225, 10, 25, 245))
        tdraw.text((badge_cx - bw // 2 - bb_b[0], badge_cy - bh // 2 - bb_b[1]),
                   badge_text, font=font_badge, fill="#FFFFFF")
        
        t1 = f"{line1} "
        t2 = line2
        bb_e = tdraw.textbbox((0, 0), t1, font=font_kanit_title)
        we, he = bb_e[2] - bb_e[0], bb_e[3] - bb_e[1]
        bb_g = tdraw.textbbox((0, 0), t2, font=font_kanit_title)
        wg, hg = bb_g[2] - bb_g[0], bb_g[3] - bb_g[1]
        tot_w = we + wg
        
        title_cx = w // 2
        title_cy = py1 + 106
        start_x = title_cx - tot_w // 2
        
        def draw_exact_text(x, y, text, font, fill_c, stroke_c="#000000", stroke_w=7, depth=4):
            for i in range(depth):
                d_off = 2 + i * 2
                tdraw.text((x + d_off, y + d_off), text, font=font, fill=(0, 0, 0, 200),
                           stroke_width=stroke_w + 2, stroke_fill=(0, 0, 0, 200))
            tdraw.text((x, y), text, font=font, fill=fill_c, stroke_width=stroke_w, stroke_fill=stroke_c)
            
        draw_exact_text(start_x - bb_e[0], title_cy - he // 2 - bb_e[1], t1, font_kanit_title, fill_c="#FFFFFF", stroke_w=7)
        draw_exact_text(start_x + we - bb_g[0], title_cy - hg // 2 - bb_g[1], t2, font_kanit_title, fill_c="#FFDD00", stroke_w=7)
        
    final_img = Image.alpha_composite(base_img.convert("RGBA"), text_canvas).convert("RGB")
    os.makedirs(os.path.dirname(os.path.abspath(out_path)), exist_ok=True)
    final_img.save(out_path, "JPEG", quality=95)
    return True

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Universal Pro Gaming Thumbnail Generator")
    parser.add_argument("mp4", help="Path to input MP4 video")
    parser.add_argument("--format", choices=["Format A", "Format B"], default="Format B")
    parser.add_argument("--out", default="thumbnail.jpg", help="Output JPG path")
    parser.add_argument("--creator", default="CREATOR GAMING", help="Creator name")
    parser.add_argument("--game", default="GAMEPLAY", help="Game or stream title")
    parser.add_argument("--platform", default="STREAM", help="Stream platform (KICK.COM, TWITCH, YOUTUBE)")
    parser.add_argument("--handle", default="streamer", help="Creator handle")
    args = parser.parse_args()
    
    ok = generate_thumbnail(args.mp4, args.format, args.out, creator_name=args.creator,
                            game_title=args.game, handle=args.handle, platform=args.platform)
    if ok:
        print(f"Generated {args.out}")
