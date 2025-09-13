import os
import sys
import json
import argparse
import requests
from urllib.parse import urljoin, urlparse
from dotenv import load_dotenv

load_dotenv()

DEFAULT_BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:5000/")


def pretty(obj):
    try:
        return json.dumps(obj, indent=2, ensure_ascii=False)
    except Exception:
        return str(obj)


def test_index(base_url: str):
    url = urljoin(base_url, "/")
    r = requests.get(url)
    r.raise_for_status()
    print("[INDEX]", pretty(r.json()))


def test_audio(base_url: str, audio_path: str, save_audio: bool = False, save_dir: str = "downloads"):
    url = urljoin(base_url, "/audio")
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")
    files = {"audio": (os.path.basename(audio_path), open(audio_path, "rb"))}
    try:
        r = requests.post(url, files=files)
    finally:
        files["audio"][1].close()
    r.raise_for_status()
    data = r.json()
    print("[AUDIO]", pretty(data))

    # Optionally download synthesized audio
    full_play_url = data.get("full_play_url")
    if save_audio and full_play_url:
        os.makedirs(save_dir, exist_ok=True)
        out_name = os.path.join(save_dir, os.path.basename(urlparse(full_play_url).path))
        ar = requests.get(full_play_url)
        ar.raise_for_status()
        with open(out_name, "wb") as f:
            f.write(ar.content)
        print(f"[AUDIO] Saved synthesized audio to: {out_name}")


def test_image(base_url: str, prompt: str, image_path: str):
    url = urljoin(base_url, "/image")
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image file not found: {image_path}")
    files = {"image": (os.path.basename(image_path), open(image_path, "rb"))}
    data = {"prompt": prompt}
    try:
        r = requests.post(url, data=data, files=files)
    finally:
        files["image"][1].close()
    r.raise_for_status()
    print("[IMAGE]", pretty(r.json()))


def test_play_audio(base_url: str, filename: str, save_path: str = None):
    # Direct GET to play endpoint
    url = urljoin(base_url, f"/api/play_audio/{filename}")
    r = requests.get(url)
    if r.status_code == 404:
        print("[PLAY] Audio not found on server")
        return
    r.raise_for_status()
    if save_path:
        with open(save_path, "wb") as f:
            f.write(r.content)
        print(f"[PLAY] Saved audio to: {save_path}")
    else:
        print(f"[PLAY] OK, received {len(r.content)} bytes")


def build_parser():
    p = argparse.ArgumentParser(description="Client tester for Nepali AI Companion backend")
    p.add_argument("--base-url", default=DEFAULT_BASE_URL, help=f"Base URL of the server (default: {DEFAULT_BASE_URL})")

    sub = p.add_subparsers(dest="cmd", required=True)

    sp_idx = sub.add_parser("index", help="Test GET /")

    sp_audio = sub.add_parser("audio", help="Test POST /audio with an audio file")
    sp_audio.add_argument("audio", help="Path to audio file (wav/mp3)")
    sp_audio.add_argument("--save-audio", action="store_true", help="Download synthesized audio to downloads/")

    sp_img = sub.add_parser("image", help="Test POST /image with prompt and image")
    sp_img.add_argument("prompt", help="Prompt/question for image")
    sp_img.add_argument("image", help="Path to image file")

    sp_play = sub.add_parser("play", help="Test GET /api/play_audio/<filename>")
    sp_play.add_argument("filename", help="Audio filename on server (e.g., abc.wav)")
    sp_play.add_argument("--out", help="Optional local path to save the audio")

    return p


def main():
    parser = build_parser()
    args = parser.parse_args()

    base_url = args.base_url.rstrip("/")

    if args.cmd == "index":
        test_index(base_url)
    elif args.cmd == "audio":
        test_audio(base_url, args.audio, save_audio=args.save_audio)
    elif args.cmd == "image":
        test_image(base_url, args.prompt, args.image)
    elif args.cmd == "play":
        test_play_audio(base_url, args.filename, save_path=args.out)
    else:
        parser.error("Unknown command")


if __name__ == "__main__":
    main()
