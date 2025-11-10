module.exports = {
  extends: [require.resolve('./base.cjs'), 'next/core-web-vitals', 'next/typescript'],
  rules: {
    '@next/next/no-img-element': 'off',
  },
};
