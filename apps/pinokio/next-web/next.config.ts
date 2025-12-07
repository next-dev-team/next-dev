import { codeInspectorPlugin } from 'code-inspector-plugin';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
    },
    rules: codeInspectorPlugin({
      bundler: 'turbopack',
    }),
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native': 'react-native-web',
    };
    config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }));
    return config;
  },
};

export default nextConfig;
