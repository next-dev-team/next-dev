import { defineConfig } from 'vitest/config';

export const vitestBaseConfig = defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});

export default vitestBaseConfig;

