import os
from typing import Any

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

try:
    from openai import OpenAI
except Exception:  # pragma: no cover
    OpenAI = None


load_dotenv()

app = Flask(__name__)
CORS(app)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

client = None
if OPENAI_API_KEY and OpenAI:
    client = OpenAI(api_key=OPENAI_API_KEY)

SYSTEM_PROMPT = """
You are AccessAI, an accessibility assistant embedded in a web app.
Goals:
1) Provide simple, step-by-step guidance for users with visual, motor, hearing, or cognitive challenges.
2) Keep replies concise, supportive, and actionable.
3) If user asks for form help, give numbered steps and what each field means.
4) Mention voice commands when relevant.
5) Avoid heavy jargon.
""".strip()


def build_fallback_reply(user_message: str, page_context: str) -> str:
    lowered = user_message.lower()

    if "login" in lowered or "log in" in lowered or "sign in" in lowered:
        return (
            "Sure. Here is a simple login guide:\n"
            "1. Go to the top navigation and select 'Login'.\n"
            "2. Type your email in the Email field.\n"
            "3. Type your password in the Password field.\n"
            "4. Activate 'Show password' if you want to verify typing.\n"
            "5. Select the Login button.\n"
            "Voice tip: Say 'Open dashboard' after login."
        )

    if "read" in lowered and "page" in lowered:
        return (
            "You can use the Read Page button. It will read important content out loud. "
            "You can also say the voice command 'Read this page'."
        )

    if "help" in lowered:
        return (
            "I can help with navigation, reading content aloud, and filling forms. "
            "Try commands like 'Open dashboard', 'Scroll down', or ask me 'Help me login'."
        )

    if page_context:
        return (
            "I reviewed the current page context and can guide you step-by-step. "
            "Tell me the task you want to complete, for example: 'Help me submit the contact form'."
        )

    return (
        "I am ready to help. Ask me what you want to do on this page, and I will give short, clear steps."
    )


def ask_model(messages: list[dict[str, str]]) -> str:
    if not client:
        user_message = messages[-1]["content"] if messages else ""
        page_context = ""
        for item in reversed(messages):
            if item["role"] == "system" and item["content"].startswith("Page context"):
                page_context = item["content"]
                break
        return build_fallback_reply(user_message, page_context)

    completion = client.chat.completions.create(
        model=OPENAI_MODEL,
        temperature=0.3,
        messages=messages,
    )
    return completion.choices[0].message.content or "I could not generate a response right now."


@app.get("/health")
def health() -> Any:
    return jsonify({"status": "ok", "service": "AccessAI backend"})


@app.post("/chat")
def chat() -> Any:
    payload = request.get_json(silent=True) or {}
    user_message = (payload.get("message") or "").strip()
    history = payload.get("history") or []
    page_context = (payload.get("pageContext") or "").strip()

    if not user_message:
        return jsonify({"error": "message is required"}), 400

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    if page_context:
        messages.append(
            {
                "role": "system",
                "content": f"Page context (summarized DOM): {page_context[:2500]}",
            }
        )

    for item in history[-8:]:
        role = item.get("role")
        content = (item.get("content") or "").strip()
        if role in {"user", "assistant"} and content:
            messages.append({"role": role, "content": content[:1500]})

    messages.append({"role": "user", "content": user_message[:2000]})

    try:
        reply = ask_model(messages)
        return jsonify({"reply": reply})
    except Exception as exc:  # pragma: no cover
        return jsonify({"error": "chat_failed", "details": str(exc)}), 500


@app.post("/tts")
def tts() -> Any:
    payload = request.get_json(silent=True) or {}
    text = (payload.get("text") or "").strip()
    lang = (payload.get("lang") or "en-US").strip()

    if not text:
        return jsonify({"error": "text is required"}), 400

    clean_text = " ".join(text.split())
    chunks = [clean_text[i : i + 250] for i in range(0, len(clean_text), 250)]

    return jsonify(
        {
            "text": clean_text,
            "lang": lang,
            "chunks": chunks,
            "note": "Client should use Web Speech API for playback.",
        }
    )


if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=True)
