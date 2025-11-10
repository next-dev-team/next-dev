import { createMDX } from 'fumadocs-mdx/next';

// Toggle build output based on environment.
// Electron builds need `standalone`; web builds should use `export`.
const isElectronBuild =
  process.env.BUILD_TARGET === 'electron' || process.env.ELECTRON_BUILD === '1';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  // output: isElectronBuild ? 'standalone' : 'export',
  transpilePackages: [
    '@rnr/registry',
    'react-native',
    'react-native-web',
    'expo',
    'nativewind',
    'react-native-css-interop',
    'react-native-reanimated',
    'react-native-calendars',
    'react-native-swipe-gestures',
    'react-native-toast-message',
    'react-native-gesture-handler',
    'expo-haptics',
    'expo-router',
    'react-navigation',
    'expo-modules-core',
  ],
  images: {
    // When exporting static HTML, Next.js Image Optimization API is unavailable.
    // Set unoptimized for web export; keep optimization for electron standalone server.
    unoptimized: !isElectronBuild,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    // Use Babel for Reanimated worklets plugin support on web
    // SWC-only can break worklets transformation
    // forceSwcTransforms: true,
  },
  // TODO(zach)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  async redirects() {
    return [
      {
        source: '/getting-started/introduction',
        destination: '/',
        permanent: true,
      },
      {
        source: '/getting-started/initial-setup',
        destination: '/docs/installation',
        permanent: true,
      },
      {
        source: '/components/:slug',
        destination: '/docs/components/:slug',
        permanent: true,
      },
    ];
  },
};

export default withMDX(withExpo(config));

// https://github.com/expo/expo-webpack-integrations/blob/main/packages/next-adapter/src/index.ts
function withExpo(nextConfig) {
  return {
    ...nextConfig,
    webpack(config, options) {
      // Mix in aliases
      if (!config.resolve) {
        config.resolve = {};
      }

      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        // Alias direct react-native imports to react-native-web
        'react-native$': 'react-native-web',
        // Alias internal react-native modules to react-native-web
        'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$':
          'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
        'react-native/Libraries/vendor/emitter/EventEmitter$':
          'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
        'react-native/Libraries/EventEmitter/NativeEventEmitter$':
          'react-native-web/dist/vendor/react-native/NativeEventEmitter',
      };

      config.resolve.extensions = [
        '.web.js',
        '.web.jsx',
        '.web.ts',
        '.web.tsx',
        ...(config.resolve?.extensions ?? []),
      ];

      if (!config.plugins) {
        config.plugins = [];
      }

      // Expose __DEV__ from Metro.
      config.plugins.push(
        new options.webpack.DefinePlugin({
          __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
        }),
      );

      // Execute the user-defined webpack config.
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  };
}
