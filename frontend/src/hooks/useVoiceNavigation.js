import { useEffect, useMemo, useRef, useState } from "react";
import { inferIntentDetails } from "../utils/commands";

export function useVoiceNavigation(onIntent, language = "en-US") {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState("");
  const [lastError, setLastError] = useState("");
  const recognitionRef = useRef(null);
  const shouldListenRef = useRef(false);

  const SpeechRecognition = useMemo(
    () => (typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null),
    []
  );

  useEffect(() => {
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    setSupported(true);

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      try {
        const latest = event.results[event.results.length - 1];
        const transcript = latest[0].transcript.trim();
        setLastTranscript(transcript);

        const details = inferIntentDetails(transcript);
        if (details.intent) {
          onIntent(details.intent, transcript, details.confidence);
        }
      } catch {
        setLastError("Unable to parse voice input.");
      }
    };

    recognition.onend = () => {
      if (shouldListenRef.current) {
        try {
          recognition.start();
        } catch {
          setListening(false);
        }
      }
    };

    recognition.onerror = (event) => {
      setLastError(event?.error || "voice_error");
      shouldListenRef.current = false;
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      shouldListenRef.current = false;
      try {
        recognition.stop();
      } catch {
        // ignore lifecycle stop errors
      }
      recognitionRef.current = null;
    };
  }, [SpeechRecognition, onIntent, language]);

  const startListening = () => {
    if (!recognitionRef.current || listening) {
      return;
    }
    recognitionRef.current.lang = language;
    shouldListenRef.current = true;
    setLastError("");
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (error) {
      shouldListenRef.current = false;
      setListening(false);
      setLastError(error?.message || "Could not start voice navigation.");
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) {
      return;
    }
    shouldListenRef.current = false;
    try {
      recognitionRef.current.stop();
    } catch {
      // ignore lifecycle stop errors
    }
    setListening(false);
  };

  return {
    supported,
    listening,
    lastTranscript,
    lastError,
    startListening,
    stopListening,
  };
}
