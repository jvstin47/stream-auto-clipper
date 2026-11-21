---
name: stream-auto-clipper
description: >-
  Automated pipeline to find peak moments in live streams or long-form gaming VODs,
  render high-energy 9:16 vertical short-form reels (stacked facecam or blurred fit),
  generate mobile-safe pro gaming thumbnails, and schedule cross-platform social publishing.
---

# Stream Auto-Clipper & Short-Form Video Automation Skill

A universal, production-ready framework to ingest any live stream or VOD (YouTube, Twitch, Kick, or local files), automatically detect high-energy gameplay highlights, render mobile-optimized 9:16 vertical videos, produce esports-grade cover thumbnails, and publish across social media.

---

## 1. Architecture Overview

```
[Live Stream / VOD / Local Video]
               │
               ▼
   [Audio & Motion Signal Analysis]
   ├─ PCM Decibel Loudness (RMS Peaks)
   └─ OpenCV Frame Motion Matrix
               │
               ▼
     [Top Highlight Selection]
   ├─ Dynamic Duration (30s – 75s)
   └─ Non-Maximum Temporal Suppression
               │
               ▼
      [Video Filter Synthesis]
   ├─ Format A: Stacked 9:16 (Top 33% YuNet Facecam + Bottom 67% Centered Gameplay)
   ├─ Format B: Landscape 16:9 in Center + Dynamic Boxblurred Backdrop
   └─ Audio Ducking (Streamer Commentary + Subtle Background Music)
               │
               ▼
    [Pro Thumbnail Engine]
   ├─ Contrast & Saturation Boost + Edge Vignette
   ├─ Stacked 150pt Display Typography with 3D Drop Shadow
   └─ 1:1 Instagram Grid Safe Zone Placement
               │
               ▼
  [Cross-Platform Dispatch via Zernio]
   ├─ YouTube Shorts (Auto Thumbnail)
   ├─ Instagram Reels (Cover bound at publish)
   └─ TikTok & Social Channels
```

---

## 2. Prerequisites & Setup

### System Dependencies
- Python 3.10+
- `ffmpeg` & `ffprobe` installed and available in PATH.
- `node` or `bun` (required by `yt-dlp` for YouTube extraction).

### Python Virtual Environment
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install pillow requests python-dotenv zernio-sdk
```

---

## 3. Configuration (`config.json`)

Configure your channel, streamer branding, and rendering parameters in `config.json` (or copy from `config.example.json`):

```json
{
  "creator_name": "SHROUD",
  "creator_handle": "shroud",
  "game_title": "VALORANT",
  "platform": "TWITCH.TV",
  "min_clip_duration": 30.0,
  "max_clip_duration": 75.0,
  "format_preference": "auto",
  "bg_music_volume": 0.08,
  "thumb_main_color": "#FFFFFF",
  "thumb_accent_color": "#FFDD00",
  "thumb_badge_color": "#E10A19"
}
```

---

## 4. End-to-End Workflow

### Step 1: Ingest Stream & Detect Highlights
The highlight finder extracts raw 16-bit PCM audio and scans motion deltas across sliding windows:
- **Audio Score**: Average of top 5 loudest seconds in the window normalized against background noise:
  $$\text{Norm}_{\text{audio}} = \text{clamp}\left((\text{dB} + 35) \times \frac{10}{25}, 0, 10\right)$$
- **Motion Score**: Mean pixel variance across successive grayscale frames:
  $$\text{Norm}_{\text{motion}} = \text{clamp}\left(\frac{\Delta \text{motion}}{3.0}, 0, 10\right)$$
- **Composite Peak Energy**:
  $$\text{Score} = 0.55 \times \text{Norm}_{\text{audio}} + 0.45 \times \text{Norm}_{\text{motion}}$$

### Step 2: Dynamic Duration (30s – 75s)
Clips are not forced into rigid, unnatural cutoffs. The duration engine evaluates energy continuity past 30 seconds:
- If audio loudness remains above $-24\text{ dB}$ or motion remains above $13.0$, the clip extends in 5-second steps up to **75 seconds**.
- Short stunts or punchy jokes naturally conclude around **30s–40s**.

### Step 3: Multi-Format 9:16 Video Rendering
The rendering engine automatically chooses the optimal layout:
- **Format A (Stacked 9:16)**:
  - Streamer webcam detected using ONNX `YuNet` in upper-left or upper-right corners.
  - Webcam tightly cropped to a $1.7088$ aspect ratio, centered on the streamer's face, and scaled across the top 33% (`y = 0..632`).
  - Gameplay scaled and centered across the bottom 67% (`y = 632..1920`) with optical-flow player tracking.
  - A clean 3px white accent line separates the two windows.
- **Format B (Blurred Landscape Fit)**:
  - 16:9 gameplay placed in the exact vertical center (`y = 656..1264`).
  - The upper and lower letterbox bands are filled by a dynamically scaled, box-blurred ($35:5$) replica of the background video.
- **Audio Mix**:
  - Stream commentary normalized at volume $1.0$.
  - Subtle non-copyright background music mixed at volume $0.08$ with a 2s dropout transition.
  - **Zero Initial Freeze**: Filter includes `setpts=PTS-STARTPTS` on inputs to eliminate frozen starting frames.

### Step 4: Pro Gaming Thumbnail Generation
Generates a companion high-impact thumbnail for every clip:
- **Color Grading**: $+25\%$ contrast, $+30\%$ color saturation, $+3\%$ brightness.
- **Vignette**: Top and bottom dark gradient falloff for cinematic contrast.
- **Esports Typography**:
  - **Kanit Black 150pt** stacked text: Line 1 in pure white, Line 2 in electric gold (`#FFDD00`).
  - 4-layer 3D drop shadow (`(0, 0, 0, 210)`) + 9px solid black outer stroke.
  - Symmetrical angled polygon badge: `{GAME} • OFFICIAL HIGHLIGHT`.
  - Bottom frosted callout pill with red live dot: `{PLATFORM} / {HANDLE}`.
- **1:1 Grid Safe Zones**:
  - All text is strictly bounded within $Y = 420\text{ to }1500$, ensuring zero text truncation when viewed in Instagram profile grids or YouTube Shorts shelves.
  - Mathematical bounding box centering:
    $$\Delta x = c_x - \frac{w}{2} - \text{bbox}_0, \quad \Delta y = c_y - \frac{h}{2} - \text{bbox}_1$$

### Step 5: Multi-Platform Publishing (Zernio)
Cross-post instantly or schedule to Instagram Reels and YouTube Shorts:
```bash
# Preview post payload (dry-run)
python zernio_publish.py review/gta-clip-01.mp4 --now

# Publish live to Instagram only
python zernio_publish.py review/gta-clip-01.mp4 --now --publish --platform instagram

# Publish live to both Instagram and YouTube
python zernio_publish.py review/gta-clip-01.mp4 --now --publish
```

---

## 5. File & Directory Structure

```
.
├── config.json                     # Active branding & render settings
├── config.example.json             # Template configuration
├── clipper_config.py               # Config loader module
├── stream_clipper.py               # Universal highlight & video engine
├── thumbnail_engine.py             # Mathematical pro thumbnail generator
├── zernio_publish.py               # Universal social media scheduler
├── player_track.py                 # In-game protagonist tracking
├── facecam_detect.py               # ONNX YuNet corner facecam locator
├── assets/
│   └── bg_music.mp3                # Non-copyright subtle background audio
├── production/
│   ├── fonts/                      # Display typography (Kanit, Russo One, Bebas)
│   ├── metadata/                   # JSON descriptors for all rendered clips
│   └── work/                       # Downloaded stream TS chunks
└── review/
    ├── clips_summary.csv           # Complete production master catalog
    ├── thumbnails/                 # 1080x1920 pro cover JPEGs
    └── *.mp4                       # Rendered 1080x1920 highlight reels
```

---

## 6. Verification Checklist

Before releasing or publishing any batch:
1. **Initial Frame Check**: Verify that `ffprobe` reports `0.00s` frozen frames at video start.
2. **Audio Sync**: Ensure commentary is clear, intelligible, and background music does not overpower dialogue.
3. **Facecam Centering**: In Format A, confirm the streamer's face is centered in the top 33% without HUD overlap.
4. **Thumbnail Crop Safe**: Check that all text sits inside the vertical $Y \in [420, 1500]$ boundary.
5. **Catalog Sync**: Verify that `review/clips_summary.csv` accurately references the video file, title, score, and thumbnail path.
