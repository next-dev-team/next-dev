import { ActionType, ProFormInstance } from '@ant-design/pro-components';
import { useProBuilderStore } from '@ant-design/pro-editor';
import { Crud, Modal, Space, Typography } from '@next-dev/ui';
import { caseConversion, toCascaderOptions } from '@next-dev/utils';
import axios from 'axios';
import isEqual from 'fast-deep-equal';
import { memo, useEffect, useRef, useState } from 'react';
import { ICrudCol } from '../..';
import { ButtonConfig } from './models';

const API_TOKEN = '0b4c0fa225e4e432de7e51fe13691e86e27ac12a360ca251bf714eeb00942325';

function isImgUrl(url: string): boolean {
  const pattern = /\bhttps?:\/\/\S+\.(?:jpg|jpeg|png|gif)\b/;
  return pattern.test(url);
}
export const ButtonComponent = memo(() => {
  const config = useProBuilderStore<ButtonConfig & { pagination: any }>((s) => s.config, isEqual);
  const actionRef = useRef<ActionType>(null);
  const ref = useRef<ProFormInstance>();
  const [data, setData] = useState<ICrudCol<any>[]>([]);
  const [dataFieldOpt, setDataFieldOpt] = useState(undefined);

  useEffect(() => {
    if (data === undefined) return;
    const touchedCol = Object.keys(data?.[0] || {}).map((key, idx) => {
      let other: ICrudCol<any> = {};
      const colValue = (data?.[idx] as any)?.[key];
      if (isImgUrl(colValue)) other.valueType = 'image';
      if (typeof colValue === 'boolean') other.valueType = 'switch';
      if (typeof colValue === 'number') other.valueType = 'digit';
      if (Array.isArray(colValue)) {
        other.valueType = 'formList';
        other.hideInTable = true;
        other.hideInSearch = true;
        other.initialValue = [{}];
      }

      return {
        title: caseConversion(key, 'camelToCapitalWord'),
        dataIndex: key,
        valueType: 'text',
        ...other,
      };
    });

    const touchedDataIndex = toCascaderOptions(data?.[0] || {});
    const touchedDataField = toCascaderOptions(dataFieldOpt || {});
    // updateConfig.run({
    //   columns: touchedCol,
    //   dataIndex: touchedDataIndex,
    //   dataOptions: touchedDataField,
    // });

    if (ref?.current) ref.current.setFieldValue('columns', touchedCol);
  }, [data]);

  // console.log(data);
  return (
    <Crud
      columns={config.columns}
      headerTitle={
        <Space direction="vertical">
          <Typography>Auto CRUD</Typography>
          <Typography.Paragraph type="secondary">
            The default API is free real API for testing world wide, don't submit any sensitive
            info, some data not editable
          </Typography.Paragraph>
        </Space>
      }
      // custom dataSource
      postData={(resData: any[]) => {
        const touchedData = resData.map((item, idx) => {
          return {
            ...item,
            // ...mockData,
          };
        });

        if (data.length === 0) {
          setData(touchedData);
        }
        return touchedData;
      }}
      formRef={ref}
      addOrEditProps={{
        addReqOpt: (row) => ({
          url: config.listEndpoint,
        }),
        editReqOpt: (row) => ({
          url: `/users/${row.id}`,
        }),
      }}
      onRequestError={() => {
        setData([]);
        setDataFieldOpt(undefined);
        Modal.error({
          title: 'Request Data',
          content:
            'double check the input endpoint configuration, authentication methods, and required parameters',
        });
      }}
      {...(!config?.pagination?.show && {
        pagination: false,
      })}
      listProps={{
        onResponse(res) {
          // if (dataFieldOpt) return res;
          // setDataFieldOpt(res);
          return res;
        },
        listReqOpt: ({ current, pageSize, ...rest }) => ({
          url: config.listEndpoint,
          params: {
            ...rest,
            [config.pagination?.pageSizeQueryField]: pageSize,
            [config.pagination?.pageQueryField]: current,
          },
        }),

        deleteReqOpt: (row) => ({ url: `${config.listEndpoint}/${row.id}` }),
        dataField: config.dataField || [],
        totalItemField: config.totalItemField,
        totalPageField: config.totalPageField,
      }}
      detailProps={{
        requestOpt: (row) => ({ url: `${config.listEndpoint}/${row.id}` }),
        modalOpt: (row) => ({
          title: `User Info: ${row?.name}`,
        }),
        dataField: ['data', 'data'],
        postData: (data) => {
          return {
            ...data,
          };
        },
      }}
      axios={axios.create({
        baseURL: config.apiUrl,
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      })}
      actionRef={actionRef}
    />
  );
});
