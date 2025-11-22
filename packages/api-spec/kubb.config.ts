import { defineConfig } from '@kubb/core';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginClient } from '@kubb/plugin-client';
import { pluginReactQuery } from '@kubb/plugin-react-query';

export default defineConfig(() => {
  return {
    root: '.',
    input: {
      path: './openapi.yaml',
    },
    output: {
      path: './src/gen',
      clean: true,
    },
    plugins: [
      pluginOas({}),
      pluginTs({ output: { path: 'types' } }),
      pluginClient({ output: { path: 'client' }, client: 'axios' }),
      pluginReactQuery({ output: { path: 'hooks' } }),
    ],
  };
});
