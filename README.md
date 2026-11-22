# stream-auto-clipper

An automated pipeline and agent skill for generating vertical short-form video highlights from live streams and long-form video files, complete with multimodal highlight detection, 9:16 video synthesis, 1:1 mobile safe-zone cover thumbnails, and multi-channel social media dispatch.

Battle-tested in high-volume production across multi-account creator networks, breaking **100,000+ views** with zero frozen frames and sub-pixel typography alignment.

---

## Key Features

- **Multimodal Peak Detection**: Combines rolling 16-bit PCM decibel loudness analysis (RMS peaks) with OpenCV frame motion variance to pinpoint genuine high-energy moments.
- **Dynamic Clip Durations (30s – 75s)**: Eliminates rigid, unnatural cutoffs by evaluating audio and motion continuity past 30 seconds to preserve jokes and clutch endings.
- **Vertical 9:16 Video Synthesis**:
  - **Format A (Stacked 9:16)**: Streamer facecam detected via ONNX YuNet, tightly cropped to $1.7088$ aspect ratio, scaled across the top 33%, with optical-flow gameplay tracking on the bottom 67%.
  - **Format B (Landscape Fit)**: 16:9 gameplay vertically centered with dynamically scaled, box-blurred background padding.
  - **Smooth Audio Mixing**: Stream commentary normalized with subtle non-copyright background music ducking (2s smooth fade transitions).
  - **Zero Initial Freeze**: Normalized PTS timestamps (`setpts=PTS-STARTPTS`) eliminate start-frame stutter.
- **1:1 Mobile Safe-Zone Thumbnail Studio**:
  - Mathematical glyph bounding box centering with 4-layer 3D drop shadow.
  - **Chest Safe-Zone Placement** ($Y \in [1380, 1560]$) prevents overlap with top game logos and lower mobile Reels player overlays.
  - **Dynamic Category Badging**: Chromatic color palettes mapped to content keywords (Pursuit, Combat, Stealth, Speed, Heist).
- **Multi-Channel Dispatch & Anti-Collision Engine**:
  - Independent channel routing (`--account <name>`) supporting parallel brand accounts (e.g. `@phoenix.clippy`, `@carbon.clippy`).
  - Strict pre-flight cross-account deduplication blocking double-posts across accounts.
  - Dynamic caption handle routing with optimized above-the-fold Follow CTAs (<110 characters).
  - Built-in live telemetry CLI (`--insights`) to monitor view counts and engagement.

---

## Architecture Overview

```
[Live Stream / Long-Form VOD / Local File]
                    │
                    ▼
       [Multimodal Signal Analyzer]
       ├─ Rolling 16-bit PCM RMS Peak Audio
       └─ OpenCV Inter-frame Motion Deltas
                    │
                    ▼
          [Highlight Extraction]
       ├─ Non-Maximum Temporal Suppression
       └─ Adaptive Duration Window (30s–75s)
                    │
                    ▼
         [9:16 Synthesis Engine]
       ├─ YuNet Facecam Detection & Auto-Crop
       ├─ Centered Gameplay Tracking
       └─ Audio Normalization & Music Ducking
                    │
                    ▼
     [1:1 Safe-Zone Thumbnail Generator]
       ├─ Contrast & Saturation Color Grading
       ├─ 3D Display Typography (125pt–150pt)
       └─ Lower Chest Safe-Zone Text Placement
                    │
                    ▼
      [Multi-Channel Dispatcher (Zernio)]
       ├─ Channel Account Routing & Dedup Guards
       ├─ High-Converting First-Line Follow CTAs
       └─ Live Telemetry & Insights Monitoring
```

---

## Quick Start

### 1. Installation

```bash
git clone https://github.com/jvstin47/stream-auto-clipper.git
cd stream-auto-clipper

python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

*System requirements: `ffmpeg`, `ffprobe`, and Python 3.10+.*

### 2. Configuration

Create your local configuration:

```bash
cp config.example.json config.json
```

```json
{
  "creator_name": "EAGLE GAMING",
  "creator_handle": "eaglegaming",
  "game_title": "GTA 6",
  "platform": "KICK.COM",
  "min_clip_duration": 30.0,
  "max_clip_duration": 75.0,
  "format_preference": "auto",
  "bg_music_volume": 0.08,
  "thumb_main_color": "#FFFFFF",
  "thumb_accent_color": "#FFDD00",
  "thumb_badge_color": "#E10A19"
}
```

### 3. Generate Highlights

```bash
# Process a video file and extract the top 5 highlights
python stream_clipper.py --file gameplay.mp4 --count 5
```

---

## Thumbnail Studio

Render esports-grade cover thumbnails with exact mathematical centering and mobile safe-zone bounds:

```bash
# Generate cover from an MP4 highlight frame
python thumbnail_engine.py clip.mp4 --format "Format B" --creator "EAGLE GAMING" --game "GTA 6"

# Generate with chest safe-zone layout for custom hero artwork
python thumbnail_engine.py --format "SafeZone Hero" --base-image cover_art.png --hook "SUBWAY SHOOTOUT" --out thumb.jpg
```

### 1:1 Safe-Zone Formula
On mobile Instagram feeds and YouTube Shorts shelves, vertical covers (1080×1920) are cropped to a square (1:1) or 4:5 aspect ratio. By anchoring text inside $Y \in [1380, 1560]$, titles remain 100% visible across:
- Fullscreen 9:16 Reels playback (above bottom captions).
- Profile 1:1 grid previews.
- Discover & Explore 4:5 recommendation carousels.

---

## Multi-Channel Dispatch & Telemetry

Schedule or post directly to social media networks using `zernio_publish.py`:

```bash
# 1. Dry-run preview
python zernio_publish.py production/gta-clip-01.mp4 --now

# 2. Publish to primary channel
python zernio_publish.py production/gta-clip-01.mp4 --now --publish --account phoenix

# 3. Publish to secondary channel with anti-collision duplicate guards
python zernio_publish.py production/gta-clip-26.mp4 --now --publish --account carbon

# 4. Check live performance metrics & telemetry
python zernio_publish.py production/gta-clip-20.mp4 --insights
```

### Multi-Account Environment Setup
Configure your private `.env` file (never commit API keys):

```env
ZERNIO_API_KEY=your_zernio_api_key
ZERNIO_YOUTUBE_ACCOUNT_ID=your_youtube_account_id
ZERNIO_INSTAGRAM_ACCOUNT_ID_PHOENIX=your_phoenix_account_id
ZERNIO_INSTAGRAM_ACCOUNT_ID_CARBON=your_carbon_account_id
```

---

## Repository Structure

```
.
├── config.json                     # Active branding & render settings
├── config.example.json             # Configuration template
├── clipper_config.py               # Config loader module
├── stream_clipper.py               # Universal highlight & video synthesis engine
├── thumbnail_engine.py             # Mathematical pro thumbnail generator
├── zernio_publish.py               # Multi-channel social media scheduler & telemetry
├── player_track.py                 # In-game protagonist tracking
├── facecam_detect.py               # ONNX YuNet corner facecam locator
├── skills/stream-auto-clipper/     # Agent skill instructions (SKILL.md)
└── src/                            # Documentation website (Vite + React + Tailwind)
```

---

## Acknowledgements & Credits

This project builds upon ideas and techniques explored in several open-source projects:

- **[GTA-Auto-Clipper](https://github.com/AnIntellectualBeing/GTA-Auto-Clipper)** by AnIntellectualBeing: Live stream ingest pipelines and initial audio chunking architectures.
- **[neonclipping](https://github.com/iamajmeena/neonclipping)** by iamajmeena: Stacked vertical video layout patterns and corner facecam detection techniques.
- **[youtube-instagram-auto-uploader](https://github.com/Abhinavkumar-07/youtube-instagram-auto-uploader)** by Abhinavkumar-07: Reference patterns for cross-platform social media dispatch.
- **[OpenCV Model Zoo](https://github.com/opencv/opencv_zoo)**: The lightweight YuNet ONNX face detection model.

---

## License

MIT © [Justin Joe Mathew](https://github.com/jvstin47)
