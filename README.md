<<<<<<< HEAD
# Babu Backend: Voice AI Assistant for Elderly (Nepali & English)

## Overview
Babu Backend is the backend service for a multilingual AI voice assistant designed to support elderly users in both Nepali and English. The system enables users to interact with the assistant through voice input (mp3 or wav files) and receive voice responses, making technology more accessible and user-friendly for old-age individuals.

## Features
- Accepts voice input in multiple audio formats (mp3, wav, m4a, aac, flac, ogg, etc.)
- Supports Nepali and English languages
- Provides AI-powered responses (using Ollama on localhost for LLM/agent)
- Delivers responses in synthesized speech (voice output)
- Designed for accessibility and ease of use for the elderly

## Getting Started
1. Clone the repository.
2. Install dependencies (see requirements.txt).
3. Ensure Ollama is running on localhost for AI agent support.
4. Run the backend server.

## API Endpoints
- `/voice-input` : Accepts multiple audio formats (mp3, wav, m4a, aac, flac, ogg, etc.), returns response as audio

### Example: Accessing from External Device (cURL)

Replace `<SERVER_IP>` with your backend server's IP address.

```sh
curl -X POST \
  -F "file=@/path/to/your/audio.wav" \
  -F "lang=en" \
  http://<SERVER_IP>:5000/voice-input --output response.mp3
```
- `file`: Path to the mp3 or wav audio file to send.
- `lang`: `en` for English, `ne` for Nepali.
- The response will be saved as `response.mp3`.

## Requirements
- Python 3.9+
- [Ollama](https://ollama.com/) running on localhost
- API keys for speech-to-text and text-to-speech services (if required; you will be prompted if needed)

## Roadmap
- [ ] Implement voice input endpoint
- [ ] Integrate speech-to-text (Nepali & English)
- [ ] Connect to Ollama for AI responses
- [ ] Integrate text-to-speech (Nepali & English)
- [ ] Add user/session management
- [ ] Accessibility improvements

## License
MIT

---
For any questions or contributions, please open an issue or submit a pull request.


