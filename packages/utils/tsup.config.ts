import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  treeshake: true,
  splitting: true,
  entry: ['src/**/*.(tsx|ts)'],
  format: ['cjs'],
  dts: true,
  minify: !options.watch,
  exclude: ['**/*.test.ts'],
  ...options,
}));
