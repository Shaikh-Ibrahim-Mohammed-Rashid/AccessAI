import { motion } from "framer-motion";
import { FiMic, FiVolume2, FiEye, FiSun, FiCpu, FiGlobe } from "react-icons/fi";

export function AccessibilityToolbar({
  t,
  listening,
  onToggleVoice,
  onReadPage,
  onStopReading,
  smartVisionEnabled,
  onToggleSmartVision,
  highContrast,
  onToggleContrast,
  adaptiveEnabled,
  onToggleAdaptive,
  language,
  onLanguageChange,
  speaking,
}) {
  const buttonClass =
    "flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-400/10";

  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel sticky top-4 z-30 mx-auto mt-4 w-full max-w-6xl rounded-2xl p-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        <button className={buttonClass} onClick={onToggleVoice}>
          <FiMic />
          {listening ? t.stopVoice : t.startVoice}
        </button>

        <button className={buttonClass} onClick={speaking ? onStopReading : onReadPage}>
          <FiVolume2 />
          {speaking ? t.stopReading : t.readPage}
        </button>

        <button className={buttonClass} onClick={onToggleSmartVision}>
          <FiEye />
          {t.smartVision}: {smartVisionEnabled ? "ON" : "OFF"}
        </button>

        <button className={buttonClass} onClick={onToggleAdaptive}>
          <FiCpu />
          {t.adaptive}: {adaptiveEnabled ? "ON" : "OFF"}
        </button>

        <button className={buttonClass} onClick={onToggleContrast}>
          <FiSun />
          {t.highContrast}: {highContrast ? "ON" : "OFF"}
        </button>

        <label className="ml-auto flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2">
          <FiGlobe />
          <span className="text-sm">Language</span>
          <select
            className="bg-transparent text-sm outline-none"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            <option className="text-slate-900" value="en">
              English
            </option>
            <option className="text-slate-900" value="hi">
              Hindi
            </option>
          </select>
        </label>
      </div>
    </motion.section>
  );
}
