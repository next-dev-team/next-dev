/**
 * Root ESLint configuration for the monorepo.
 * Projects can override by extending from shared configs.
 */
module.exports = {
  root: true,
  extends: [
    '@rnr/configs/eslint/base',
  ],
  overrides: [
    // Next.js apps
    {
      files: ['apps/docs/**/*.{js,jsx,ts,tsx}'],
      extends: ['@rnr/configs/eslint/next'],
    },
    // React apps (Expo/React Native web or SPA)
    {
      files: ['apps/showcase/**/*.{js,jsx,ts,tsx}'],
      extends: ['@rnr/configs/eslint/react', '@rnr/configs/eslint/typescript'],
    },
    // CLI and Node scripts
    {
      files: ['apps/cli/**/*.{js,ts}', 'packages/**/src/**/*.{js,ts}'],
      extends: ['@rnr/configs/eslint/node', '@rnr/configs/eslint/typescript'],
    },
  ],
};