import getBaseConfig from '@rnr/configs/kubb-react-query';

export default getBaseConfig({
  baseURL: 'https://petstore3.swagger.io/api/v3',
  reactQuery: {
    override: [
      {
        type: 'operationId',
        pattern: 'findPetsByTags',
        options: {
          client: {
            dataReturnType: 'full',
          },
          infinite: {
            queryParam: 'pageSize',
            initialPageParam: 0,
            cursorParam: undefined,
          },
        },
      },
      {
        type: 'operationId',
        pattern: 'getInventory',
        options: {
          query: false,
        },
      },
      {
        type: 'operationId',
        pattern: 'updatePetWithForm',
        options: {
          query: {
            importPath: '@tanstack/react-query',
            methods: ['post'],
          },
          mutation: {
            importPath: '@tanstack/react-query',
            methods: ['put', 'delete'],
          },
          pathParamsType: 'inline',
        },
      },
    ],
  },
});
