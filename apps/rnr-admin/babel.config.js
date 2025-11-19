const path = require('path');
const monorepoRoot = path.resolve(__dirname, '../..');

module.exports = {
  presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
          '@/registry': path.resolve(monorepoRoot, 'packages/registry/src'),
          '~': path.resolve(monorepoRoot, 'packages/rnr-ui/reusables'),
        },
      },
    ],
  ],
};
