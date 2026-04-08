import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { AccessibilityToolbar } from "./components/AccessibilityToolbar";
import { AIAssistantPanel } from "./components/AIAssistantPanel";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { OnboardingModal } from "./components/OnboardingModal";
import { SmartVisionOverlay } from "./components/SmartVisionOverlay";
import { ToastManager } from "./components/ToastNotification";
import { VoiceSubtitle } from "./components/VoiceSubtitle";
import { VirtualTabs, TabContent } from "./components/VirtualTabs";
import { useAdaptiveAccessibility } from "./hooks/useAdaptiveAccessibility";
import { useVoiceNavigation } from "./hooks/useVoiceNavigation";
import { detectImportantElements, summarizePageForAI } from "./utils/domAnalyzer";
import { getCopy } from "./utils/i18n";
import { simulateSystemAction, performInteractionAction, performAccessibilityAction } from "./utils/systemActions";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function App() {
  const [language, setLanguage] = useState("en");
  const [highContrast, setHighContrast] = useState(false);
  const [smartVisionEnabled, setSmartVisionEnabled] = useState(false);
  const [smartVisionElements, setSmartVisionElements] = useState([]);
  const [adaptiveEnabled, setAdaptiveEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const [readingText, setReadingText] = useState("");
  const [currentUtterance, setCurrentUtterance] = useState("");
  const [onboardingOpen, setOnboardingOpen] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorCount, setErrorCount] = useState(0);
  const [visionError, setVisionError] = useState("");
  const [isLanguageSwitching, setIsLanguageSwitching] = useState(false);
  const [appBusy, setAppBusy] = useState(false);
  const [statusText, setStatusText] = useState("Ready for voice, chat, and adaptive guidance.");
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [voiceCommandTranscript, setVoiceCommandTranscript] = useState("");
  const [voiceConfidence, setVoiceConfidence] = useState(0);

  const t = getCopy(language);
  const speechLang = language === "hi" ? "hi-IN" : "en-US";

  const { suggestVoice, simplifyUI, avgTypingInterval } = useAdaptiveAccessibility({
    enabled: adaptiveEnabled,
    errorCount,
  });

  const pageContext = useMemo(() => summarizePageForAI(), [language, smartVisionEnabled, simplifyUI]);

  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const speakFeedback = useCallback(
    (text) => {
      try {
        if (!window.speechSynthesis || !text) {
          return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = speechLang;
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
      } catch {
        // non-blocking voice feedback
      }
    },
    [speechLang]
  );

  const stopReading = useCallback(() => {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore synthesis errors
    }
    setSpeaking(false);
    setCurrentUtterance("");
  }, []);

  const readPageAloud = useCallback(async () => {
    const mainText = document.querySelector("main")?.innerText || document.body.innerText;
    const cleaned = mainText.replace(/\s+/g, " ").trim().slice(0, 4000);

    if (!cleaned) {
      return;
    }

    stopReading();

    try {
      const response = await axios.post(`${API_BASE}/tts`, {
        text: cleaned,
        lang: speechLang,
      });

      const chunks = response.data.chunks || [cleaned];
      setReadingText(response.data.text || cleaned);
      setSpeaking(true);

      const readChunk = (index) => {
        if (index >= chunks.length) {
          setSpeaking(false);
          setCurrentUtterance("");
          return;
        }

        const utterance = new SpeechSynthesisUtterance(chunks[index]);
        utterance.lang = speechLang;
        utterance.rate = 0.95;
        utterance.onstart = () => setCurrentUtterance(chunks[index]);
        utterance.onend = () => readChunk(index + 1);
        window.speechSynthesis.speak(utterance);
      };

      readChunk(0);
      setStatusText("Reading page aloud. Say 'Stop reading' to pause.");
    } catch {
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = speechLang;
      utterance.onstart = () => {
        setSpeaking(true);
        setCurrentUtterance(cleaned.slice(0, 220));
      };
      utterance.onend = () => {
        setSpeaking(false);
        setCurrentUtterance("");
      };
      window.speechSynthesis.speak(utterance);
    }
  }, [speechLang, stopReading]);

  const updateSmartVision = useCallback(() => {
    if (!smartVisionEnabled) {
      setSmartVisionElements([]);
      setVisionError("");
      return;
    }
    try {
      const elements = detectImportantElements();
      setSmartVisionElements(elements);
      setVisionError("");
    } catch (error) {
      setVisionError(error?.message || "Smart Vision scan failed.");
      setSmartVisionElements([]);
      setStatusText("Smart Vision recovered using fallback mode.");
    }
  }, [smartVisionEnabled]);

  const scrollToDashboard = useCallback(() => {
    document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const highlightLogin = useCallback(() => {
    const loginButton = document.getElementById("login-btn");
    if (!loginButton) {
      return;
    }
    loginButton.classList.add("ring-4", "ring-yellow-300", "ring-offset-2", "ring-offset-slate-900");
    setTimeout(() => {
      loginButton.classList.remove("ring-4", "ring-yellow-300", "ring-offset-2", "ring-offset-slate-900");
    }, 2500);
    loginButton.scrollIntoView({ behavior: "smooth", block: "center" });
    setStatusText("Smart hint: Use this button to complete login.");
  }, []);

  const clickLoginButton = useCallback(() => {
    const loginButton = document.getElementById("login-btn");
    if (loginButton) {
      loginButton.click();
      setStatusText("Clicking login button now.");
      speakFeedback("Clicking login button now.");
      return;
    }
    setStatusText("Login button not found in current view.");
  }, [speakFeedback]);

  const openLoginSection = useCallback(() => {
    const loginButton = document.getElementById("login-btn");
    if (loginButton) {
      loginButton.scrollIntoView({ behavior: "smooth", block: "center" });
      setStatusText("Opening login section now.");
      speakFeedback("Opening login section now.");
    }
  }, [speakFeedback]);

  const handleVoiceIntent = useCallback(
    (intent, transcript, confidence) => {
      setVoiceCommandTranscript(transcript);
      setVoiceConfidence(confidence || 0);

      if (confidence && confidence < 0.5) {
        addToast(`Unclear command: "${transcript}". Try again?`, "warning");
        return;
      }

      let feedbackMsg = "";

      // Tab Navigation Commands
      if (intent === "switchToDashboardTab") {
        setActiveTab("dashboard");
        feedbackMsg = "Switched to dashboard tab.";
        addToast("Dashboard tab opened", "success");
      } else if (intent === "switchToProfileTab") {
        setActiveTab("profile");
        feedbackMsg = "Switched to profile tab.";
        addToast("Profile tab opened", "success");
      } else if (intent === "switchToSettingsTab") {
        setActiveTab("settings");
        feedbackMsg = "Switched to settings tab.";
        addToast("Settings tab opened", "success");
      } else if (intent === "switchToHelpTab") {
        setActiveTab("help");
        feedbackMsg = "Switched to help tab.";
        addToast("Help tab opened", "success");
      }

      // Navigation Commands
      else if (intent === "openDashboard") {
        scrollToDashboard();
        feedbackMsg = "Opening dashboard section.";
        addToast("Dashboard section opened", "success");
      } else if (intent === "goToProfile") {
        setActiveTab("profile");
        feedbackMsg = "Opening profile section.";
        addToast("Profile section opened", "success");
      } else if (intent === "goToSettings") {
        setActiveTab("settings");
        feedbackMsg = "Opening settings section.";
        addToast("Settings section opened", "success");
      } else if (intent === "goToHelp") {
        setActiveTab("help");
        feedbackMsg = "Opening help section.";
        addToast("Help section opened", "success");
      }

      // Scroll Commands
      else if (intent === "scrollDown") {
        window.scrollBy({ top: 460, behavior: "smooth" });
        feedbackMsg = "Scrolling down.";
        addToast("Scrolled down", "info");
      } else if (intent === "scrollUp") {
        window.scrollBy({ top: -460, behavior: "smooth" });
        feedbackMsg = "Scrolling up.";
        addToast("Scrolled up", "info");
      } else if (intent === "scrollTop") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        feedbackMsg = "Going to top of page.";
        addToast("Scrolled to top", "info");
      } else if (intent === "scrollBottom") {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        feedbackMsg = "Going to bottom of page.";
        addToast("Scrolled to bottom", "info");
      }

      // Interaction Commands
      else if (intent === "clickLoginButton") {
        const msg = performInteractionAction("clickLoginButton");
        feedbackMsg = msg;
        addToast(msg, "success");
      } else if (intent === "submitForm") {
        const msg = performInteractionAction("submitForm");
        feedbackMsg = msg;
        addToast(msg, "success");
      } else if (intent === "fillUsername") {
        const msg = performInteractionAction("fillUsername", "user@example.com");
        feedbackMsg = msg;
        addToast(msg, "success");
      } else if (intent === "fillPassword") {
        const msg = performInteractionAction("fillPassword");
        feedbackMsg = msg;
        addToast(msg, "success");
      } else if (intent === "clearForm") {
        const msg = performInteractionAction("clearForm");
        feedbackMsg = msg;
        addToast(msg, "success");
      } else if (intent === "selectDropdown") {
        const msg = performInteractionAction("selectDropdown");
        feedbackMsg = msg;
        addToast(msg, "success");
      }

      // Tab Commands
      else if (intent === "openNewTab") {
        const msg = simulateSystemAction("openNewTab");
        feedbackMsg = msg;
        addToast(msg, "success");
      } else if (intent === "closeTab") {
        const msg = simulateSystemAction("closeTab");
        feedbackMsg = msg;
        addToast(msg, "warning");
      }

      // Accessibility Commands
      else if (intent === "enableAccessibility") {
        const msg = performAccessibilityAction("enableAccessibility");
        feedbackMsg = msg;
        addToast(msg, "success");
      } else if (intent === "increaseFontSize") {
        const msg = performAccessibilityAction("increaseFontSize");
        feedbackMsg = msg;
        addToast(msg, "success");
      } else if (intent === "decreaseFontSize") {
        const msg = performAccessibilityAction("decreaseFontSize");
        feedbackMsg = msg;
        addToast(msg, "success");
      } else if (intent === "enableContrast") {
        setHighContrast(true);
        feedbackMsg = "Enabling high contrast mode.";
        addToast("High contrast enabled", "success");
      } else if (intent === "disableContrast") {
        setHighContrast(false);
        feedbackMsg = "Disabling high contrast mode.";
        addToast("High contrast disabled", "success");
      } else if (intent === "toggleContrast") {
        setHighContrast((prev) => !prev);
        feedbackMsg = "Toggling contrast mode.";
        addToast("Contrast toggled", "success");
      } else if (intent === "readPage") {
        readPageAloud();
        feedbackMsg = "Reading page content now.";
        addToast("Started reading page", "info");
      } else if (intent === "stopReading") {
        stopReading();
        feedbackMsg = "Stopped reading.";
        addToast("Reading stopped", "info");
      }

      // AI Assistant Commands
      else if (intent === "explainPage") {
        feedbackMsg = "Analyzing page content for you.";
        addToast("Asking AI to explain page", "info");
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      } else if (intent === "suggestNextStep") {
        feedbackMsg = "Getting AI suggestion for next step.";
        addToast("AI Navigation Guide active", "info");
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      } else if (intent === "helpLogin") {
        feedbackMsg = "Getting login guidance from AI.";
        addToast("Login help requested", "info");
        highlightLogin();
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      } else if (intent === "stepByStepGuide") {
        feedbackMsg = "Activating step-by-step guidance.";
        addToast("Step-by-step guide activated", "info");
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      } else if (intent === "openAssistant") {
        feedbackMsg = "Opening AI assistant panel.";
        addToast("AI Assistant opened", "info");
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }

      // System Commands
      else if (intent === "goBack") {
        const msg = simulateSystemAction("goBack");
        feedbackMsg = msg;
        addToast(msg, "info");
      } else if (intent === "goForward") {
        const msg = simulateSystemAction("goForward");
        feedbackMsg = msg;
        addToast(msg, "info");
      } else if (intent === "refreshPage") {
        const msg = simulateSystemAction("refreshPage");
        feedbackMsg = msg;
        addToast(msg, "info");
      } else if (intent === "zoomIn") {
        const msg = simulateSystemAction("zoomIn");
        feedbackMsg = msg;
        addToast(msg, "success");
      } else if (intent === "zoomOut") {
        const msg = simulateSystemAction("zoomOut");
        feedbackMsg = msg;
        addToast(msg, "success");
      } else if (intent === "minimizePage") {
        const msg = simulateSystemAction("minimizePage");
        feedbackMsg = msg;
        addToast(msg, "info");
      } else if (intent === "maximizePage") {
        const msg = simulateSystemAction("maximizePage");
        feedbackMsg = msg;
        addToast(msg, "info");
      }

      // Legacy command
      else if (intent === "highlightLogin") {
        highlightLogin();
        feedbackMsg = "Highlighting login area.";
        addToast("Login button highlighted", "success");
      }

      // Unknown
      else {
        feedbackMsg = `Heard: ${transcript}`;
        addToast(`Command not recognized: "${transcript}"`, "warning");
      }

      // Always provide voice feedback
      if (feedbackMsg) {
        speakFeedback(feedbackMsg);
        setStatusText(feedbackMsg);
      }
    },
    [
      addToast,
      highlightLogin,
      readPageAloud,
      scrollToDashboard,
      speakFeedback,
      stopReading,
    ]
  );

  const { supported, listening, lastTranscript, lastError, startListening, stopListening } = useVoiceNavigation(
    handleVoiceIntent,
    speechLang
  );

  const toggleVoice = () => {
    if (!supported) {
      setStatusText(t.voiceUnsupported);
      return;
    }
    if (listening) {
      stopListening();
      setStatusText("Voice navigation paused.");
    } else {
      startListening();
      setStatusText("Voice navigation active. Try: Open dashboard.");
    }
  };

  useEffect(() => {
    document.body.classList.toggle("contrast-mode", highContrast);
  }, [highContrast]);

  useEffect(() => {
    updateSmartVision();

    window.addEventListener("resize", updateSmartVision, { passive: true });
    window.addEventListener("scroll", updateSmartVision, { passive: true });

    return () => {
      window.removeEventListener("resize", updateSmartVision);
      window.removeEventListener("scroll", updateSmartVision);
    };
  }, [updateSmartVision]);

  useEffect(() => {
    if (lastError) {
      setStatusText(`Voice issue detected: ${lastError}. You can still use chat and buttons.`);
    }
  }, [lastError]);

  useEffect(() => {
    if (!adaptiveEnabled) {
      return;
    }

    if (suggestVoice) {
      setStatusText("Adaptive Mode: Typing looks slow. Voice commands may be faster right now.");
    }

    if (errorCount >= 2) {
      setHighContrast(true);
    }
  }, [adaptiveEnabled, errorCount, suggestVoice]);

  const handleLanguageChange = async (nextLanguage) => {
    if (!nextLanguage || nextLanguage === language) {
      return;
    }

    setIsLanguageSwitching(true);
    setAppBusy(true);
    try {
      setLanguage(nextLanguage);
      setStatusText(getCopy(nextLanguage).languageSwitched);
      stopListening();
      stopReading();
    } catch {
      setLanguage("en");
      setStatusText("Language switch recovered with fallback English mode.");
    } finally {
      setTimeout(() => {
        setIsLanguageSwitching(false);
        setAppBusy(false);
      }, 250);
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!event.altKey) {
        return;
      }

      const key = event.key.toLowerCase();
      if (key === "r") {
        readPageAloud();
      }
      if (key === "v") {
        toggleVoice();
      }
      if (key === "c") {
        setHighContrast((prev) => !prev);
      }
    };

    window.addEventListener("keydown", onKeyDown, { passive: true });
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [readPageAloud]);

  const handleLogin = (event) => {
    event.preventDefault();

    if (!form.email.includes("@") || form.password.length < 6) {
      setErrorCount((prev) => prev + 1);
      setStatusText("Input issue detected. Tip: use the assistant or voice for guidance.");
      return;
    }

    setStatusText("Login successful (demo). You can now open dashboard via voice.");
    setErrorCount(0);
  };

  const rootClass = simplifyUI
    ? "relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-950 text-slate-100 text-lg"
    : "relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-cyan-950 text-slate-100";

  return (
    <ErrorBoundary>
      <div className={rootClass}>
      <OnboardingModal open={onboardingOpen} t={t} onClose={() => setOnboardingOpen(false)} />

      <SmartVisionOverlay enabled={smartVisionEnabled} elements={smartVisionElements} hasError={Boolean(visionError)} />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(34,211,238,0.2),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(250,204,21,0.2),transparent_30%)] opacity-30 pointer-events-none" />

      {appBusy ? (
        <div className="pointer-events-none fixed inset-0 z-40 grid place-items-center bg-slate-950/40">
          <div className="rounded-xl border border-cyan-300/40 bg-slate-900/80 px-4 py-3 text-sm text-cyan-200">
            Applying accessibility settings...
          </div>
        </div>
      ) : null}

      <AccessibilityToolbar
        t={t}
        listening={listening}
        onToggleVoice={toggleVoice}
        onReadPage={readPageAloud}
        onStopReading={stopReading}
        smartVisionEnabled={smartVisionEnabled}
        onToggleSmartVision={() => setSmartVisionEnabled((prev) => !prev)}
        highContrast={highContrast}
        onToggleContrast={() => setHighContrast((prev) => !prev)}
        adaptiveEnabled={adaptiveEnabled}
        onToggleAdaptive={() => setAdaptiveEnabled((prev) => !prev)}
        language={language}
        onLanguageChange={handleLanguageChange}
        speaking={speaking}
      />

      <VoiceSubtitle transcript={voiceCommandTranscript} confidence={voiceConfidence} isListening={listening} />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-28 pt-10">
        <motion.header initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-xs tracking-[0.25em] text-cyan-200">
            ACCESSIBILITY AI PLATFORM
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl">
            {t.appTitle} <span className="text-cyan-300">{t.tagline}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-slate-200">{t.hero}</p>
        </motion.header>

        <VirtualTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "dashboard" && (
        <>
        <section id="dashboard" className="grid gap-4 md:grid-cols-3">
          <article className="glass-panel rounded-2xl p-5">
            <h2 className="font-display text-lg text-cyan-200">Voice Navigation</h2>
            <p className="mt-2 text-sm text-slate-300">
              Say: Open dashboard, Click login button, Open new tab, Go back, Refresh page.
            </p>
            <p className="mt-2 text-xs text-slate-400">Last voice capture: {lastTranscript || "..."}</p>
          </article>

          <article className="glass-panel rounded-2xl p-5">
            <h2 className="font-display text-lg text-cyan-200">Adaptive Insight</h2>
            <p className="mt-2 text-sm text-slate-300">Average typing interval: {avgTypingInterval || 0}ms</p>
            <p className="mt-2 text-sm text-slate-300">Form errors detected: {errorCount}</p>
            {suggestVoice ? (
              <p className="mt-2 rounded-lg bg-yellow-300/20 p-2 text-sm text-yellow-200">
                Suggestion: Switch to voice input for faster interaction.
              </p>
            ) : null}
          </article>

          <article className="glass-panel rounded-2xl p-5">
            <h2 className="font-display text-lg text-cyan-200">Read Aloud Preview</h2>
            <p className="mt-2 text-sm text-slate-300">{speaking ? "Reading in progress" : "Idle"}</p>
            <p className="mt-2 line-clamp-4 text-sm text-slate-300">
              {currentUtterance || readingText.slice(0, 180) || "Tap Read Page to hear full content."}
            </p>
          </article>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="glass-panel rounded-2xl p-6">
            <h2 className="font-display text-2xl text-cyan-200">Demo Login Form</h2>
            <p className="mt-2 text-sm text-slate-300">
              Ask assistant: "Help me login" and enable Smart Vision to locate the button.
            </p>

            <form className="mt-5 space-y-3" onSubmit={handleLogin}>
              <label className="block">
                <span className="mb-1 block text-sm">Email</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-xl border border-white/20 bg-slate-900/60 px-4 py-3 outline-none focus:border-cyan-300"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm">Password</span>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full rounded-xl border border-white/20 bg-slate-900/60 px-4 py-3 outline-none focus:border-cyan-300"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  id="login-btn"
                  type="submit"
                  className="rounded-xl bg-cyan-300 px-6 py-3 font-semibold text-slate-900 transition hover:bg-cyan-200"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={highlightLogin}
                  className="rounded-xl border border-white/30 px-4 py-3 text-sm"
                >
                  {t.loginHelp}
                </button>
              </div>
            </form>
          </article>

          <article className="glass-panel rounded-2xl p-6">
            <h2 className="font-display text-2xl text-cyan-200">Live Accessibility Status</h2>
            <p className="mt-3 rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-3 text-sm text-cyan-100">
              {statusText}
            </p>
            {isLanguageSwitching ? (
              <p className="mt-3 rounded-lg border border-cyan-300/30 bg-cyan-300/10 p-2 text-xs text-cyan-100">
                Updating language without losing your current state...
              </p>
            ) : null}
            {smartVisionEnabled ? (
              <p className="mt-2 rounded-lg border border-yellow-300/40 bg-yellow-300/10 p-2 text-xs text-yellow-100">
                {visionError ? `Smart Vision fallback active: ${visionError}` : t.smartVisionRecovered}
              </p>
            ) : null}

            <p className="mt-3 rounded-lg border border-fuchsia-300/30 bg-fuchsia-400/10 p-2 text-xs text-fuchsia-100">
              {t.aiGuideHint}
            </p>

            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li>Keyboard shortcut: Alt + R (Read Page)</li>
              <li>Keyboard shortcut: Alt + V (Voice Navigation)</li>
              <li>Keyboard shortcut: Alt + C (Contrast Mode)</li>
              <li>Multilingual support: English + Hindi</li>
            </ul>
          </article>
        </section>
        </>
        )}

        {activeTab === "profile" && (
        <section className="mt-8 grid gap-6 lg:grid-cols-1">
          <article className="glass-panel rounded-2xl p-6">
            <h2 className="font-display text-2xl text-cyan-200">User Profile</h2>
            <p className="mt-4 text-slate-300">Welcome to your profile section.</p>
            <p className="mt-3 text-sm text-slate-400">You can manage your settings and preferences here. Say "Open settings" or "Open help" for more options.</p>
          </article>
        </section>
        )}

        {activeTab === "settings" && (
        <section className="mt-8 grid gap-6 lg:grid-cols-1">
          <article className="glass-panel rounded-2xl p-6">
            <h2 className="font-display text-2xl text-cyan-200">Settings</h2>
            <p className="mt-4 text-slate-300">Adjust accessibility and communication preferences.</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>• Voice Navigation: Currently {listening ? "active" : "inactive"}</li>
              <li>• High Contrast: Currently {highContrast ? "enabled" : "disabled"}</li>
              <li>• Adaptive Mode: Currently {adaptiveEnabled ? "enabled" : "disabled"}</li>
              <li>• Smart Vision: Currently {smartVisionEnabled ? "enabled" : "disabled"}</li>
            </ul>
          </article>
        </section>
        )}

        {activeTab === "help" && (
        <section className="mt-8 grid gap-6 lg:grid-cols-1">
          <article className="glass-panel rounded-2xl p-6">
            <h2 className="font-display text-2xl text-cyan-200">Help & Guidance</h2>
            <p className="mt-4 text-slate-300">Need help? Here are some useful commands to get started:</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>📍 Navigation: "Open dashboard", "Go to profile", "Switch to settings"</li>
              <li>🗣️ Voice: "Read page", "Stop reading", "Increase font size"</li>
              <li>🎯 Interaction: "Click login button", "Fill username", "Submit form"</li>
              <li>🔍 Vision: "Enable Smart Vision", "Take screenshot"</li>
              <li>🤖 AI: "Explain page", "Help me login", "Step by step guide"</li>
            </ul>
          </article>
        </section>
        )}
      </main>

      <AIAssistantPanel pageContext={pageContext} language={speechLang} />

      <ToastManager toasts={toasts} onRemoveToast={removeToast} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
