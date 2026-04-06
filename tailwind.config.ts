import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: "#C9A84C",
        "gold-light": "#E5C96A",
        "gold-dark": "#A8872E",
        background: "#0D0D0D",
        surface: "#1A1A1A",
        "surface-2": "#242424",
        border: "#2E2E2E",
        "text-primary": "#F5F5F5",
        "text-secondary": "#A0A0A0",
        rise: "#22c55e",
        fall: "#ef4444",
      },
      fontFamily: {
        tajawal: ["Tajawal", "sans-serif"],
      },
      animation: {
        ticker: "ticker 40s linear infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
