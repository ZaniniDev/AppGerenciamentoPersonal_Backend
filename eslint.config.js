import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    "plugins": ["simple-import-sort"],
    "rules": {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error"
    },
    "parserOptions": {
      "sourceType": "module",
      "ecmaVersion": "latest"
    }
  }
]);
