// @ts-check

const tailwindColors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  experimental: {
    optimizeUniversalDefaults: true,
  },
  content: ["./src/**/*.{astro,ts,tsx}"],
  theme: {
    colors: {
      inherit: tailwindColors.inherit,
      current: tailwindColors.current,
      transparent: tailwindColors.transparent,
      black: tailwindColors.black,
      white: tailwindColors.white,

      gray: tailwindColors.neutral,
    },
    extend: {
      animation: {
        "scale-up": "scale-up 150ms ease-in",
      },
      keyframes: {
        "scale-up": {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "70%": { transform: "scale(1.02)", opacity: 0.7 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
