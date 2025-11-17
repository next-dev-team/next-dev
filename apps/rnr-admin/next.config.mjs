/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    'nativewind',
    'react-native',
    'react-native-web',
    'react-native-css-interop',
    'react-native-reanimated',
    'react-native-svg',
    '@rnr/registry',
    '@rnr/rnr-ui',
    '@rnr/rnr-ui-pro',
  ],
  webpack: (config, { isServer, webpack }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];

    // Define __DEV__ for React Native compatibility
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      }),
    );

    return config;
  },
};

export default nextConfig;
