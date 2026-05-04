/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(0,0,0,0.45)",
      },
      colors: {
        ink: {
          950: "#050816",
          900: "#090d1c",
          800: "#11172d",
          700: "#1b2440",
        },
        accent: {
          50: "#e5fff7",
          100: "#bbfbe7",
          200: "#7df0cf",
          300: "#4be2bb",
          400: "#22c7a0",
          500: "#13a685",
          600: "#0f846b",
        },
        warm: {
          50: "#fff8ed",
          100: "#ffe9c4",
          200: "#ffd38a",
          300: "#ffb84d",
          400: "#ff9f1a",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"Inter Tight"', "sans-serif"],
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at top, rgba(34, 197, 160, 0.16), transparent 34%), linear-gradient(180deg, rgba(5, 8, 22, 0.95), rgba(9, 13, 28, 1))",
      },
    },
  },
  plugins: [],
};
