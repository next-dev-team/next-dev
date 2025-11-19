const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

const { resolver } = config;
const defaultResolve = require('metro-resolver').resolve;
config.resolver = {
  ...resolver,
  sourceExts: [...resolver.sourceExts, 'mjs', 'cjs'],
  resolveRequest: (context, moduleName, platform) => {
    if (moduleName.startsWith('~/')) {
      const target = path.join(monorepoRoot, 'packages', 'rnr-ui', 'reusables', moduleName.replace('~/', ''));
      return defaultResolve(context, target, platform);
    }
    if (moduleName.startsWith('@/registry/')) {
      const target = path.join(monorepoRoot, 'packages', 'registry', 'src', moduleName.replace('@/registry/', ''));
      return defaultResolve(context, target, platform);
    }
    return defaultResolve(context, moduleName, platform);
  },
};

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
