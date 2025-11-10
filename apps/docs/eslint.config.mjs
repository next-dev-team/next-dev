import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  // Ignore linting the config file itself to avoid plugin warnings
  { ignores: ['eslint.config.*'] },
  // Load the legacy config object directly via compat
  ...compat.config(require('../../packages/configs/eslint/next.cjs')),
  // Allow require() in JS scripts; this rule is for TS only
  {
    files: ['scripts/**/*.{js,mjs}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
