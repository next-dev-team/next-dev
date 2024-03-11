import { EditOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import {
  ActionType,
  ModalForm,
  ProCard,
  ProForm,
  ProFormCascader,
  ProFormCheckbox,
  ProFormSwitch,
  ProFormText,
  useDebounceFn,
} from '@ant-design/pro-components';
import { ColumnList, DraggablePanel } from '@ant-design/pro-editor';
import { caseConversion, toCascaderOptions } from '@next-dev/utils';
import { Button, Col, Modal, Row, Space, Typography } from 'antd';
import axios from 'axios';
import Mock, { Random } from 'mockjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import Crud, { ICrudCol } from '..';
import { valueTypeArray } from './helper';

const columns: ICrudCol<any>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    valueType: 'select',
  },
];
const API_TOKEN = '0b4c0fa225e4e432de7e51fe13691e86e27ac12a360ca251bf714eeb00942325';

const initData = {
  dataIndex: [],
  bordered: false,
  loading: false,
  columns,
  pagination: {
    show: true,
    pageQueryField: 'page',
    pageSizeQueryField: 'per_page',
  },
  size: 'middle',
  expandable: false,
  headerTitle: 'Advanced form',
  tooltip: 'CRUD builder ',
  showHeader: true,
  footer: true,
  rowSelection: false,
  scroll: false,
  hasData: true,
  tableLayout: undefined,
  toolBarRender: true,
  search: {
    show: true,
    span: 12,
    collapseRender: true,
    labelWidth: 80,
    filterType: 'query',
    layout: 'horizontal',
  },
  options: {
    show: true,
    density: true,
    fullScreen: true,
    setting: true,
  },
  apiUrl: 'https://gorest.co.in/public/v1',
  responseList: undefined,
  dataOptions: [],
  dataField: ['data', 'data'],
  totalItemField: ['data', 'meta', 'pagination', 'total'],
  totalPageField: ['data', 'meta', 'pagination', 'pages'],
  apiToken: API_TOKEN,
  listEndpoint: '/users',
};

const mockImg =
  'https://images.pexels.com/photos/166055/pexels-photo-166055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

const mockData = {
  tags: Mock.mock({
    'tags|8': [
      {
        'id|+1': 1,
        name: '@word',
      },
    ],
  }).tags,
  img: mockImg,
  img1: mockImg,
  publishDate: Random.datetime(),
  formList: Mock.mock({
    'formList|3': [
      {
        'id|+1': 1,
        name: '@title',
        textarea: '@paragraph',
      },
    ],
  }).formList,
};

function isImgUrl(url: string): boolean {
  const pattern = /\bhttps?:\/\/\S+\.(?:jpg|jpeg|png|gif)\b/;
  return pattern.test(url);
}
const DynamicSettings = ({ playgroundColSpan = '470px' }: { playgroundColSpan?: any }) => {
  const ref = useRef<ProFormInstance>();
  const actionRef = useRef<ActionType>(null);
  const refCrud = useRef<ProFormInstance>();
  const [config1, setConfig] = useState(initData);
  const config = useMemo(() => config1, [config1]);

  const [data, setData] = useState<ICrudCol<any>[]>([]);
  const [dataFieldOpt, setDataFieldOpt] = useState(undefined);

  /** Debounce config*/
  const updateConfig = useDebounceFn(async (state) => {
    setConfig((prev) => ({
      ...prev,
      ...state,
    }));
  }, 20);
  const reloadAndRest = useDebounceFn(async () => {
    actionRef.current?.reloadAndRest?.();
  }, 200);

  // console.log('data', config)

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
    updateConfig.run({
      columns: touchedCol,
      dataIndex: touchedDataIndex,
      dataOptions: touchedDataField,
    });

    if (ref?.current) ref.current.setFieldValue('columns', touchedCol);
  }, [data]);

  useEffect(() => {
    Modal.info({
      width: '80%',
      icon: null,
      content: (
        <ProCard
          tabs={{
            size: 'small',
            items: [
              {
                key: 'tab1',
                label: 'Config - 01',
                children: (
                  <ProFormCheckbox.Group
                    name="checkbox-group"
                    label="Checkbox.Group"
                    options={['A', 'B', 'C', 'D', 'E', 'F']}
                  />
                ),
              },
            ],
          }}
          size="small"
          headerBordered
          bordered
          title="Custom Render"
        ></ProCard>
      ),
    });
  }, []);

  return (
    <Flexbox style={{ minHeight: 300 }}>
      <DraggablePanel placement="top" minHeight={450}>
        <ProForm
          formRef={ref}
          layout="inline"
          initialValues={initData}
          submitter={false}
          colon={false}
          onValuesChange={(_, values) => {
            console.log('values', values);
            updateConfig.run(values);
          }}
        >
          <ProCard
            boxShadow={false}
            size="small"
            // colSpan={playgroundColSpan}
            style={{
              height: '46vh',
              overflow: 'auto',
              boxShadow: '2px 0 6px rgba(0, 21, 41, 0.35)',
            }}
            // title="Playground"
            // extra={
            //   <Space>
            //     <ModalForm
            //       size="small"
            //       submitter={false}
            //       modalProps={{ destroyOnClose: true, width: '70%', title: 'View Configs' }}
            //       trigger={
            //         <Button type="link">
            //           <EyeOutlined />
            //           View Configs
            //         </Button>
            //       }
            //     >
            //       <ReactJson displayDataTypes={false} collapsed={1} src={config} />
            //     </ModalForm>
            //     <ModalForm
            //       size="small"
            //       submitter={false}
            //       modalProps={{ destroyOnClose: true, width: '70%', title: 'Data Source' }}
            //       trigger={
            //         <Button type="link">
            //           <EyeOutlined />
            //           Data Source
            //         </Button>
            //       }
            //     >
            //       <ReactJson displayDataTypes={false} collapsed={2} src={data} />
            //     </ModalForm>
            //   </Space>
            // }
            tabs={{
              size: 'small',
              items: [
                {
                  label: 'Data config',
                  key: 'tab1',
                  children: (
                    <Row
                      gutter={[20, 20]}
                      align="middle"
                      justify="center"
                      className="max-w-[80%] mx-auto"
                    >
                      <Col span={8}>
                        <ProForm.Group
                          title="Data Source"
                          size={0}
                          collapsible={false}
                          tooltip="pagination={}"
                          direction="horizontal"
                          labelLayout="twoLine"
                          extra={
                            <ProFormSwitch
                              fieldProps={{
                                size: 'small',
                              }}
                              noStyle
                              name={['pagination', 'dataSource']}
                            />
                          }
                        >
                          <ProFormText
                            width="md"
                            label="API URL"
                            fieldProps={{
                              onChange: () => {
                                if (ref?.current) {
                                  ref.current.setFieldValue('dataField', '');
                                  ref.current.setFieldValue('listEndpoint', '');
                                  ref.current.setFieldValue('totalItemField', '');
                                  ref.current.setFieldValue('totalPageField', '');
                                }
                                reloadAndRest.run();
                              },
                            }}
                            name="apiUrl"
                            placeholder={'https://gorest.co.in/public/v1'}
                          />
                          <ProFormText.Password
                            width="md"
                            label="API Token"
                            fieldProps={{
                              allowClear: true,
                              onChange: () => {
                                reloadAndRest.run();
                              },
                            }}
                            name="apiToken"
                            placeholder={'xxxx'}
                          />
                        </ProForm.Group>
                      </Col>
                      <Col span={8}>
                        <ProForm.Group
                          title="List Props"
                          size={0}
                          defaultCollapsed={false}
                          collapsible
                          tooltip="pagination={}"
                          direction="horizontal"
                          labelLayout="twoLine"
                        >
                          <ProFormText
                            disabled={!config.apiUrl}
                            width="md"
                            label="Endpoint"
                            fieldProps={{
                              onChange: () => {
                                reloadAndRest.run();
                              },
                            }}
                            name="listEndpoint"
                            placeholder={'/user'}
                          />
                          <ProFormCascader
                            disabled={!config.apiUrl}
                            width="md"
                            name={'dataField'}
                            label="Data Field"
                            fieldProps={{
                              changeOnSelect: true,
                              options: config.dataOptions || [],
                              dropdownMatchSelectWidth: 600,
                              onChange: () => {
                                reloadAndRest.run();
                              },
                            }}
                            placeholder="Select field array"
                          />
                          <ProFormCascader
                            disabled={!config.apiUrl}
                            width="md"
                            name={'totalItemField'}
                            label="Total Field"
                            fieldProps={{
                              changeOnSelect: true,
                              options: config.dataOptions || [],
                              dropdownMatchSelectWidth: 600,
                              onChange: () => {
                                reloadAndRest.run();
                              },
                            }}
                            placeholder="Select field array"
                          />
                          <ProFormCascader
                            width="md"
                            disabled={!config.apiUrl}
                            name={'totalPageField'}
                            label="Total Page"
                            fieldProps={{
                              changeOnSelect: true,
                              options: config.dataOptions || [],
                              dropdownMatchSelectWidth: 600,
                              onChange: () => {
                                reloadAndRest.run();
                              },
                            }}
                            placeholder="Select field array"
                          />
                        </ProForm.Group>
                      </Col>
                      <Col span={8}>
                        <ProForm.Group
                          title="Paginator"
                          size={0}
                          collapsible
                          tooltip="pagination={}"
                          direction="horizontal"
                          labelLayout="twoLine"
                          extra={
                            <ProFormSwitch
                              fieldProps={{
                                size: 'small',
                                onChange: () => {
                                  reloadAndRest.run();
                                },
                              }}
                              noStyle
                              name={['pagination', 'show']}
                            />
                          }
                        >
                          <ProFormText
                            fieldProps={{
                              size: 'small',
                              onChange: () => {
                                reloadAndRest.run();
                              },
                            }}
                            label="Page  query field"
                            tooltip={`params: { ...rest, page: current, }`}
                            name={['pagination', 'pageQueryField']}
                          />
                          <ProFormText
                            fieldProps={{
                              size: 'small',
                              onChange: () => {
                                reloadAndRest.run();
                              },
                            }}
                            label="Page size query field"
                            tooltip={` params: { ...rest,  per_page: pageSize, },
                        `}
                            name={['pagination', 'pageSizeQueryField']}
                          />
                        </ProForm.Group>
                      </Col>
                    </Row>
                  ),
                },
                {
                  label: 'Columns config',
                  key: 'tab2',
                  children: (
                    <>
                      <ColumnList
                        initialValues={config.columns}
                        onChange={(nextColumns) => {
                          console.log(['nextColumns11', nextColumns]);
                          updateConfig.run({ columns: nextColumns });
                        }}
                        columns={[
                          {
                            title: 'DataIndex',
                            dataIndex: 'dataIndex',
                            type: 'select',
                            options: config.dataIndex,
                          },
                          {
                            title: 'Title',
                            dataIndex: 'title',
                            type: 'input',
                          },
                          {
                            title: 'ValueType',
                            dataIndex: 'valueType',
                            type: 'select',
                            options: valueTypeArray.map((item) => ({
                              label: caseConversion(item, 'camelToCapitalWord'),
                              value: item,
                            })),
                          },
                          {
                            title: 'Custom',
                            type: 'custom',
                            render: ({ index }, d) => (
                              <ModalForm
                                width={'90%'}
                                trigger={
                                  <Button type="link" icon={<EditOutlined />}>
                                    Custom Render
                                  </Button>
                                }
                              >
                                <ProCard title="Custom Render"></ProCard>
                              </ModalForm>
                            ),
                          },
                        ]}
                      />
                    </>
                  ),
                },
                // {
                //   label: 'Columns config V1',
                //   key: 'tab21',
                //   children: (
                //     <>
                //       <ColumnList
                //         initialValues={config.columns}
                //         onChange={(nextColumns) => {
                //           console.log(['nextColumns11', nextColumns])
                //           updateConfig.run({ columns: nextColumns })
                //         }}
                //         columns={[
                //           {
                //             title: 'DataIndex',
                //             dataIndex: 'dataIndex',
                //             type: 'select',
                //             options: config.dataIndex,
                //           },
                //           {
                //             title: 'Title',
                //             dataIndex: 'title',
                //             type: 'input',
                //           },
                //           {
                //             title: 'ValueType',
                //             dataIndex: 'valueType',
                //             type: 'select',
                //             options: valueTypeArray.map((item) => ({
                //               label: caseConversion(item, 'camelToCapitalWord'),
                //               value: item,
                //             })),
                //           },

                //           {
                //             title: 'Hide/Show',
                //             type: 'custom',
                //             render: () => {
                //               return (
                //                 <ProFormGroup size={'small'} collapsible>
                //                   <ProFormSwitch
                //                     fieldProps={{ size: 'small' }}
                //                     label="Hide in table"
                //                     name="hideInTable"
                //                   />
                //                   <ProFormSwitch
                //                     fieldProps={{ size: 'small' }}
                //                     label="Hide in form"
                //                     name="hideInForm"
                //                   />
                //                   <ProFormSwitch
                //                     fieldProps={{ size: 'small' }}
                //                     label="Hide in search"
                //                     name="hideInSearch"
                //                   />
                //                   <ProFormSwitch
                //                     fieldProps={{
                //                       size: 'small',
                //                     }}
                //                     label="Hide in detail"
                //                     name="hideInDescription"
                //                   />
                //                   <ProFormSwitch
                //                     fieldProps={{ size: 'small' }}
                //                     label="Hide in setting"
                //                     name="hideInSetting"
                //                   />
                //                   <ProFormSwitch
                //                     fieldProps={{
                //                       size: 'small',
                //                     }}
                //                     label="Ellipsis"
                //                     name="ellipsis"
                //                   />
                //                   <ProFormSwitch
                //                     fieldProps={{ size: 'small' }}
                //                     label="copy button"
                //                     name="copyable"
                //                   />
                //                 </ProFormGroup>
                //               )
                //             },
                //           },
                //           {
                //             title: 'tooltip',
                //             dataIndex: 'tooltip',
                //           },
                //         ]}
                //       />
                //     </>
                //   ),
                // },
                // {
                //   label: 'Column config',
                //   key: 'tab4',
                //   children: (
                //     <ProFormList
                //       alwaysShowItemLabel
                //       name="columns"
                //       itemRender={({ listDom, action }, listMeta) => {
                //         const colTitle = config?.columns?.[listMeta?.index]?.title
                //         return (
                //           <ProCard
                //             size="small"
                //             title={
                //               <Typography.Title level={5} className="mb-0">
                //                 {(colTitle as string) || listMeta?.index.toString()}
                //               </Typography.Title>
                //             }
                //             bordered
                //             style={{
                //               marginBlockEnd: 8,
                //               position: 'relative',
                //             }}
                //             bodyStyle={{
                //               padding: 8,
                //               paddingInlineEnd: 8,
                //               paddingBlockStart: 8,
                //             }}
                //           >
                //             <div
                //               style={{
                //                 position: 'absolute',
                //                 top: -4,
                //                 right: 2,
                //               }}
                //             >
                //               {action}
                //             </div>
                //             {listDom}
                //           </ProCard>
                //         )
                //       }}
                //     >
                //       <ProFormText
                //         rules={[
                //           {
                //             required: true,
                //           },
                //         ]}
                //         fieldProps={{ size: 'small' }}
                //         name="title"
                //         label="title"
                //       />
                //       <ProFormGroup size={'small'}>
                //         <ProFormSwitch
                //           fieldProps={{ size: 'small' }}
                //           label="Hide in table"
                //           name="hideInTable"
                //         />
                //         <ProFormSwitch
                //           fieldProps={{ size: 'small' }}
                //           label="Hide in form"
                //           name="hideInForm"
                //         />
                //         <ProFormSwitch
                //           fieldProps={{ size: 'small' }}
                //           label="Hide in search"
                //           name="hideInSearch"
                //         />
                //         <ProFormSwitch
                //           fieldProps={{
                //             size: 'small',
                //           }}
                //           label="Hide in detail"
                //           name="hideInDescription"
                //         />
                //         <ProFormSwitch
                //           fieldProps={{ size: 'small' }}
                //           label="Hide in setting"
                //           name="hideInSetting"
                //         />
                //         <ProFormSwitch
                //           fieldProps={{
                //             size: 'small',
                //           }}
                //           label="Ellipsis"
                //           name="ellipsis"
                //         />
                //         <ProFormSwitch
                //           fieldProps={{ size: 'small' }}
                //           label="copy button"
                //           name="copyable"
                //         />
                //       </ProFormGroup>
                //       <ProFormGroup
                //         style={{
                //           marginBlockStart: 8,
                //         }}
                //         size={8}
                //       >
                //         <ProFormCascader
                //           name={'dataIndex'}
                //           request={async () => config.dataIndex}
                //           placeholder="Please select"
                //           label="dataIndex"
                //           width={'sm'}
                //           fieldProps={{
                //             size: 'small',
                //           }}
                //         />

                //         <ProFormSelect
                //           width="sm"
                //           label="Value type"
                //           name="valueType"
                //           fieldProps={{
                //             popupMatchSelectWidth: 200,
                //             size: 'small',
                //           }}
                //           allowClear
                //           options={valueTypeArray.map((value) => ({
                //             label: value,
                //             value,
                //           }))}
                //         />
                //       </ProFormGroup>
                //       <ProFormGroup
                //         style={{
                //           marginBlockStart: 8,
                //         }}
                //         size={8}
                //       >
                //         <ProFormText
                //           allowClear
                //           fieldProps={{
                //             size: 'small',
                //           }}
                //           width="sm"
                //           label="title tooltip"
                //           name="tooltip"
                //         />
                //         <ProFormDigit
                //           allowClear
                //           width="sm"
                //           min={30}
                //           fieldProps={{ step: 10, size: 'small' }}
                //           label="Width"
                //           name="width"
                //         />
                //       </ProFormGroup>
                //       <ProFormDependency name={['valueType', 'valueEnum']}>
                //         {({ valueType, valueEnum }) => {
                //           if (valueType !== 'select') {
                //             return null
                //           }
                //           return (
                //             <ProFormTextArea
                //               formItemProps={{
                //                 style: {
                //                   marginBlockStart: 8,
                //                 },
                //               }}
                //               fieldProps={{
                //                 value: JSON.stringify(valueEnum),
                //               }}
                //               normalize={(value) => {
                //                 return JSON.parse(value)
                //               }}
                //               label="data enumeration"
                //               name="valueEnum"
                //             />
                //           )
                //         }}
                //       </ProFormDependency>
                //     </ProFormList>
                //   ),
                // },
              ],
            }}
          />
        </ProForm>
      </DraggablePanel>
      <div className="flex-1 overflow-auto h-screen">
        <Crud
          columns={config.columns as any}
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
                ...mockData,
              };
            });

            // if (data.length === 0) {
            setData(touchedData);
            // }
            return touchedData;
          }}
          formRef={refCrud}
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
              if (dataFieldOpt) return res;
              setDataFieldOpt(res);
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
                ...mockData,
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
      </div>
    </Flexbox>
  );
};

export default DynamicSettings;
