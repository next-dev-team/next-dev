import type { AssetConfigModel, JSONSchema } from '@ant-design/pro-editor';

export type ButtonConfig = {
  apiUrl: string;
  listEndpoint: string;
  dataField: string[];
  columns: any[];
  totalItemField: string[];
  totalPageField: string[];
};

/**
 * Button Schema
 */
export const buttonSchema: JSONSchema<ButtonConfig> = {
  type: 'object',
  properties: {
    apiUrl: {
      type: 'string',
      description: 'apiUrl',
      title: 'Api Url',
      renderProps: {
        allowClear: true,
        autoFocus: true,
      },
    },
    listEndpoint: {
      type: 'string',
      title: 'List Endpoint',
    },
  },
};

export const buttonModel: AssetConfigModel = {
  key: 'content',
  schema: () => buttonSchema,
  emitter: (config) => {
    return {
      icon: config.content.text,
      children: config.content.text,
    };
  },
};
