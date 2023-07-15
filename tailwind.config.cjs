// @ts-check
const tailwindColors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");
const path = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  experimental: {
    optimizeUniversalDefaults: false,
  },
  content: ["./src/**/*.{astro,ts,tsx,css}"],
  theme: {
    fontFamily: {
      sans: ["Inter-Regular", "sans-serif"],
      serif: [
        '"Brygada 1918"',
        "ui-serif",
        "Georgia",
        "Cambria",
        '"Times New Roman"',
        "serif",
      ],
      mono: [
        "Fira Code",
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        '"Liberation Mono"',
        "monospace",
      ],
    },
    colors: {
      inherit: tailwindColors.inherit,
      current: tailwindColors.current,
      transparent: tailwindColors.transparent,
      black: tailwindColors.black,
      white: tailwindColors.white,
      gray: tailwindColors.neutral,

      background: "var(--color-background)",
      text: "var(--color-text)",
      textSpecial: "var(--color-textSpecial)",
      proseTitle: "var(--color-proseTitle)",
      proseDate: "var(--color-proseDate)",
      coloroutline: "var(--color-outline)",
      colorselectionText: "var(--color-selectionText)",
      colorselectionBg: "var(--color-selectionBg)",
      colorhover: "var(--color-hover)",
      colordecoration: "var(--color-decoration)",
    },
    extend: {
      maxWidth: {
        container: "43rem",
      },
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
  fonts: {
    paths: [path.resolve(__dirname, "fonts")],
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("selected", '&[aria-selected="true"]');
      addVariant("current", '&[aria-current="true"]');
    }),
  ],
};
