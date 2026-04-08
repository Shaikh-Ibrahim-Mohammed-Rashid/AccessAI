import { motion } from "framer-motion";
import { FiHome, FiUser, FiSettings, FiHelpCircle } from "react-icons/fi";

const tabDefinitions = [
  { id: "dashboard", icon: FiHome, label: "Dashboard" },
  { id: "profile", icon: FiUser, label: "Profile" },
  { id: "settings", icon: FiSettings, label: "Settings" },
  { id: "help", icon: FiHelpCircle, label: "Help" },
];

export function VirtualTabs({ activeTab, onTabChange }) {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-20 z-20 mx-auto mb-6 w-full max-w-6xl"
    >
      <div className="glass-panel rounded-2xl border border-cyan-300/20 px-3 py-2">
        <div className="flex justify-start gap-2 overflow-x-auto pb-1">
          {tabDefinitions.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 transition ${
                  isActive
                    ? "border border-cyan-300/60 bg-cyan-300/15 text-cyan-100"
                    : "border border-white/10 text-slate-400 hover:border-cyan-300/30 hover:text-cyan-200"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export function TabContent({ tabId, children }) {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{children}</motion.div>;
}
