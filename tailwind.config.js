// https://github.com/Tailus-UI/blocks/blob/main/tailwind.config.js
/** @type {import('tailwindcss/types').Config} */
module.exports = {
  content: [
    './docs/**/*.tsx',
    './packages/ui/**/*.tsx',
  ],
  // plugins: [require('@tailwindcss/line-clamp')],
  darkMode: 'class',
  corePlugins: {
    preflight: false, // conflicts with antd button need to custom preflight css in tailwind.css
  },
  theme: {
    extend: {

      colors: ({ colors }) => ({
        inherit: colors.inherit,
        current: colors.current,
        transparent: colors.transparent,
        primary: '#007FEC',
        primaryLight: '#00B1FD',
        secondary: '#00D9E9',
        secondaryLight: '#71FACA',
        dark: '#0A101E',
        darker: '#090E1A',
        black: colors.black,
        white: colors.white,
        slate: colors.slate,
      }),
    },
  },
};
