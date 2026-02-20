/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kraven: {
          50: "#eefbf3",
          100: "#d5f6e0",
          200: "#aeecc6",
          300: "#79dca5",
          400: "#42c680",
          500: "#1aab64",
          600: "#0d8a50",
          700: "#0a6e42",
          800: "#0a5736",
          900: "#09472d",
          950: "#04281a",
        },
        dark: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#1a1a2e",
          950: "#0f0f1a",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scanLine 2s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        scanLine: {
          "0%, 100%": { transform: "translateY(-100%)" },
          "50%": { transform: "translateY(100%)" },
        },
        glow: {
          "0%": {
            boxShadow:
              "0 0 5px rgba(26, 171, 100, 0.2), 0 0 10px rgba(26, 171, 100, 0.1)",
          },
          "100%": {
            boxShadow:
              "0 0 20px rgba(26, 171, 100, 0.4), 0 0 40px rgba(26, 171, 100, 0.2)",
          },
        },
      },
    },
  },
  plugins: [],
};
