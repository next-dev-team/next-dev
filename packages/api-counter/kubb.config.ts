import { defineConfig } from '@kubb/core';
import { pluginClient } from '@kubb/plugin-client';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginReactQuery } from '@kubb/plugin-react-query';
import { pluginTs } from '@kubb/plugin-ts';
import os from 'os';
import path from 'path';

export default defineConfig(() => {
  const pinokio = path.join(os.homedir(), 'pinokio', 'api', 'todo', 'app', 'swagger.yaml');

  return {
    root: '.',
    input: {
      path: pinokio,
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
        baseURL: 'http://localhost:43000',
      }),
      pluginReactQuery({ output: { path: 'hooks' } }),
    ],
  };
});
