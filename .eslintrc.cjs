module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["@edgeandnode"],
  settings: { react: { version: '999.999.999' } },
  rules: {},
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: require.resolve("./tsconfig.json"),
      },
      rules: {
        "react/jsx-key": "off",
        "react/style-prop-object": "off",
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
  ],
};
