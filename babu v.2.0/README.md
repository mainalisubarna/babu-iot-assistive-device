<div align="center">

# Babu — Nepali AI Companion
Headless, Raspberry Pi-ready, voice-first assistant for elders.

</div>

A plug-and-play, autonomous device: power on the Pi -> it boots the service -> listens, understands, and speaks back in Nepali.

## Quickstart
- Install deps: pip install -r requirements.txt
- Configure .env (single-line JSON for headlines/date)
- Run backend: python backend/app.py
- Test:
  - python client_test.py index
  - python client_test.py audio path/to.wav --save-audio
  - python voice_recorder.py --duration 4 --save-response-audio
  - python client_test.py image "यो कुकुर हो?" path/to.jpg

## What’s inside
- ackend/app.py — ASR -> intent -> LLM/Gemini -> TTS -> audio streaming
- ackend/outputs/ — generated audio
- client_test.py — endpoint tester
- oice_recorder.py — record mic and POST /audio

## Raspberry Pi (autonomous)
Run as a systemd service to start at boot (see DOCUMENTATION.md for unit file). No keyboard/mouse — truly headless.

## Learn more
See full deep dive, architecture diagrams, and Pi service guide in DOCUMENTATION.md.
