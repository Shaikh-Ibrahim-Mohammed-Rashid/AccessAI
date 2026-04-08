import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const roleHint = {
  button: "Activate this button",
  a: "Navigate to linked section",
  input: "Type your information here",
  select: "Choose an option",
};

export function SmartVisionOverlay({ enabled, elements, hasError }) {
  const visibleElements = useMemo(() => {
    if (!enabled) {
      return [];
    }
    return elements.filter((item) => Number.isFinite(item.top) && Number.isFinite(item.left));
  }, [enabled, elements]);

  if (!enabled) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20" aria-live="polite">
      <AnimatePresence>
        {visibleElements.map((el) => (
          <motion.div
            key={el.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute rounded-lg border-2 border-yellow-300/95 bg-yellow-300/10 shadow-[0_0_22px_rgba(250,204,21,0.55)]"
            style={{
              top: el.top,
              left: el.left,
              width: el.width,
              height: el.height,
            }}
          >
            <div className="absolute -left-4 top-1/2 h-[2px] w-4 -translate-y-1/2 bg-yellow-300" />
            <div className="absolute -left-2 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-yellow-300" />
            <div className="absolute -top-8 left-0 rounded-md bg-yellow-300 px-2 py-1 text-xs font-bold text-slate-900">
              {roleHint[el.role] || "Important item"}: {el.label.slice(0, 30)}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {!visibleElements.length ? (
        <div className="absolute left-1/2 top-20 -translate-x-1/2 rounded-lg border border-yellow-300/60 bg-slate-900/80 px-3 py-2 text-xs text-yellow-200">
          {hasError
            ? "Smart Vision recovered from an issue. Try scrolling once to rescan."
            : "No key elements detected in current viewport. Scroll to rescan."}
        </div>
      ) : null}
    </div>
  );
}
