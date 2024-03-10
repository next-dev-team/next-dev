import type { ComponentAssetParams } from '@ant-design/pro-editor';
import { ButtonComponent } from './_Component';
import { ButtonPanel } from './_Panel';
import codeEmitter from './codeEmitter';
import { ButtonConfig, buttonModel } from './models';
import { createStore } from './store';

export const buttonAssetParams: ComponentAssetParams<ButtonConfig> = {
  id: 'CRUD',
  createStore,
  ui: {
    rules: [],
    Component: ButtonComponent,
    ConfigPanel: ButtonPanel,
  },

  models: [buttonModel],
  defaultConfig: {
    apiUrl: 'https://gorest.co.in/public/v1',
    listEndpoint: '/users',
    dataField: [],
    columns: [],
    totalItemField: [],
    totalPageField: [],
  },

  storeOptions: {
    devtools: { name: 'ButtonAssetStore' },
  },

  codeEmitter: ({ apiUrl, dataField, totalItemField, totalPageField, ...config }) =>
    codeEmitter({
      ...config,
    }),
};
