import { ComponentAsset, EditorMode, ProBuilder } from '@ant-design/pro-editor';
import { buttonAssetParams } from './buttonAsset';

const ButtonComponentAsset = new ComponentAsset(buttonAssetParams);

export default () => {
  return (
    <>
      <ProBuilder
        onConfigChange={(config) => {
          console.log('config', config);
        }}
        componentAsset={ButtonComponentAsset}
        style={{ height: screen.height - 140 }}
        hideNavbar={false}
        logo={'Next Dev - CRUD Builder'}
        mode={EditorMode.Develop}
        // @ts-ignore
        editorAwareness={{
          panelSize: { width: 500 },
          panelExpand: true,
          panelPosition: { x: 0, y: 0 },
        }}
      />
    </>
  );
};
