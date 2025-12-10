import { defineConfig } from '@kubb/core';
import { pluginClient } from '@kubb/plugin-client';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginReactQuery } from '@kubb/plugin-react-query';
import { pluginTs } from '@kubb/plugin-ts';
import os from 'os';
import path from 'path';

export default defineConfig(() => {
  const spec = path.join(
    os.homedir(),
    'pinokio',
    'api',
    'a-1-click-api-express-js-with-ffmpeg-to-build-api',
    'app',
    'swagger.yaml',
  );

  return {
    root: '.',
    input: {
      path: spec,
    },
    output: {
      path: './src/gen',
      clean: true,
    },
    plugins: [
      pluginOas({}),
      pluginTs({ output: { path: 'types' } }),
      pluginClient({
        output: { path: 'client' },
        client: 'axios',
        baseURL: 'http://localhost:30001',
      }),
      pluginReactQuery({
        output: { path: 'hooks' },
        client: { baseURL: 'http://localhost:30001' },
      }),
    ],
  };
});
