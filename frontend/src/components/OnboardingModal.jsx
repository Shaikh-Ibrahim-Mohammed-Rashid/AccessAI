import { motion, AnimatePresence } from "framer-motion";

export function OnboardingModal({ open, t, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/65 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-lg rounded-3xl border border-cyan-300/30 bg-slate-900 p-6 shadow-neon"
          >
            <h2 className="font-display text-2xl text-cyan-200">{t.onboardingTitle}</h2>
            <p className="mt-3 text-slate-300">{t.onboardingBody}</p>

            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>Try saying: "Open dashboard"</li>
              <li>Press Alt + R to read the page</li>
              <li>Ask assistant: "Help me login"</li>
            </ul>

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-cyan-300 px-4 py-3 font-semibold text-slate-900 transition hover:bg-cyan-200"
            >
              Start Experience
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
