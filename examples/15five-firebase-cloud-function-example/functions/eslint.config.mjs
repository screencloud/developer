import js from "@eslint/js";
import pluginPromise from "eslint-plugin-promise";
import globals from "globals";

export default [
  js.configs.recommended,
  pluginPromise.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Cloud Functions log via console by design.
      "no-console": "off",

      // Require the use of === and !==
      eqeqeq: "error",

      // Disallow throwing literals as exceptions
      "no-throw-literal": "error",

      // Require using Error objects as Promise rejection reasons
      "prefer-promise-reject-errors": "error",

      // Warn against nested then() or catch() statements
      "promise/no-nesting": "warn",
    },
  },
];
