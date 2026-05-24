import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:     "#070707",
        bg2:    "#0d0a07",
        bg3:    "#130e08",
        orange: "#FF6B35",
        gold:   "#F5A623",
        glt:    "#FFD580",
        teal:   "#00C9B8",
        red:    "#E83A0A",
        cream:  "#EDE8DF",
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "sans-serif"],
        mono:     ["var(--font-mono)", "monospace"],
        body:     ["var(--font-body)", "sans-serif"],
      },
      keyframes: {
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        flicker: {
          "0%,100%": { opacity: "1" },
          "41%":     { opacity: "1" },
          "42%":     { opacity: "0.8" },
          "43%":     { opacity: "1" },
          "62%":     { opacity: "1" },
          "63%":     { opacity: "0.85" },
          "64%":     { opacity: "1" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 20px rgba(255,107,53,0.3)" },
          "50%":     { boxShadow: "0 0 40px rgba(255,107,53,0.6)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        scanline: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      animation: {
        marquee:    "marquee 28s linear infinite",
        flicker:    "flicker 4s infinite",
        pulseGlow:  "pulseGlow 2s ease-in-out infinite",
        fadeUp:     "fadeUp 0.6s ease forwards",
        scanline:   "scanline 8s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
