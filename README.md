# AccessAI - The Web for Everyone
### Turning every website into an inclusive, voice-first, AI-guided experience.

---

## Project Overview
AccessAI is an AI-powered accessibility web platform that helps people with disabilities navigate websites more easily using voice commands, intelligent guidance, and adaptive UI behavior.

It is designed for hackathon impact: real user problems, polished product experience, and practical deployment architecture.

---

## Problem Statement
Digital products are still difficult to use for many people, especially:
- Users with vision impairment who struggle to scan page structures and interactive controls.
- Users with motor impairments who find mouse-heavy navigation difficult.
- Elderly users who need larger text, simpler layouts, and guided interactions.
- Users with cognitive load challenges who benefit from step-by-step support.

Common accessibility problems include:
- Complex interfaces with unclear action flow.
- Lack of voice-driven control.
- Forms that are hard to understand and complete.
- No contextual, real-time assistance.

---

## Solution
AccessAI combines frontend accessibility tools with AI assistance:
- Voice Navigation: control page flow hands-free.
- Read Page (TTS): read full page content aloud with browser speech synthesis.
- AI Assistant (Chat + Voice): conversational guidance to explain content, help with forms, and suggest next actions.
- Smart Vision Mode: detects important elements (buttons, forms, nav links) and overlays actionable guidance.
- Adaptive Accessibility Mode: observes user behavior (slow typing, repeated errors) and adjusts UI for better usability.

---

## Features
### 1) Voice Navigation System
- Browser speech recognition via Web Speech API.
- Supported commands include:
  - Open dashboard
  - Scroll down / Scroll up
  - Read this page
  - Stop reading
  - Toggle contrast
  - Help me login
- Intent mapping triggers UI actions directly.

### 2) Text-to-Speech (TTS)
- Read Page button reads visible page content aloud.
- Uses backend `/tts` preprocessing + browser speech synthesis playback.
- Supports English and Hindi voice language switching.

### 3) AI Assistant (Chat + Voice)
- Floating assistant panel fixed at screen corner.
- Accepts typed and voice input.
- Capabilities:
  - Explain page context
  - Step-by-step task guidance
  - Form-help responses like "Help me login"
- Backend endpoint: `/chat`.

### 4) Smart Vision Mode
- Analyzes live DOM for key elements.
- Highlights interactive targets with overlays and tooltip hints.
- Demonstrates guided usability for forms/navigation-heavy pages.

### 5) Adaptive Accessibility Mode
- Detects behavior patterns:
  - Slow typing speed
  - Repeated login/form errors
- Dynamically adapts UI:
  - Suggest voice-first workflow
  - Switch to simplified visual mode
  - Maintain high legibility and larger controls

### 6) Extra Accessibility Features
- Multi-language support: English + Hindi.
- Keyboard shortcuts:
  - `Alt + R`: Read page
  - `Alt + V`: Voice navigation
  - `Alt + C`: Contrast mode
- Onboarding tutorial popup for first interaction.
- High contrast mode (black/yellow) for strong visibility.

---

## Unique Selling Points
- Real-time AI + accessibility fusion (not static accessibility toggles only).
- Voice-first interaction model for hands-free web control.
- Smart Vision overlays that convert visual clutter into guided actions.
- Adaptive behavior loop that personalizes accessibility automatically.
- Hackathon-ready architecture with clear path to production APIs.

---

## Tech Stack
### Frontend
- React.js (Vite)
- Tailwind CSS
- Framer Motion
- Axios
- Browser Web Speech API (Speech-to-Text + Text-to-Speech)

### Backend
- Flask
- Flask-CORS
- python-dotenv
- OpenAI Python SDK (fallback responses if API key not present)

### AI
- OpenAI Chat Completion API (`gpt-4o-mini` by default)

---

## How It Works
1. User opens AccessAI and sees onboarding guidance.
2. User enables voice navigation and speaks commands.
3. Frontend speech recognition maps commands to actions.
4. For full-page reading, frontend sends text to `/tts` and plays processed chunks via SpeechSynthesis.
5. User asks questions in assistant panel (typed or voice).
6. Frontend sends message + page context summary to `/chat`.
7. Backend uses OpenAI (or fallback engine) to return clear guidance.
8. Smart Vision mode scans DOM and overlays highlighted guidance boxes.
9. Adaptive mode monitors behavior and automatically suggests easier interaction paths.

---

## Demo Flow (For Judges)
1. Start on landing screen and enable accessibility controls.
2. Say: **"Open dashboard"** to demonstrate voice navigation.
3. Say: **"Scroll down"** to show command-based movement.
4. Click **Read Page** (or say "Read this page") to begin TTS.
5. Open AI assistant and ask: **"Help me login"**.
6. Enable Smart Vision and show login button/form highlighting.
7. Enter invalid login details twice to trigger adaptive assistance.
8. Switch language to Hindi and repeat voice/TTS behavior.
9. Toggle high contrast mode to demonstrate visual accessibility.

---

## Scalability & Future Scope
- Integrate with public websites using browser extensions.
- Deploy as accessibility layer for government portals.
- Integrate with education platforms for inclusive e-learning.
- Add banking-friendly secure guided form completion.
- Expand multilingual support to regional languages.
- Add OCR + image captioning for visual accessibility.
- Add user profiles for personalized accessibility preferences.

---

## Project Structure
```text
AccessAI/
  backend/
    app.py
    requirements.txt
    .env.example
  frontend/
    src/
      components/
      hooks/
      utils/
      App.jsx
      index.css
      main.jsx
    .env.example
    tailwind.config.js
    postcss.config.js
    package.json
  README.md
```

---

## Installation & Setup
### Prerequisites
- Node.js 20+
- Python 3.10+

### 1) Clone and move into project
```bash
git clone <your-repo-url>
cd "Terna Tech Week"
```

### 2) Backend setup
```bash
cd backend
python -m venv ../.venv
../.venv/Scripts/activate
pip install -r requirements.txt
copy .env.example .env
```

Set your API key in `.env`:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
FLASK_PORT=5000
```

Run backend:
```bash
python app.py
```

### 3) Frontend setup
Open a new terminal:
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173` and calls backend at `http://localhost:5000`.

---

## API Endpoints
### `POST /chat`
Request:
```json
{
  "message": "Help me login",
  "history": [],
  "pageContext": "Title: ..."
}
```

Response:
```json
{
  "reply": "Step-by-step login guidance..."
}
```

### `POST /tts`
Request:
```json
{
  "text": "Page content to read",
  "lang": "en-US"
}
```

Response:
```json
{
  "text": "...",
  "lang": "en-US",
  "chunks": ["...", "..."],
  "note": "Client should use Web Speech API for playback."
}
```

---

## Screenshots
Add your screenshots here before submission:
- `docs/screenshots/home.png`
- `docs/screenshots/assistant.png`
- `docs/screenshots/smart-vision.png`
- `docs/screenshots/contrast-mode.png`

---

## Team Details
- Team Name: `<Your Team Name>`
- Members:
  - `<Member 1 - Role>`
  - `<Member 2 - Role>`
  - `<Member 3 - Role>`

---

## Impact Statement
AccessAI makes web interaction more inclusive by combining AI intelligence with practical accessibility actions. It does not only increase compliance, it improves independence, dignity, and digital participation for everyone.
