module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 6,
    sourceType: "module",
    allowImportExportEverywhere: true,
  },
  env: {
    browser: true,
    es6: true,
    es2021: true
  },
  plugins: ["html"],
  extends: [
    "prettier"
  ],
  rules: {

  }
}
