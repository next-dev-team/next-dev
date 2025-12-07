import { codeInspectorPlugin } from 'code-inspector-plugin';
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {},
  turbopack: {
    resolveAlias: {
      'react-native': 'react-native-web',
      '@tanstack/react-query': './node_modules/@tanstack/react-query',
    },
    rules: codeInspectorPlugin({
      bundler: 'turbopack',
    }),
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native': 'react-native-web',
      '@tanstack/react-query': path.resolve(process.cwd(), 'node_modules/@tanstack/react-query'),
    };
    config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }));
    return config;
  },
};

export default nextConfig;
