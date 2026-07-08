/**
 * Linting Rules
 *
 * We deliberately do not write our own set of rules.
 * Instead, we use the standard set of recommended rules for whichever tech stack an app uses.
 */
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "lines-between-class-members": ["error", "always"],
      // The migrated-from-JS components use `any` for loose GraphQL payloads.
      "@typescript-eslint/no-explicit-any": "warn",
      // Styled components destructure props out of the rest they forward to
      // the DOM; those bindings are deliberately "unused".
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", ignoreRestSiblings: true },
      ],
    },
  },
);
