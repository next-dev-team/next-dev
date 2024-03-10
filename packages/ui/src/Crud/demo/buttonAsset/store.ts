import { CreateAssetStore, createUseAssetStore } from '@ant-design/pro-editor';
import { ButtonConfig } from './models';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type ButtonStore = ButtonConfig;

const createStore: CreateAssetStore<ButtonStore> = () => ({}) as ButtonStore;

const { useStore } = createUseAssetStore<ButtonStore>();

export { createStore, useStore };
