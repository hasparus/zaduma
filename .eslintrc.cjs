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
  ],
};
