module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["@edgeandnode"],
  rules: {},
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: require.resolve("./tsconfig.json"),
      },
    },
    {
      files: ["*.astro"],
      parser: "astro-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
        extraFileExtensions: [".astro"],
      },
      rules: {},
    },
    // ...
  ],
};
