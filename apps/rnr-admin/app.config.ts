import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'RNR Admin',
  slug: 'rnr-admin',
  version: '0.0.1',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  runtimeVersion: { policy: 'appVersion' },
  splash: {
    resizeMode: 'contain',
    backgroundColor: '#0A0A0A',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.rnr.admin',
  },
  android: {
    edgeToEdgeEnabled: true,
    adaptiveIcon: {
      backgroundColor: '#0A0A0A',
    },
    package: 'com.rnr.admin',
  },
  web: {
    bundler: 'metro',
    output: 'static',
  },
  plugins: ['expo-router'],
  experiments: { typedRoutes: true },
  extra: { router: { origin: false } },
};

export default config;
