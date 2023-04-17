import { defineConfig } from '@umijs/max';

export default defineConfig({
  npmClient: 'pnpm',
  qiankun: {
    slave: {},
  },
  model: {},
  headScripts: [`window.publicPath = '//localhost:8001/';`],
  runtimePublicPath: {},
});
