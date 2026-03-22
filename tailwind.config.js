/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    // Cheatsheets content — needed so Tailwind doesn't purge prose-cheat styles
    "./content/**/*.md",
  ],
  theme: {
    extend: {
      keyframes: {
        pulseFast: {
          "0%,100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.4)", opacity: "0.6" }
        },
        pulseSlow: {
          "0%,96%,100%": { transform: "scale(1)", opacity: "1" },
          "98%": { transform: "scale(1.25)", opacity: "0.7" }
        }
      },
      animation: {
        "pulse-fast": "pulseFast 0.4s ease-in-out infinite",
        "pulse-slow": "pulseSlow 4s ease-in-out infinite"
      }
    }
  },
  plugins: [],
};
