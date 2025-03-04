import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import github from "eslint-plugin-github";


/** @type {import('eslint').Linter.Config[]} */
export default [
  github.configs.recommended,
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

];