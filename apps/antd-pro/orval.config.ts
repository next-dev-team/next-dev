import { defineConfig } from "orval";

/**
 * orval config file
 * https://orval.dev/getting-started/configuration
 */
export default defineConfig({
  petstore: {
    input: {
      target: 'https://petstore.swagger.io/v2/swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/petstore',
      client: 'react-query',
      httpClient: 'axios',
      baseUrl: { getBaseUrlFromSpecification: true },
      override: {
        mutator: {
          path: './src/api/mutator/umi-request.ts',
          name: 'customRequest',
        },
      }
    }
  },
});
