"""Universal configuration loader for stream auto-clipping and short-form video generation."""
import os, json
from dataclasses import dataclass, field
from typing import List, Optional

HERE = os.path.dirname(os.path.abspath(__file__))

@dataclass
class ClipperConfig:
    # Creator & Game Branding
    creator_name: str = "CREATOR"
    creator_handle: str = "creator"
    game_title: str = "GAMEPLAY"
    platform: str = "STREAM" # Kick, Twitch, YouTube, etc.
    
    # Audio & Video Rendering
    min_clip_duration: float = 30.0
    max_clip_duration: float = 75.0
    format_preference: str = "auto" # "auto", "Format A" (stacked), "Format B" (blurred fit)
    bg_music_path: Optional[str] = os.path.join(HERE, "assets", "bg_music.mp3")
    bg_music_volume: float = 0.08
    
    # Paths
    output_dir: str = os.path.join(HERE, "review")
    work_dir: str = os.path.join(HERE, "production", "work")
    metadata_dir: str = os.path.join(HERE, "production", "metadata")
    fonts_dir: str = os.path.join(HERE, "production", "fonts")
    
    # Thumbnail styling
    thumb_main_color: str = "#FFFFFF"
    thumb_accent_color: str = "#FFDD00" # Electric gold
    thumb_badge_color: str = "#E10A19"  # High-energy gaming red
    
    @classmethod
    def load(cls, config_path: Optional[str] = None) -> "ClipperConfig":
        cfg = cls()
        candidates = [
            config_path,
            os.path.join(HERE, "config.json"),
            os.path.join(HERE, "config.example.json")
        ]
        target = next((c for c in candidates if c and os.path.isfile(c)), None)
        if target:
            try:
                with open(target, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for k, v in data.items():
                        if hasattr(cfg, k):
                            setattr(cfg, k, v)
            except Exception as e:
                print(f"Warning: could not read {target}: {e}")
        return cfg
