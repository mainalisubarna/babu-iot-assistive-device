import os
import argparse
import json
import tempfile
from urllib.parse import urljoin, urlparse

import numpy as np
import sounddevice as sd
import soundfile as sf
import requests
from dotenv import load_dotenv

load_dotenv()

DEFAULT_BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:5000/")


def pretty(obj):
    try:
        return json.dumps(obj, indent=2, ensure_ascii=False)
    except Exception:
        return str(obj)


def record_audio(duration: float, samplerate: int, channels: int, device: str | None = None) -> np.ndarray:
    if device is not None:
        sd.default.device = device
    print(f"[REC] Recording for {duration}s @ {samplerate}Hz, {channels}ch ...")
    audio = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=channels, dtype='float32')
    sd.wait()
    print("[REC] Done.")
    return audio


def save_wav(audio: np.ndarray, samplerate: int, path: str):
    sf.write(path, audio, samplerate)
    print(f"[REC] Saved WAV: {path}")


def post_audio(base_url: str, wav_path: str, save_response_audio: bool = False, downloads_dir: str = "downloads"):
    url = urljoin(base_url.rstrip('/'), "/audio")
    with open(wav_path, 'rb') as f:
        files = {"audio": (os.path.basename(wav_path), f, 'audio/wav')}
        r = requests.post(url, files=files)
    r.raise_for_status()
    data = r.json()
    print("[API] /audio response:\n" + pretty(data))

    # Optionally download synthesized audio
    full_play_url = data.get("full_play_url")
    if save_response_audio and full_play_url:
        os.makedirs(downloads_dir, exist_ok=True)
        out_name = os.path.join(downloads_dir, os.path.basename(urlparse(full_play_url).path))
        ar = requests.get(full_play_url)
        ar.raise_for_status()
        with open(out_name, "wb") as f:
            f.write(ar.content)
        print(f"[API] Saved synthesized audio to: {out_name}")


def build_parser():
    p = argparse.ArgumentParser(description="Record microphone audio and send to backend /audio endpoint")
    p.add_argument("--base-url", default=DEFAULT_BASE_URL, help=f"Backend base URL (default: {DEFAULT_BASE_URL})")
    p.add_argument("--duration", type=float, default=5.0, help="Recording duration in seconds (default: 5.0)")
    p.add_argument("--samplerate", type=int, default=16000, help="Sample rate in Hz (default: 16000)")
    p.add_argument("--channels", type=int, default=1, help="Number of channels (default: 1)")
    p.add_argument("--device", help="SoundDevice input device name or index", default=None)
    p.add_argument("--save-wav", help="Optional path to save recorded WAV locally")
    p.add_argument("--save-response-audio", action="store_true", help="Download synthesized audio response")
    return p


def main():
    args = build_parser().parse_args()

    audio = record_audio(args.duration, args.samplerate, args.channels, args.device)

    # Save to a temp wav if user didn't specify path
    if args.save_wav:
        wav_path = args.save_wav
        os.makedirs(os.path.dirname(wav_path) or ".", exist_ok=True)
    else:
        tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        wav_path = tmp.name
        tmp.close()

    save_wav(audio, args.samplerate, wav_path)

    try:
        post_audio(args.base_url, wav_path, save_response_audio=args.save_response_audio)
    finally:
        if not args.save_wav:
            try:
                os.remove(wav_path)
            except Exception:
                pass


if __name__ == "__main__":
    main()
