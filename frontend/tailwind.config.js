/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.95)", opacity: "0.5" },
          "70%": { transform: "scale(1.08)", opacity: "0" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
      },
      animation: {
        pulseRing: "pulseRing 1.8s ease-out infinite",
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(0,255,214,0.4), 0 0 32px rgba(0,255,214,0.25)",
      },
    },
  },
  plugins: [],
};
