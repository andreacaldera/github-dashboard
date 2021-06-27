module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "react/react-in-jsx-scope": 0,
    "@typescript-eslint/no-floating-promises": 2,
    "@typescript-eslint/require-await": 2,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
