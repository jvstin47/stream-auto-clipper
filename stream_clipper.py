"""Universal Stream Auto-Clipper & Short-Form Video Generator.

Scans any live stream or VOD for audio/visual peak energy, dynamically sizes clips
between 30s-75s, renders high-energy 9:16 vertical videos (Format A stacked or Format B blurred fit),
and generates matching pro thumbnails.
"""
import argparse, glob, json, math, os, subprocess, sys, time
from datetime import datetime
import cv2
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from player_track import track_player, crop_x_expr
import facecam_detect
from facecam_detect import Faces
from thumbnail_engine import generate_thumbnail
from clipper_config import ClipperConfig

fdetector = Faces()

def scan_chunk_signals(chunk_path):
    cmd = [
        "ffmpeg", "-hide_banner", "-loglevel", "error",
        "-i", chunk_path,
        "-vn", "-f", "s16le", "-ac", "1", "-ar", "8000", "-"
    ]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    raw_audio, _ = p.communicate()
    samples = np.frombuffer(raw_audio, dtype=np.int16).astype(np.float32) / 32768.0
    sr = 8000
    n_sec_audio = len(samples) // sr
    rms_per_sec = []
    for s in range(n_sec_audio):
        b = samples[s*sr:(s+1)*sr]
        val = np.sqrt(np.mean(b**2) + 1e-6)
        db = 20 * np.log10(val)
        rms_per_sec.append(db)
        
    cap = cv2.VideoCapture(chunk_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    dur = total / fps
    n_sec_video = int(dur)
    
    motion_per_sec = []
    prev_gray = None
    step = int(fps)
    for s in range(n_sec_video):
        cap.set(cv2.CAP_PROP_POS_FRAMES, s * step)
        ret, frame = cap.read()
        if not ret: break
        h, w = frame.shape[:2]
        game = frame[int(h*0.25):int(h*0.85), int(w*0.2):int(w*0.8)]
        gray = cv2.cvtColor(game, cv2.COLOR_BGR2GRAY)
        if prev_gray is not None:
            diff = float(np.mean(np.abs(gray.astype(float) - prev_gray.astype(float))))
            motion_per_sec.append(diff)
        else:
            motion_per_sec.append(5.0)
        prev_gray = gray
    cap.release()
    
    return rms_per_sec, motion_per_sec, dur

def compute_dynamic_duration(rms_list, motion_list, start, chunk_dur, min_len=30, max_len=75):
    available = max(0.0, chunk_dur - start - 1.0)
    if available < min_len:
        return min(available, min_len)
    
    max_possible = min(float(max_len), available)
    st = int(start)
    current_len = min_len
    
    while current_len + 5 <= max_possible:
        window_end = st + current_len
        next_rms = rms_list[window_end:window_end + 5]
        next_motion = motion_list[window_end:window_end + 5]
        
        avg_rms = float(np.mean(next_rms)) if len(next_rms) > 0 else -40.0
        avg_mot = float(np.mean(next_motion)) if len(next_motion) > 0 else 0.0
        
        if avg_rms > -24.0 or avg_mot > 13.0:
            current_len += 5
        elif avg_rms > -27.0 and avg_mot > 9.0 and current_len < 50:
            current_len += 5
        else:
            break
            
    return float(min(max_possible, max(min_len, current_len)))

def evaluate_window_score(rms_list, motion_list, start, length=30):
    st = int(start)
    en = min(len(rms_list), len(motion_list), st + int(length))
    if en - st < 20:
        return 0.0, "Format B"
    
    window_rms = rms_list[st:en]
    window_motion = motion_list[st:en]
    
    top_audio = np.sort(window_rms)[-5:] if len(window_rms) >= 5 else window_rms
    audio_score = float(np.mean(top_audio))
    norm_audio = max(0.0, min(10.0, (audio_score + 35.0) * (10.0 / 25.0)))
    
    avg_motion = float(np.mean(window_motion)) if window_motion else 5.0
    norm_motion = max(0.0, min(10.0, avg_motion / 3.0))
    
    composite_score = round(0.55 * norm_audio + 0.45 * norm_motion, 2)
    fmt = "Format B" if (avg_motion > 26.0 or audio_score > -14.0) else "Format A"
    return composite_score, fmt

def get_facecam_info(chunk_path):
    cap = cv2.VideoCapture(chunk_path)
    cap.set(cv2.CAP_PROP_POS_FRAMES, 45)
    ret, frame = cap.read()
    cap.release()
    if not ret or frame is None:
        return {"pos": "left", "rect": [12, 160, 166, 97]}
    
    faces = fdetector.find(frame)
    corner = [fc for fc in faces if (fc[0] < 350 or fc[0] > 850) and fc[1] < 450]
    if not corner:
        det = facecam_detect.detect(chunk_path)
        if det.get("found") and det["cam"]["x"] > 0.5:
            return {"pos": "right", "rect": [1104, 235, 156, 91]}
        return {"pos": "left", "rect": [12, 160, 166, 97]}
    
    best = max(corner, key=lambda x: x[4])
    fx, fy, fw, fh = best[0], best[1], best[2], best[3]
    fcy = fy + fh / 2
    
    if fx < 500:
        cam_x, cam_w, cam_h = 12, 166, 97
        cam_y = max(150, min(274 - cam_h, int(fcy - cam_h / 2)))
        return {"pos": "left", "rect": [cam_x, cam_y, cam_w, cam_h]}
    else:
        cam_x, cam_w, cam_h = 1104, 156, 91
        cam_y = max(224, min(348 - cam_h, int(fcy - cam_h / 2)))
        return {"pos": "right", "rect": [cam_x, cam_y, cam_w, cam_h]}

def render_clip(chunk_path, start, length, out_mp4, format_choice, cam_info, bg_music=None, bg_volume=0.08):
    if format_choice == "Format A":
        cam_x, cam_y, cam_w, cam_h = cam_info["rect"]
        h_top = 632
        h_game = 1920 - h_top
        
        pan_keys = track_player(chunk_path, start, length)
        if pan_keys:
            game_filter = f"scale=1080:{h_game}:force_original_aspect_ratio=increase,crop=1080:{h_game}:'{crop_x_expr(pan_keys)}':(ih-{h_game})/2"
        else:
            game_filter = f"scale=1080:{h_game}:force_original_aspect_ratio=increase,crop=1080:{h_game}:(iw-1080)*0.5:(ih-{h_game})/2"

        if bg_music and os.path.isfile(bg_music):
            fg = (
                f"[0:v]setpts=PTS-STARTPTS,split=2[v_game][v_cam];"
                f"[v_cam]crop={cam_w}:{cam_h}:{cam_x}:{cam_y},"
                f"scale=1080:{h_top}:force_original_aspect_ratio=increase,crop=1080:{h_top},setsar=1[cam_scaled];"
                f"[v_game]{game_filter},setsar=1[game_scaled];"
                f"[game_scaled]pad=1080:1920:0:{h_top}:black[base];"
                f"[base][cam_scaled]overlay=0:0[stacked];"
                f"[stacked]drawbox=x=0:y={h_top-2}:w=1080:h=3:color=white@0.4:t=fill[vout];"
                f"[0:a]volume=1.0,asetpts=PTS-STARTPTS[a0];"
                f"[1:a]volume={bg_volume},asetpts=PTS-STARTPTS[a1];"
                f"[a0][a1]amix=inputs=2:duration=first:dropout_transition=2[aout]"
            )
            extra_in = ["-stream_loop", "-1", "-i", os.path.abspath(bg_music)]
        else:
            fg = (
                f"[0:v]setpts=PTS-STARTPTS,split=2[v_game][v_cam];"
                f"[v_cam]crop={cam_w}:{cam_h}:{cam_x}:{cam_y},"
                f"scale=1080:{h_top}:force_original_aspect_ratio=increase,crop=1080:{h_top},setsar=1[cam_scaled];"
                f"[v_game]{game_filter},setsar=1[game_scaled];"
                f"[game_scaled]pad=1080:1920:0:{h_top}:black[base];"
                f"[base][cam_scaled]overlay=0:0[stacked];"
                f"[stacked]drawbox=x=0:y={h_top-2}:w=1080:h=3:color=white@0.4:t=fill[vout];"
                f"[0:a]volume=1.0,asetpts=PTS-STARTPTS[aout]"
            )
            extra_in = []
    else: # Format B
        if bg_music and os.path.isfile(bg_music):
            fg = (
                f"[0:v]setpts=PTS-STARTPTS,split[bg_in][fg_in];"
                f"[bg_in]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=35:5[bg];"
                f"[fg_in]scale=1080:-2,setsar=1[fg];"
                f"[bg][fg]overlay=0:(H-h)/2[vout];"
                f"[0:a]volume=1.0,asetpts=PTS-STARTPTS[a0];"
                f"[1:a]volume={bg_volume},asetpts=PTS-STARTPTS[a1];"
                f"[a0][a1]amix=inputs=2:duration=first:dropout_transition=2[aout]"
            )
            extra_in = ["-stream_loop", "-1", "-i", os.path.abspath(bg_music)]
        else:
            fg = (
                f"[0:v]setpts=PTS-STARTPTS,split[bg_in][fg_in];"
                f"[bg_in]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=35:5[bg];"
                f"[fg_in]scale=1080:-2,setsar=1[fg];"
                f"[bg][fg]overlay=0:(H-h)/2[vout];"
                f"[0:a]volume=1.0,asetpts=PTS-STARTPTS[aout]"
            )
            extra_in = []

    cmd = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-ss", f"{start:.2f}", "-i", os.path.abspath(chunk_path),
        *extra_in,
        "-t", f"{length:.2f}",
        "-filter_complex", fg, "-map", "[vout]", "-map", "[aout]",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
        os.path.abspath(out_mp4)
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    return r.returncode == 0

def main():
    parser = argparse.ArgumentParser(description="Universal Stream Auto-Clipper & Reel Generator")
    parser.add_argument("--url", help="Live stream or VOD URL (Kick, YouTube, Twitch, m3u8)")
    parser.add_argument("--file", help="Local video file path (.mp4, .ts, .mkv)")
    parser.add_argument("--config", default="config.json", help="Path to config.json")
    parser.add_argument("--creator", help="Creator/Streamer name")
    parser.add_argument("--handle", help="Creator social handle")
    parser.add_argument("--game", help="Game or stream category title")
    parser.add_argument("--platform", help="Platform name (KICK.COM, TWITCH, YOUTUBE)")
    parser.add_argument("--count", type=int, default=10, help="Number of clips to extract")
    parser.add_argument("--min-duration", type=float, help="Minimum clip duration (seconds)")
    parser.add_argument("--max-duration", type=float, help="Maximum clip duration (seconds)")
    parser.add_argument("--bg-music", default=os.path.join(HERE, "assets", "bg_music.mp3"), help="Optional background music")
    parser.add_argument("--bg-volume", type=float, help="Background music volume")
    parser.add_argument("--out-dir", default=os.path.join(HERE, "review"), help="Output directory")
    args = parser.parse_args()

    # Load configuration file if present
    cfg = ClipperConfig.load(args.config)
    creator = args.creator or cfg.creator_name
    handle = args.handle or cfg.creator_handle
    game = args.game or cfg.game_title
    platform = args.platform or cfg.platform
    min_dur = args.min_duration or cfg.min_clip_duration
    max_dur = args.max_duration or cfg.max_clip_duration
    bg_vol = args.bg_volume or cfg.bg_music_volume

    os.makedirs(args.out_dir, exist_ok=True)
    thumb_dir = os.path.join(args.out_dir, "thumbnails")
    os.makedirs(thumb_dir, exist_ok=True)
    meta_dir = os.path.join(HERE, "production", "metadata")
    os.makedirs(meta_dir, exist_ok=True)

    print(f"=== Universal Stream Auto-Clipper ===")
    print(f"Creator: {creator} (@{handle}) | Game: {game} | Target: {args.count} clips")
    print(f"Duration: {min_dur}s - {max_dur}s | Output: {args.out_dir}\n")

    input_video = args.file
    if not input_video and args.url:
        print(f"Downloading stream snippet from: {args.url}...")
        work_dir = os.path.join(HERE, "production", "work")
        os.makedirs(work_dir, exist_ok=True)
        input_video = os.path.join(work_dir, "source_stream.mp4")
        dl_cmd = [
            "yt-dlp", "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best",
            "--external-downloader", "ffmpeg",
            "--external-downloader-args", "ffmpeg_i:-t 600",
            "-o", input_video, args.url
        ]
        res = subprocess.run(dl_cmd)
        if res.returncode != 0 or not os.path.isfile(input_video):
            print("Failed to download stream input.")
            return

    if not input_video or not os.path.isfile(input_video):
        print("Error: No valid input video provided. Use --file <path> or --url <url>.")
        return

    print(f"Analyzing audio/motion signals on {input_video}...")
    rms_list, motion_list = scan_chunk_signals(input_video)
    total_len = min(len(rms_list), len(motion_list))
    if total_len < 30:
        print(f"Video is too short ({total_len}s) to extract 30s+ clips.")
        return

    print("Detecting streamer webcam...")
    cam_info = get_facecam_info(input_video)
    print(f"Webcam detected at: {cam_info['pos']} side {cam_info['rect']}\n")

    # Slide window across the video to rank candidates
    step = 5
    candidates = []
    for t in range(0, total_len - int(min_dur), step):
        dyn_len = compute_dynamic_duration(rms_list, motion_list, t, min_dur, max_dur)
        score, fmt = evaluate_window_score(rms_list, motion_list, t, dyn_len)
        if score > 0:
            candidates.append({
                "start": float(t),
                "length": float(dyn_len),
                "score": score,
                "format": fmt
            })

    # Sort descending by energy score
    candidates.sort(key=lambda c: c["score"], reverse=True)

    # Non-maximum suppression (avoid overlapping clips)
    selected = []
    for cand in candidates:
        overlap = False
        for s in selected:
            if not (cand["start"] + cand["length"] <= s["start"] + 10 or cand["start"] >= s["start"] + s["length"] - 10):
                overlap = True
                break
        if not overlap:
            selected.append(cand)
            if len(selected) >= args.count:
                break

    print(f"Selected top {len(selected)} high-energy moments:")
    for i, c in enumerate(selected, 1):
        print(f"  #{i:02d}: Start {c['start']:6.1f}s | Length {c['length']:4.1f}s | Score {c['score']:4.1f}/10 | {c['format']}")

    # Render clips, generate thumbnails, and record catalog
    csv_rows = []
    csv_path = os.path.join(args.out_dir, "clips_summary.csv")
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for i, c in enumerate(selected, 1):
        filename = f"clip-{i:02d}.mp4"
        out_mp4 = os.path.join(args.out_dir, filename)
        thumb_name = f"clip-{i:02d}.jpg"
        out_thumb = os.path.join(thumb_dir, thumb_name)

        print(f"\n[{i}/{len(selected)}] Rendering {filename} ({c['length']}s)...")
        success = render_clip(
            input_video, c["start"], c["length"], out_mp4,
            c["format"], cam_info,
            bg_music=args.bg_music, bg_volume=bg_vol
        )

        if not success:
            print(f"Failed to render {filename}")
            continue

        print(f"Generating thumbnail {thumb_name}...")
        generate_thumbnail(
            out_mp4, c["format"], out_thumb,
            creator_name=creator,
            game_title=game,
            handle=handle,
            platform=platform
        )

        title = f"{creator.title()} INSANE {game.upper()} MOMENT! 🔥"
        caption = f"Highlight from {creator}'s stream! #gaming #{game.lower().replace(' ', '')} #shorts #reels"

        # Save metadata JSON
        meta = {
            "clip_id": f"clip-{i:02d}",
            "filename": filename,
            "title": title,
            "caption": caption,
            "start": c["start"],
            "length": c["length"],
            "score": c["score"],
            "format": c["format"],
            "creator": creator,
            "game": game,
            "platform": platform,
            "rendered_at": now_str
        }
        meta_file = os.path.join(meta_dir, f"clip-{i:02d}.json")
        with open(meta_file, "w") as f:
            json.dump(meta, f, indent=2)

        csv_rows.append([
            str(i), filename, title, caption, now_str,
            input_video, c["format"], str(c["score"]), out_thumb
        ])

    # Write summary CSV
    with open(csv_path, "w") as f:
        f.write("sno,name of file,title,caption,date and time of clipping,orginal source of the clip,format,highlight_score,thumbnail\n")
        for r in csv_rows:
            escaped = [f'"{col}"' if ',' in col else col for col in r]
            f.write(",".join(escaped) + "\n")

    print(f"\nDone! Rendered {len(csv_rows)} clips with companion thumbnails.")
    print(f"Catalog saved to: {csv_path}")

if __name__ == "__main__":
    main()
