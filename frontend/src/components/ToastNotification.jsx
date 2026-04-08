import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export function Toast({ message, type = "info", duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500/90"
      : type === "error"
        ? "bg-red-500/90"
        : type === "warning"
          ? "bg-yellow-500/90"
          : "bg-cyan-500/90";

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`${bgColor} rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold text-white shadow-lg`}
    >
      <div className="flex items-center justify-between gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="opacity-70 hover:opacity-100">
          <FiX />
        </button>
      </div>
    </motion.div>
  );
}

export function ToastManager({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-20 right-5 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
