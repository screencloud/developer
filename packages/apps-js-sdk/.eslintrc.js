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
 * Rule documentation:
 *    - TS: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules
 *    - React: https://github.com/yannickcr/eslint-plugin-react#list-of-supported-rules
 *    - CRA: https://www.npmjs.com/package/eslint-config-react-app
 *              - CRA enables a subset of accessibility rules from: (Use CRA link above to see which)
 *                https://github.com/evcohen/eslint-plugin-jsx-a11y#supported-rules
 */
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  plugins: ["@typescript-eslint"],
};
