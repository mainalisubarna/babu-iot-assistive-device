<div align="center">

# Babu — Nepali AI Companion (Engineering Deep Dive)
A headless, Raspberry Pi–ready, voice-first assistant for elders — autonomous on-device service with cloud-augmented intelligence.

</div>

---

## 1) Vision and Impact
- **Purpose-built for elders**: Short, kind, Nepali responses; minimal interaction steps; clear error recovery.
- **Autonomous device**: Runs as a background service on a Raspberry Pi, boots with the OS, no keyboard/mouse required.
- **Community-driven**: Headlines and tithi can be curated by caregivers for local relevance.

---

## 2) System Overview
- Backend: `Flask` service (`backend/app.py`) exposing REST endpoints
- Speech pipeline: Audio → ASR → Intent → Task handler → TTS → Audio URL
- Clients: `client_test.py` (API tests), `voice_recorder.py` (mic capture + POST /audio)
- Storage: Generated speech saved in `backend/outputs/`
- Config: `.env` for API keys and JSON payloads (headlines and calendar/tithi)
- Cloud Augmentation:
  - LLM via Groq (`openai/gpt-oss-20b`)
  - Image True/False via Gemini 1.5 Flash
  - Optional backup via local `ollama llava`

> Note: TTS uses `edge-tts` online voices; the device operates headlessly and autonomously, while select capabilities use the network.

---

## 3) High-Level Architecture
```
[Mic/Audio File] --(multipart/form-data)-->  POST /audio  (Flask)
        |                                         |
        |                                   transcribe_audio()
        |                                         v
        |                                   detect_intent()  -->  Groq (LLM)
        |                                         |
        |              +--> news ----------> generate_nepal_news()  (local from .env)
        |              +--> nepali_date ---> get_nepali_date_info() (local from .env)
        |              +--> call/emergency -> CONTACTS (local)
        |              +--> general/other -> query_groq() | fallback: translate → ollama llava → translate back
        |                                         v
        |                                   synthesize_edge_tts()
        |                                         v
        |                      save WAV → backend/outputs/<uuid>.wav
        |                                         v
        +------------------------------- JSON + full_play_url (/api/play_audio/<file>)
```

Image QA path:
```
User (prompt + image) --> POST /image --> Gemini 1.5 Flash --> { "result": "True" | "False" }
```

---

## 4) API Reference (from `backend/app.py`)
- **GET `/`** — Health check
  - Response: `{ "message": "Nepali AI Companion Backend Running" }`

- **POST `/audio`** — Upload audio (wav/mp3)
  - form-data: `audio` (file)
  - Response: `{ intent, transcribed_text, response_text, full_play_url, message }`
  - Special intents handled without LLM when possible (news keywords bypass)

- **POST `/image`** — Image question answering (True/False only)
  - form-data: `prompt` (text), `image` (file)
  - Response: `{ "result": "True" | "False" }`

- **GET `/api/play_audio/<filename>`** — Streams generated audio from `backend/outputs/`

---

## 5) Core Modules and Functions
- `transcribe_audio(audio_file)`
  - Converts non-WAV to WAV with `pydub`, transcribes Nepali with `speech_recognition` (Google Web Speech, `ne-NP`).
- `detect_intent(text)`
  - Calls Groq LLM to classify into: `news`, `nepali_date`, `general_chat`, `medicine`, `call`, `alert`, `emergency`.
- `get_nepali_date_info()` / `generate_nepal_news()`
  - Pull deterministic content from `.env` JSON for predictable, curated outputs.
- `query_groq(prompt)`
  - Persona-tuned: brief, warm, respectful Nepali tone.
- `translate_text(text, src, tgt)` and `query_llava(prompt)`
  - Backup route: translate → `ollama llava` → translate back.
- `synthesize_edge_tts(text, output_wav)`
  - Voice selection with fallbacks: `ne-NP-SagarNeural`, `ne-NP-HemkalaNeural`, `hi-IN-MadhurNeural`, `en-US-AriaNeural`.
  - Saves `.wav` to `backend/outputs/` for streaming.
- `query_gemini_image(prompt, image_file)`
  - Enforces True/False-only responses for cognitive simplicity.

---

## 6) Configuration (`.env`)
- Keys (samples):
  - `GROQ_API_KEY`, `GEMINI_API_KEY`, `OLLAMA_HOST`
  - `BASE_URL` (for clients)
  - `HEADLINES_JSON` (JSON array in one line)
  - `NEPALI_DATE_DATA_JSON` (JSON object in one line; keys match `"%A, %B %d, %Y"`)

Example (single-line JSON values):
```env
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
OLLAMA_HOST=http://localhost:11434
BASE_URL=http://127.0.0.1:5000
HEADLINES_JSON=["शीर्षक १","शीर्षक २"]
NEPALI_DATE_DATA_JSON={"Friday, August 15, 2025":{"nepali_date":"साउन ३०, २०८२ B.S.","tithi":"सप्तमी","events":"कुनै प्रमुख चाडपर्व छैन।"}}
```

---

## 7) Running Locally and on Raspberry Pi
- Install deps:
  ```bash
  pip install -r requirements.txt
  ```
- Start API:
  ```bash
  python backend/app.py
  ```
- Raspberry Pi (autonomous service):
  - Configure `.env`
  - Use `systemd` to run the Flask server at boot (example unit):
    ```ini
    [Unit]
    Description=Babu Nepali AI Companion
    After=network-online.target

    [Service]
    WorkingDirectory=/home/pi/babu-v2
    ExecStart=/usr/bin/python3 backend/app.py
    Restart=always
    Environment=PYTHONUNBUFFERED=1

    [Install]
    WantedBy=multi-user.target
    ```
  - Enable with `sudo systemctl enable --now babu.service`

> The device becomes a **plug-and-play, headless, Raspberry Pi–hosted companion**: power it on and it listens, understands, and speaks back — no manual intervention.

---

## 8) Client Utilities
- `client_test.py`
  - `python client_test.py index`
  - `python client_test.py audio path/to/sample.wav --save-audio`
  - `python client_test.py image "यो कुकुर हो?" path/to/dog.jpg`
  - `python client_test.py play <filename.wav> --out saved.wav`
- `voice_recorder.py`
  - `python voice_recorder.py --duration 4 --save-response-audio`

---

## 9) Security and Privacy
- API keys only via environment variables; `.env` should not be committed.
- Audio files are stored locally in `backend/outputs/`. Configure rotation/cleanup per deployment needs.
- For production, place behind a reverse proxy with TLS and network ACLs.

---

## 10) Reliability and UX Principles
- **Graceful failure**: If ASR or LLM fails, Babu apologizes and asks users to retry in Nepali.
- **Deterministic content where it matters**: caregivers can push daily headlines/tithi.
- **Short responses**: intentionally brief to reduce fatigue for elders.

---

## 11) Roadmap
- Push-to-talk / wake word on device
- Offline-capable ASR/TTS modes for limited connectivity
- Persistent reminders/alerts and medication adherence flows
- Contact sync from mobile / cloud address books
- Caregiver dashboard and daily summaries

---

## 12) Why judges will love this
- **Autonomous Raspberry Pi device**: Boots and runs itself; minimal setup, maximal impact.
- **Deeply local**: Native Nepali speech in and out; culturally mindful persona.
- **Thoughtful complexity**: Hybrid AI stack (Groq + Gemini + Ollama) hidden behind a radically simple voice UX.
- **Human-centered**: Designed from lived experience with elders — respectful, concise, and caring.

---

## Appendix: Dependencies
See `requirements.txt`:
- Flask, requests
- SpeechRecognition, pydub
- edge-tts, Pillow
- google-generativeai
- python-dotenv
- sounddevice, soundfile, numpy (for mic recording client)
