module.exports = {
  env: {
    browser: true,
    es2024: true,
  },
  extends: [require.resolve('./base.cjs'), 'plugin:react/recommended'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
