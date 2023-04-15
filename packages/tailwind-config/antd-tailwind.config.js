// preview Antd theme https://ant.design/theme-editor
const colors = require('tailwindcss/colors');

const pick = (obj, keys) => {
  if (!obj) return {};
  return keys.reduce((acc, key) => {
    if (obj.hasOwnProperty(key)) acc[key] = obj[key];
    return acc;
  }, {});
};

/** @see https://tailwindcss.com/docs/customizing-colors */
const BASE_COLOR_INDEX = 500;

/**
 * Returns an object that maps Tailwind color names to values for the given color palette.
 * @param {keyof typeof colors} color
 */
const twBrandColor = (color) => ({
  ...colors[color],
  DEFAULT: colors[color][BASE_COLOR_INDEX],
});

const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  base: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
};

module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    fontWeight: {
      ...pick(colors, ['fontWeight']),
      base: 600,
    },
    colors: {
      ...pick(colors, [
        'transparent',
        'current',
        'neutral',
        'white',
        'black',
      ]),
      primary: twBrandColor('yellow'),
      success: twBrandColor('green'),
      warning: twBrandColor('orange'),
      error: twBrandColor('red'),
    },
    fontSize: {
      base: 14,
      heading1: 40,
      sm: 12,
      lg: 16,
      xl: 20,
      heading2: 30,
      heading3: 24,
      heading4: 20,
      heading5: 16,
      icon: 12,
    },
    space: spacing,
    margin: spacing,
    padding: spacing,
    height: {
      xxs: 24,
      xs: 32,
      sm: 40,
      md: 48,
      lg: 64,
      xl: 80,
      xxl: 96,
    },
    borderRadius: {
      xs: 8,
      sm: 12,
      base: 16,
      md: 20,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    lineHeight: {
      base: 1.5714285714285714,
      lg: 1.5,
      sm: 1.6666666666666667,
      heading1: 1.2105263157894737,
      heading2: 1.2666666666666666,
      heading3: 1.3333333333333333,
      heading4: 1.4,
      heading5: 1.5,
    },
    screen: {
      xs: '480px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1600px',
    },
  },
  plugins: [],
  corePlugins: { preflight: false },
};
