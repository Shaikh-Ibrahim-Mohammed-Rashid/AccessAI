import { motion, AnimatePresence } from "framer-motion";

export function VoiceSubtitle({ transcript, confidence, isListening }) {
  if (!transcript && !isListening) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-2xl border border-cyan-300/60 bg-slate-900/95 px-6 py-3 backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="h-3 w-1 animate-bounce rounded-full bg-cyan-300" style={{ animationDelay: "0ms" }} />
            <div className="h-3 w-1 animate-bounce rounded-full bg-cyan-300" style={{ animationDelay: "100ms" }} />
            <div className="h-3 w-1 animate-bounce rounded-full bg-cyan-300" style={{ animationDelay: "200ms" }} />
          </div>
          <span className="font-semibold text-cyan-100">{transcript || "Listening..."}</span>
          {confidence && <span className="text-xs text-cyan-400">({Math.round(confidence * 100)}% confident)</span>}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
