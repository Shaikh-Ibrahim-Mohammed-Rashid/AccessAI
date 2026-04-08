import { useEffect, useMemo, useState } from "react";

export function useAdaptiveAccessibility({ enabled, errorCount }) {
  const [typingIntervals, setTypingIntervals] = useState([]);
  const [lastTypeAt, setLastTypeAt] = useState(null);
  const [suggestVoice, setSuggestVoice] = useState(false);
  const [simplifyUI, setSimplifyUI] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setTypingIntervals([]);
      setLastTypeAt(null);
      setSuggestVoice(false);
      setSimplifyUI(false);
      return;
    }

    const onKeyDown = (event) => {
      if (!(event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement)) {
        return;
      }

      const now = Date.now();
      if (lastTypeAt) {
        const delta = now - lastTypeAt;
        setTypingIntervals((prev) => [...prev.slice(-15), delta]);
      }
      setLastTypeAt(now);
    };

    window.addEventListener("keydown", onKeyDown, { passive: true });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, lastTypeAt]);

  const avgTypingInterval = useMemo(() => {
    if (!typingIntervals.length) {
      return 0;
    }
    const total = typingIntervals.reduce((sum, value) => sum + value, 0);
    return Math.round(total / typingIntervals.length);
  }, [typingIntervals]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    if (avgTypingInterval > 1000 && typingIntervals.length > 4) {
      setSuggestVoice(true);
    } else {
      setSuggestVoice(false);
    }

    if (errorCount >= 2) {
      setSimplifyUI(true);
    }
  }, [enabled, avgTypingInterval, typingIntervals.length, errorCount]);

  return {
    suggestVoice,
    simplifyUI,
    avgTypingInterval,
  };
}
