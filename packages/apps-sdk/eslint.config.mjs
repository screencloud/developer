/**
 * Linting Rules
 *
 * We deliberately do not write our own set of rules.
 * Instead, we use the standard set of recommended rules for whichever tech stack an app uses.
 *
 * This should normally be a set of:
 *    - Language rules (i.e. TS or JS)
 *    - Framework rules (e.g. React)
 *    - Prettier (i.e. Disable formatting rules from above in favour of prettier)
 *
 * Also used by apps-editor-sdk, which re-exports this config.
 */
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tseslint.config(...tseslint.configs.recommended, prettier, {
  rules: {
    // The SDK deliberately uses `any` in a few documented places where the
    // user's config type cannot be known ahead of time.
    "@typescript-eslint/no-explicit-any": "warn",
  },
});
