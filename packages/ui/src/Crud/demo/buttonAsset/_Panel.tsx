import { LevaPanel } from '@ant-design/leva-panel';
import { useProBuilderStore } from '@ant-design/pro-editor';
import { Button, Divider, Space } from 'antd';
import isEqual from 'fast-deep-equal';
import { FC, memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { shallow } from 'zustand/shallow';

import { RedoOutlined, UndoOutlined } from '@ant-design/icons';
import { ProCard, ProFormCascader } from '@ant-design/pro-components';
import { ButtonConfig, buttonModel } from './models';

export const ButtonPanel: FC = memo(() => {
  const data = useProBuilderStore((s) => s.config, isEqual) || {};
  const [updateConfig, undo, redo, undoStack, redoStack] = useProBuilderStore(
    (s) => [s.setConfig, s.undo, s.redo, s.undoStack().length, s.redoStack().length],
    shallow,
  );

  return (
    <ProCard
      title="Configs"
      headerBordered
      bordered
      size="small"
      extra={
        <Space>
          <Button icon={<UndoOutlined />} onClick={undo} disabled={undoStack === 0}>
            <Flexbox style={{ display: 'inline-flex' }} horizontal gap={4}>
              <div>Undo</div>
            </Flexbox>
          </Button>
          <Button icon={<RedoOutlined />} onClick={redo} disabled={redoStack === 0}>
            Redo
          </Button>
        </Space>
      }
      tabs={{
        size: 'small',
        items: [
          {
            key: 'tab1',
            label: 'Data',
            children: (
              <>
                <LevaPanel<ButtonConfig>
                  schema={buttonModel.schema()}
                  onChange={(data, item) => {
                    updateConfig(item, { replace: true });
                  }}
                  value={data}
                  title={'CRUD'}
                />
                <Divider />
                <Flexbox horizontal gap={4} align={'center'} padding={8}>
                  <ProFormCascader
                    disabled={!data?.apiUrl}
                    width="md"
                    name={'dataField'}
                    label="Data Field"
                    fieldProps={{
                      changeOnSelect: true,
                      options: [],
                      dropdownMatchSelectWidth: 600,
                      onChange: () => {},
                    }}
                    placeholder="Select field array"
                  />
                  {/* <Button
                    onClick={() => {
                      updateConfig(
                        { children: 'Primary Button', size: 'small', type: 'primary' },
                        { replace: true },
                      );
                    }}
                  >
                    Primary Button
                  </Button> */}
                </Flexbox>
              </>
            ),
          },
        ],
      }}
    ></ProCard>
  );
});
