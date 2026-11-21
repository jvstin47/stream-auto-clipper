# stream-auto-clipper

An automated pipeline and agent skill for generating vertical short-form video highlights from live streams and long-form video files.

## Features

- **Multimodal Peak Detection**: Combines audio loudness analysis with computer vision frame motion variance to find peak action moments.
- **Dynamic Clip Durations**: Adjusts clip lengths between 30 and 75 seconds depending on action continuity.
- **Vertical 9:16 Video Synthesis**:
  - Stacked layout: Streamer facecam cropped to the top third, gameplay tracking on the bottom two thirds.
  - Landscape fit: Center gameplay with dynamically blurred background padding.
  - Smooth audio mixing with background music ducking.
- **Thumbnail Generation**: Automated cover frame extraction with color grading, bold typography, and safe zone constraints for mobile social platforms.
- **Social Media Publishing**: Multi-platform publishing support via social media APIs.

## Quick Start

```bash
# 1. Install dependencies
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 2. Configure settings
cp config.example.json config.json

# 3. Run clipper
python stream_clipper.py --file input.mp4 --count 5
```

## Repository Structure

- `stream_clipper.py`: Main highlight detection and video synthesis script.
- `thumbnail_engine.py`: Standalone thumbnail generation tool.
- `zernio_publish.py`: Cross-platform publishing integration.
- `clipper_config.py`: Configuration schema and loader.
- `skills/stream-auto-clipper/`: Agent skill instructions.

## License

MIT
