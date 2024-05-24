
import dflex from "eslint-config-dflex";

import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";


export default [
  ...dflex,
  ...fixupConfigRules(pluginReactConfig),
];