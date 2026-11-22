"""Schedule one reviewed clip to YouTube and Instagram through Zernio.

Supports single and multi-channel architectures with cross-account deduplication,
dynamic caption routing, and analytics telemetry.

Dry-run by default. Publishing requires --publish; posting unreviewed metadata
also requires the explicit unattended configuration described in the README.
"""
import argparse
import datetime as dt
import json
import os
import sys
import uuid
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

import requests

API = "https://zernio.com/api/v1"
IST = dt.timezone(dt.timedelta(hours=5, minutes=30))
PLATFORMS = (
    ("youtube", "ZERNIO_YOUTUBE_ACCOUNT_ID"),
    ("instagram", "ZERNIO_INSTAGRAM_ACCOUNT_ID"),
)


def load_metadata(path):
    with path.open(encoding="utf-8") as file:
        metadata = json.load(file)
    if not metadata.get("title") or not metadata.get("youtube_description") or not metadata.get("instagram_caption"):
        raise ValueError("metadata needs a title, YouTube description, and Instagram caption")
    if metadata.get("test"):
        raise ValueError("test clips cannot be published")
    return metadata


def scheduled_local_time(value):
    when = dt.datetime.fromisoformat(value)
    if when.tzinfo is None:
        raise ValueError("schedule time must include a timezone offset, e.g. 2026-11-18T12:00:00+05:30")
    return when.astimezone(IST).replace(tzinfo=None).isoformat(timespec="seconds")


def post_body(metadata, public_url, accounts, schedule, thumb_url=None):
    platforms = []
    for platform, account_id in accounts:
        entry = {"platform": platform, "accountId": account_id}
        if platform == "youtube":
            entry["customContent"] = metadata["youtube_description"]
            entry["platformSpecificData"] = {
                "title": metadata["title"][:100],
                "visibility": "public",
                "categoryId": "20",
                "madeForKids": False,
            }
        else:
            entry["customContent"] = metadata["instagram_caption"]
        platforms.append(entry)
    media_item = {"url": public_url, "type": "video"}
    if thumb_url:
        media_item["thumbnail"] = thumb_url
        media_item["instagramThumbnail"] = thumb_url
    body = {
        "content": metadata["instagram_caption"],
        "mediaItems": [media_item],
        "platforms": platforms,
        "timezone": "Asia/Kolkata",
    }
    if schedule == "now":
        body["publishNow"] = True
    else:
        body["scheduledFor"] = schedule
    return body


def upload_and_schedule(video_path, metadata_path, metadata, accounts, schedule, api_key, account_tag="default"):
    headers = {"Authorization": f"Bearer {api_key}"}
    with video_path.open("rb") as file:
        size = os.fstat(file.fileno()).st_size
    presign = requests.post(
        f"{API}/media/presign", headers=headers,
        json={"filename": video_path.name, "contentType": "video/mp4", "size": size}, timeout=60,
    )
    presign.raise_for_status()
    upload = presign.json()
    with video_path.open("rb") as file:
        requests.put(upload["uploadUrl"], data=file, headers={"Content-Type": "video/mp4"}, timeout=900).raise_for_status()

    thumb_candidates = [
        video_path.parent / "thumbnails" / f"{video_path.stem}.jpg",
        Path("review/thumbnails") / f"{video_path.stem}.jpg",
        Path("production/thumbnails") / f"{video_path.stem}.jpg",
    ]
    thumb_path = next((p for p in thumb_candidates if p.is_file()), None)
    thumb_url = None
    if thumb_path:
        try:
            with thumb_path.open("rb") as f:
                tsize = os.fstat(f.fileno()).st_size
            t_pre = requests.post(
                f"{API}/media/presign", headers=headers,
                json={"filename": thumb_path.name, "contentType": "image/jpeg", "size": tsize}, timeout=60,
            )
            if t_pre.ok:
                t_up = t_pre.json()
                with thumb_path.open("rb") as f:
                    requests.put(t_up["uploadUrl"], data=f, headers={"Content-Type": "image/jpeg"}, timeout=300).raise_for_status()
                thumb_url = t_up.get("publicUrl")
        except Exception as e:
            print(f"Warning: could not upload thumbnail ({e})")

    platform_suffix = "_".join(p for p, _ in accounts)
    key_name = f"zernio_idempotency_key_{platform_suffix}" if len(accounts) == 1 else "zernio_idempotency_key"
    idempotency_key = metadata.get(key_name) or str(uuid.uuid4())
    metadata[key_name] = idempotency_key
    metadata["zernio_idempotency_key"] = idempotency_key
    with metadata_path.open("w", encoding="utf-8") as file:
        json.dump(metadata, file, ensure_ascii=False, indent=2)
    response = requests.post(
        f"{API}/posts", headers={**headers, "Idempotency-Key": idempotency_key},
        json=post_body(metadata, upload["publicUrl"], accounts, schedule, thumb_url=thumb_url), timeout=300,
    )
    response.raise_for_status()
    result = response.json().get("post", {})
    post_id = result.get("_id")
    if not post_id:
        raise RuntimeError("Zernio did not return a post ID; check the Zernio dashboard before retrying")
    metadata["zernio_post_id"] = post_id
    metadata[f"zernio_{account_tag}_post_id"] = post_id
    for platform, _ in accounts:
        metadata[f"zernio_{platform}_post_id"] = post_id
    metadata["zernio_status"] = result.get("status", "accepted")
    metadata["scheduled_for"] = result.get("scheduledFor") or schedule
    with metadata_path.open("w", encoding="utf-8") as file:
        json.dump(metadata, file, ensure_ascii=False, indent=2)
    return result


def fetch_insights(api_key, post_id):
    """Fetch live analytics and engagement metrics from Zernio."""
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        res = requests.get(f"{API}/posts/{post_id}/analytics", headers=headers, timeout=30)
        if res.status_code == 200:
            return res.json()
        # Fallback to post details
        p_res = requests.get(f"{API}/posts/{post_id}", headers=headers, timeout=30)
        if p_res.status_code == 200:
            return p_res.json()
    except Exception as e:
        print(f"Error fetching insights: {e}")
    return None


def main():
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")  # Windows consoles default to cp1252
        except (AttributeError, ValueError):
            pass
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("clip", type=Path, help="clip path without extension or path to its .mp4/.json")
    parser.add_argument("--scheduled-for", help="ISO time with offset, for example 2026-11-18T12:00:00+05:30")
    parser.add_argument("--now", action="store_true", help="publish immediately instead of scheduling")
    parser.add_argument("--publish", action="store_true", help="send the post to Zernio; otherwise only preview")
    parser.add_argument("--platform", choices=["all", "instagram", "youtube"], default="all", help="target platform (default: all)")
    parser.add_argument("--account", default="default", help="target account profile key (e.g. phoenix, carbon, primary)")
    parser.add_argument("--unattended", action="store_true", help="allow unreviewed metadata after one-time opt-in")
    parser.add_argument("--insights", action="store_true", help="fetch live performance metrics for an already-published clip")
    args = parser.parse_args()

    base = args.clip.with_suffix("") if args.clip.suffix.lower() in {".mp4", ".json"} else args.clip
    video_path, metadata_path = base.with_suffix(".mp4"), base.with_suffix(".json")
    if not metadata_path.is_file():
        alt_meta = Path("production/metadata") / f"{base.name}.json"
        if alt_meta.is_file():
            metadata_path = alt_meta

    if not metadata_path.is_file():
        sys.exit(f"Metadata file not found: {metadata_path}")

    try:
        metadata = load_metadata(metadata_path)
    except (OSError, ValueError, json.JSONDecodeError) as error:
        sys.exit(str(error))

    api_key = os.environ.get("ZERNIO_API_KEY")

    # Insights query mode
    if args.insights:
        if not api_key:
            sys.exit("Set ZERNIO_API_KEY in your private environment to query insights.")
        post_id = metadata.get("zernio_post_id") or metadata.get(f"zernio_{args.account}_post_id")
        if not post_id:
            sys.exit(f"Clip {base.name} has not been published yet (no post ID found).")
        print(f"Fetching live telemetry for {base.name} (Post ID: {post_id})...")
        insights = fetch_insights(api_key, post_id)
        if insights:
            print(json.dumps(insights, indent=2))
        else:
            print("No analytics data currently returned by API (may be pending Meta cache window).")
        return

    if not video_path.is_file():
        sys.exit(f"Video file not found: {video_path}")

    schedule = "now" if args.now else (scheduled_local_time(args.scheduled_for) if args.scheduled_for else None)
    if args.now and args.scheduled_for:
        sys.exit("Use either --now or --scheduled-for, not both.")
    if args.unattended and args.now:
        sys.exit("Unattended mode only schedules future posts; it cannot publish immediately.")
    if args.publish and not schedule:
        sys.exit("Choose --scheduled-for or --now before publishing.")

    # Multi-account duplicate prevention & caption routing
    account_key = args.account.lower()
    ig_var = f"ZERNIO_INSTAGRAM_ACCOUNT_ID_{account_key.upper()}"
    ig_account_id = os.environ.get(ig_var) or os.environ.get("ZERNIO_INSTAGRAM_ACCOUNT_ID")

    # Anti-collision cross-account guardrails
    if metadata.get(f"zernio_{account_key}_post_id"):
        sys.exit(f"This clip already has a Zernio {account_key} post ID ({metadata[f'zernio_{account_key}_post_id']}); check status before retrying.")

    for k, v in metadata.items():
        if k.startswith("zernio_") and k.endswith("_post_id") and k != f"zernio_{account_key}_post_id" and k not in ("zernio_post_id", "zernio_instagram_post_id", "zernio_youtube_post_id"):
            other_acc = k.replace("zernio_", "").replace("_post_id", "")
            if other_acc != account_key:
                sys.exit(f"DUPLICATE PREVENTION: This clip was already published to '{other_acc}' (ID: {v}). Each account must receive 100% unique clips!")

    if not metadata.get("approved") and not args.unattended:
        sys.exit("Clip metadata is not approved. Review it, or configure unattended posting and pass --unattended.")
    if args.unattended and os.environ.get("GTA_UNATTENDED_POSTS") != "1":
        sys.exit("Set GTA_UNATTENDED_POSTS=1 in your private environment to enable unattended publishing.")

    accounts = []
    if args.platform in ("all", "youtube"):
        yt_id = os.environ.get("ZERNIO_YOUTUBE_ACCOUNT_ID", "")
        if yt_id:
            accounts.append(("youtube", yt_id))
    if args.platform in ("all", "instagram"):
        if ig_account_id:
            accounts.append(("instagram", ig_account_id))

    if args.publish and not accounts:
        sys.exit(f"Target platform account for '{args.platform}' ({account_key}) is not configured in your environment.")
    if args.publish and not api_key:
        sys.exit("Set ZERNIO_API_KEY in your private environment. Do not put it in a prompt or source file.")

    destinations = f"{', '.join(p for p, _ in accounts)} ({account_key})"
    plan = f"{base.name}: {schedule or 'DRY RUN — no schedule sent'} -> {destinations}"
    print(plan)
    if not args.publish:
        print("No post sent. Add --publish to schedule or publish this clip.")
        return
    try:
        post = upload_and_schedule(video_path, metadata_path, metadata, accounts, schedule, api_key, account_tag=account_key)
    except requests.HTTPError as error:
        status = error.response.status_code if error.response is not None else "unknown"
        sys.exit(f"Zernio returned HTTP {status}. Check the Zernio dashboard before retrying.")
    except requests.RequestException as error:
        sys.exit(f"Zernio request failed ({type(error).__name__}). Check the Zernio dashboard before retrying.")
    print(f"Zernio accepted post {post['_id']} with status {post.get('status', 'accepted')}.")


if __name__ == "__main__":
    main()
