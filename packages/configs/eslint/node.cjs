module.exports = {
  env: {
    node: true,
  },
  extends: [require.resolve('./base.cjs')],
  rules: {
    'no-process-exit': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'CallExpression[callee.name="require"]',
        message: 'Use ESM imports when possible.',
      },
    ],
  },
};
