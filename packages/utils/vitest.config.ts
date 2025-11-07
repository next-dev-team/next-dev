import baseConfig from '@rnr/config/vitest/base';
import { defineConfig, mergeConfig } from 'vitest/config';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        lines: 100,
        functions: 100,
        statements: 100,
        branches: 100,
        include: ['src/object.ts'],
      },
    },
  }),
);

