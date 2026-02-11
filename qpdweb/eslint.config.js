import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginRouter from '@tanstack/eslint-plugin-router';



/** @type {import('eslint').Linter.Config[]} */

export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  ...pluginRouter.configs['flat/recommended'],
  {
        rules: {
            "no-unused-vars": "error",
            "no-undef": "error",
            "react/react-in-jsx-scope" : "off",
            "react/no-unescaped-entities" : "off",
            "no-extra-boolean-cast": "off",
            "react/display-name": "off",
        
        }
    }
];