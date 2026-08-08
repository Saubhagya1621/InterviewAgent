/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0e14",
        surface: "#111826",
        surfaceAlt: "#161f30",
        border: "#232d3f",
        accent: "#f5a623",
        accentSoft: "#f5a62333",
        text: "#e8ecf2",
        muted: "#8a96a8",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        xl: "1.25rem",
      },
    },
  },
  plugins: [],
};
