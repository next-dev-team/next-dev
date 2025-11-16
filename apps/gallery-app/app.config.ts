import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Gallery App',
  slug: 'gallery-app',
  scheme: 'galleryapp',
  version: '0.0.1',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  plugins: ['expo-router'],
  android: {
    package: 'com.rnr.galleryapp',
    permissions: ['READ_MEDIA_IMAGES'],
  },
  ios: {
    infoPlist: {
      NSPhotoLibraryUsageDescription: 'Allow access to your photo library to display images.',
      NSPhotoLibraryAddUsageDescription: 'Allow adding photos to your library.',
    },
  },
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: '11e71a9d-74f3-4d0e-8f10-02ed6be247da',
    },
  },
});
