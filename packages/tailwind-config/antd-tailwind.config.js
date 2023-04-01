const antdToken = require('./antd-tailwind-theme');
const { theme } = require('tailwindcss/defaultConfig');
const colors = require('tailwindcss/colors');
// console.log('theme tw', theme);
const pick = (
  obj,
  keys,
) => {
  if (!obj) return {};
  return keys.reduce((acc, key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) acc[key] = obj[key];
    return acc;
  }, {});
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        // eg. text-primary
        ...(antdToken.colors || {}),
        ...pick(colors, ['white', 'black']),
      },
      fontSize: {
        // eg. text-heading4
        ...(antdToken.fontSize || {}),
      },
      borderRadius: {
        // eg. text-sm
        ...(antdToken.borderRadius || {}),
        ...pick(theme.borderRadius, ['full']),
      },
      boxShadow: {
        ...(antdToken.boxShadow || {}),
      },
      // eg. lg:text-primary
      screens: {
        ...(antdToken.screen || {}),
      },
      fontWeight: {
        ...(antdToken.fontWeight || {}),
      },
      space: {
        // eg. text-sm
        ...(antdToken.space || {}),
      },
      margin: {
        ...(antdToken.space || {}),
      },
      padding: {
        // eg. text-sm
        ...(antdToken.space || {}),
      },
    }
  },
};
