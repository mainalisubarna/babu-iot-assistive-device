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
=======
# Programmers Unknown Battlegrounds (PUBG) - DAJ

Team: Babuzz

## Things to consider:
- Participants are **not allowed** to bring pre-existing or ready-made projects. All work must be initiated and developed during the hackathon. (We will regularly check the codebase.)
- If any irregularities are found during the checking, it will lead to the team's **disqualification**.
- Participants are encouraged to collaborate **not only within their teams** but also with mentors and organizers for guidance.
- Every team must make at least **three commits every 6 hours** on the given repository.
- All the code must be pushed to the given repository.
- **Only make useful commits.** Do not make random or unnecessary commits. Commits should be meaningful and relevant.
- **First Commit:** One commit is already done by DAJ while creating the repository. Your first commit should be made after the event has started, with the message: `first commit: [commit message]`.
- **Last Commit:** Do the final commit after the event is completed with the message: `last commit: [commit message]`.
- Any team who commits after the **last commit tag** will be **disqualified**.
- After the **last commit**, you are allowed to commit **only once** to upload your presentation to the repository with the message: `upload presentation`.

## Code Quality and Documentation:
- All code must be **well-documented**. Use meaningful comments to explain the purpose of functions, algorithms, and critical sections of the code.
- Follow **best practices** for code structure, naming conventions, and readability.
- Avoid **code duplication**. Write clean and maintainable code.
- Ensure that your code follows standard coding guidelines for your chosen language and framework.

## Team Conduct and Behavior:
- Teams must behave **respectfully** towards all participants, mentors, and organizers.
- Any form of **harassment**, **discrimination**, or **inappropriate behavior** will lead to immediate disqualification.
- Teams should collaborate effectively, ensuring each member contributes positively to the project.
- Professionalism is expected in all communications during the event.

## Mentor Assistance:
- Mentors will be available to provide **guidance** and **advice** on technical issues, debugging, and project development.
- **Mentors are not allowed to code on behalf of any team** or make decisions for the team.
- Teams can ask for advice on **best practices**, **problem-solving techniques**, or **design decisions**, but they must develop the project independently.

## Submission Guidelines:
- Submit your final project by uploading the presentation and project files to the repository.
- Include a **README** file explaining the project, its features, and how to run it.
- Your final commit should include any **demo materials** or additional files required for judges to evaluate your project.
- Ensure all documentation is complete and the project is functional before submitting.

## Judging Criteria:
Will be informed before the event.

## Contact:
For any questions, issues, or assistance during the event, please reach out to the event organizers through the following channels:
- **Email**: mail@daj.org.np
- **Phone**: +977 9824055745

Feel free to contact us at any time during the event for clarification or support.
>>>>>>> 3b7fae11bdeadcb2ca2f52035e510dff382ea244
