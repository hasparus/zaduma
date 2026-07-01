import { fixupPluginRules } from "@eslint/compat";
import tsParser from "@typescript-eslint/parser";
import theGuild from "@hasparus/eslint-config/the-guild";
import astroParser from "astro-eslint-parser";
import betterTailwind from "eslint-plugin-better-tailwindcss";
import checkFile from "eslint-plugin-check-file";
import solid from "eslint-plugin-solid";

const tailwindIgnore = ["^zaduma-", "^te-", "^rm-arrow$", "^contains-task-list$"];

const perfectionistOff = Object.fromEntries(
  theGuild
    .flatMap((c) => Object.keys(c.rules ?? {}))
    .filter((r) => r.startsWith("perfectionist/"))
    .map((r) => [r, "off"]),
);

export default [
  { ignores: ["**/*.mdx", "**/*.md"] },

  ...theGuild,
  { rules: perfectionistOff },
  { rules: { "unicorn/prefer-global-this": "off" } },

  {
    settings: {
      "better-tailwindcss": { entryPoint: "src/global-styles/base.css" },
    },
  },
  {
    files: ["**/*.tsx", "**/*.jsx"],
    rules: {
      "better-tailwindcss/no-unknown-classes": ["error", { ignore: tailwindIgnore }],
    },
  },

  {
    files: ["**/*.tsx"],
    plugins: { solid: fixupPluginRules(solid) },
    rules: {
      ...solid.configs.typescript.rules,
      "react/no-unknown-property": "off",
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
    },
  },

  {
    files: ["src/**/*.ts"],
    ignores: ["**/*.d.ts", "**/*.xml.ts", "**/*.txt.ts", "**/*.md.ts"],
    plugins: { "check-file": checkFile },
    rules: {
      "check-file/filename-blocklist": ["error", { "**/*.ts": "*.tsx" }],
    },
  },

  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".astro"],
        projectService: false,
        project: false,
      },
    },
    plugins: { "better-tailwindcss": betterTailwind },
    rules: {
      "better-tailwindcss/no-unknown-classes": ["error", { ignore: tailwindIgnore }],
    },
  },
];
