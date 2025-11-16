// import { pluginClient } from '@kubb/plugin-client';
import { defineConfig } from '@kubb/core';
import { pluginOas } from '@kubb/plugin-oas';
import { PluginReactQuery, pluginReactQuery } from '@kubb/plugin-react-query';
import { QueryKey } from '@kubb/plugin-react-query/components';
import { pluginTs } from '@kubb/plugin-ts';

type GetBaseConfigOptions = {
  baseURL?: string;
  reactQuery?: Pick<PluginReactQuery['options'], 'override'>;
};

const getBaseConfig = (options?: GetBaseConfigOptions) => {
  const { baseURL, reactQuery, ...rest } = options || {};
  return defineConfig({
    root: '.',
    input: {
      path: './api.yaml',
    },
    output: {
      path: './src/gen',
      clean: true,
      defaultBanner: 'simple' as const,
    },
    hooks: {
      done: ['npm run typecheck'],
    },
    plugins: [
      pluginOas({ generators: [] }),
      // pluginClient({
      //   baseURL,
      // }),
      pluginTs({
        output: {
          path: 'models',
          banner(oas) {
            return `// version: ${oas.api.info.version}`;
          },
        },
      }),
      pluginReactQuery({
        client: {
          bundle: true,
          baseURL,
        },
        transformers: {
          name: (name, type) => {
            if (type === 'file' || type === 'function') {
              return `${name}Hook`;
            }
            return name;
          },
        },
        output: {
          path: './hooks',
        },
        group: {
          type: 'path',
        },
        queryKey(props) {
          const keys = QueryKey.getTransformer(props);
          return ['"v5"', ...keys];
        },
        paramsType: 'inline',
        pathParamsType: 'object',
        suspense: {},
        ...(reactQuery?.override || {}),
      }),
    ],
  });
};

export default getBaseConfig;
