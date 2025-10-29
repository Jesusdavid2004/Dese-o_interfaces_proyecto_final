import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#F5F3FA",
          100: "#E8F5EA",
          200: "#CFEBD7",
          300: "#A9DEBE",
          400: "#79C79A",
          500: "#3A8F60",
          600: "#2F724D",
          700: "#285D40",
          800: "#1F4731",
          900: "#0F2A1E",
        },
      },
      boxShadow: { soft: "0 10px 30px rgba(0,0,0,.12)" },
    },
  },
  plugins: [],
}
export default config
