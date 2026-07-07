import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core registry navy — headers, primary ink
        navy: {
          50: "#EEF2F7",
          100: "#D7E1EC",
          300: "#7C93AE",
          600: "#294A6D",
          700: "#193A5C",
          800: "#122C49",
          900: "#0B2545",
          950: "#071A33",
        },
        // Clinical blue — primary accent / interactive
        clinical: {
          50: "#EAF5F9",
          100: "#CDE9F1",
          200: "#9DD3E3",
          400: "#2C8FB5",
          500: "#146C94",
          600: "#0F5A7C",
          700: "#0C4863",
        },
        // Health green — secondary accent / success
        health: {
          50: "#E9F8F6",
          100: "#CBEEE9",
          400: "#3CB6A8",
          500: "#1B998B",
          600: "#158176",
          700: "#116A61",
        },
        // Seal gold — official registry accents, used sparingly
        seal: {
          50: "#F8F3EA",
          200: "#E4D2AE",
          400: "#C4A15F",
          500: "#B08D57",
          600: "#8F7245",
        },
        slate: {
          25: "#F7F9FA",
          50: "#F4F7F9",
          150: "#E7EDF1",
          200: "#D9E2E8",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      backgroundImage: {
        "cross-grid":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.14) 1px, transparent 0)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,37,69,0.04), 0 12px 32px -12px rgba(11,37,69,0.18)",
        stamp: "0 1px 0 rgba(176,141,87,0.4) inset",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.94)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
        "scale-in": "scale-in 0.28s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
