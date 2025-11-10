/**
 * Root ESLint configuration for the monorepo.
 * Projects can override by extending from shared configs.
 */
module.exports = {
  root: true,
  extends: [require.resolve('./packages/configs/eslint/base.cjs')],
  overrides: [
    // Next.js apps
    {
      files: ['apps/docs/**/*.{js,jsx,ts,tsx}'],
      extends: [require.resolve('./packages/configs/eslint/next.cjs')],
    },
    // React app: tron-core
    {
      files: ['apps/tron-core/**/*.{js,jsx,ts,tsx,d.ts}'],
      extends: [
        require.resolve('./packages/configs/eslint/react.cjs'),
        require.resolve('./packages/configs/eslint/typescript.cjs'),
      ],
      parserOptions: {
        tsconfigRootDir: __dirname + '/apps/tron-core',
        project: ['./tsconfig.json', './tsconfig.main.json'],
      },
      rules: {
        // Avoid plugin crash on ESLint v8 by disabling TS wrapper
        '@typescript-eslint/no-unused-expressions': 'off',
        // Use core rule instead
        'no-unused-expressions': [
          'warn',
          { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true },
        ],
      },
    },
    // React apps (Expo/React Native web or SPA)
    {
      files: ['apps/showcase/**/*.{js,jsx,ts,tsx}'],
      extends: [
        require.resolve('./packages/configs/eslint/react.cjs'),
        require.resolve('./packages/configs/eslint/typescript.cjs'),
      ],
    },
    // CLI and Node scripts
    {
      files: ['apps/cli/**/*.{js,ts}', 'packages/**/src/**/*.{js,ts}'],
      extends: [
        require.resolve('./packages/configs/eslint/node.cjs'),
        require.resolve('./packages/configs/eslint/typescript.cjs'),
      ],
    },
  ],
};
