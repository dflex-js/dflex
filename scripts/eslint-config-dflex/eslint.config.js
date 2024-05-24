import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fixupConfigRules } from "@eslint/compat";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const compat = new FlatCompat({
    baseDirectory: __dirname
});


const OFF = 0;
const ERROR = 2;

export default [
  {
    languageOptions: { 
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        __DEV__: "readonly",
        ...globals.browser 
      }
    },
    ignores: ["node_modules", "dist", "lib", "coverage", "**/*.d.ts"],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
 
  
];