import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FiSend, FiMic, FiMessageSquare, FiX } from "react-icons/fi";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function AIAssistantPanel({ pageContext, language = "en-US" }) {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi, I am AccessAI. Tell me what you want to do and I will guide you step-by-step.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [errorText, setErrorText] = useState("");
  const recognitionRef = useRef(null);

  const SpeechRecognition = useMemo(
    () => window.SpeechRecognition || window.webkitSpeechRecognition,
    []
  );

  const sendMessage = async (messageText) => {
    const userText = messageText.trim();
    if (!userText) {
      return;
    }

    const nextMessages = [...messages, { role: "user", content: userText }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setErrorText("");

    try {
      const response = await axios.post(`${API_BASE}/chat`, {
        message: userText,
        history: nextMessages,
        pageContext,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: response.data.reply }]);
    } catch (error) {
      const fallback = error?.response?.data?.error
        ? `Assistant error: ${error.response.data.error}`
        : "Assistant is temporarily unavailable. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: fallback }]);
      setErrorText(fallback);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!SpeechRecognition) {
      setErrorText("Voice input is not supported in this browser.");
      return;
    }

    if (!recording) {
      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        try {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        } catch {
          setErrorText("Unable to process voice transcript.");
        }
      };
      recognition.onerror = (event) => {
        setRecording(false);
        setErrorText(event?.error || "Voice capture failed.");
      };
      recognition.onend = () => setRecording(false);
      try {
        recognition.start();
      } catch {
        setErrorText("Could not start microphone capture.");
      }
      recognitionRef.current = recognition;
      setRecording(true);
      return;
    }

    recognitionRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="glass-panel w-[min(92vw,380px)] rounded-2xl border border-cyan-300/30"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 font-display text-cyan-200">
                <FiMessageSquare />
                AccessAI Assistant
              </div>
              <button onClick={() => setOpen(false)} className="rounded p-1 hover:bg-white/10">
                <FiX />
              </button>
            </div>

            <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-3">
              {messages.map((msg, index) => (
                <div
                  key={`${msg.role}-${index}`}
                  className={`rounded-xl px-3 py-2 text-sm ${
                    msg.role === "assistant"
                      ? "bg-cyan-400/10 text-slate-100"
                      : "bg-white/10 text-cyan-100"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {loading ? <div className="text-xs text-slate-300">Thinking...</div> : null}
              {errorText ? <div className="text-xs text-red-300">{errorText}</div> : null}
            </div>

            <div className="px-3 pb-1">
              <button
                type="button"
                className="w-full rounded-lg border border-fuchsia-300/30 bg-fuchsia-400/10 px-3 py-2 text-left text-xs text-fuchsia-100"
                onClick={() => sendMessage("Guide me with the next best action on this page")}
              >
                AI Navigation Guide: Suggest my next step
              </button>
            </div>

            <form
              className="flex items-center gap-2 border-t border-white/10 p-3"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(input);
              }}
            >
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`rounded-lg p-2 ${recording ? "bg-red-500/70" : "bg-white/10"}`}
                title="Voice input"
              >
                <FiMic />
              </button>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask for help..."
                className="flex-1 rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-cyan-300 px-3 py-2 font-semibold text-slate-900"
              >
                <FiSend />
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-cyan-300 p-4 text-slate-900 shadow-neon"
          aria-label="Open assistant"
        >
          <FiMessageSquare />
        </button>
      ) : null}
    </div>
  );
}
