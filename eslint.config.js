import astro from "@hasparus/eslint-config/astro";
import solid from "@hasparus/eslint-config/solid";
import checkFile from "eslint-plugin-check-file";

export default [
  { ignores: ["**/*.mdx", "**/*.md"] },

  ...astro,
  ...solid,

  {
    settings: {
      "better-tailwindcss": { entryPoint: "src/global-styles/base.css" },
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
];
