import type { ProFormInstance } from '@ant-design/pro-components'
import {
  ActionType,
  ProCard,
  ProForm,
  ProFormCascader,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
  useDebounceFn,
} from '@ant-design/pro-components'
import { caseConversion } from '@next-dev/utils'
import axios from 'axios'
import Mock, { Random } from 'mockjs'
import { useEffect, useRef, useState } from 'react'
import Crud, { ICrudCol } from '..'

const valueTypeArray = [
  'password',
  'money',
  'textarea',
  'option',
  'date',
  'dateWeek',
  'dateMonth',
  'dateQuarter',
  'dateYear',
  'dateRange',
  'dateTimeRange',
  'dateTime',
  'time',
  'timeRange',
  'text',
  'select',
  'checkbox',
  'rate',
  'radio',
  'radioButton',
  'index',
  'indexBorder',
  'progress',
  'percent',
  'digit',
  'second',
  'avatar',
  'code',
  'switch',
  'fromNow',
  'image',
  'jsonCode',
]

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
]

const initData = {
  dataIndex: [],
  bordered: false,
  loading: false,
  columns,
  pagination: {
    show: true,
    pageSize: 5,
    current: 1,
    total: 100,
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
}

const API_TOKEN = '0b4c0fa225e4e432de7e51fe13691e86e27ac12a360ca251bf714eeb00942325'

const axiosInstance = axios.create({
  baseURL: 'https://gorest.co.in/public/v1',
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
})

const mockImg =
  'https://images.pexels.com/photos/166055/pexels-photo-166055.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'

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
}

function isImgUrl(url: string): boolean {
  const pattern = /\bhttps?:\/\/\S+\.(?:jpg|jpeg|png|gif)\b/
  return pattern.test(url)
}
const DynamicSettings = ({ playgroundColSpan = '490px' }: { playgroundColSpan?: any }) => {
  const ref = useRef<ProFormInstance>()
  const actionRef = useRef<ActionType>(null)
  const refCrud = useRef<ProFormInstance>()
  const [config, setConfig] = useState(initData)
  const [data, setData] = useState<ICrudCol<any>[]>([])

  /** Debounce config*/
  const updateConfig = useDebounceFn(async (state) => {
    setConfig((prev) => ({
      ...prev,
      ...state,
    }))
  }, 20)

  // console.log('config', config)
  useEffect(() => {
    if (data === undefined) return
    const touchedCol = Object.keys(data?.[0] || {}).map((key, idx) => {
      let other: ICrudCol<any> = {}
      const colValue = (data?.[idx] as any)[key]

      if (isImgUrl(colValue)) other.valueType = 'image'

      return {
        title: caseConversion(key, 'camelToCapitalWord'),
        dataIndex: key,
        ...other,
      }
    })

    interface Option {
      value: string | number
      label: string
      children?: Option[]
    }
    function transformApiToCascaderOptions(apiResponse: any): Option[] {
      return Object.keys(apiResponse).map((key, idx) => {
        const colValue = apiResponse[key]
        if (Array.isArray(colValue)) {
          return {
            value: key,
            label: caseConversion(key, 'camelToCapitalWord'),
            children: transformApiToCascaderOptions(colValue[0]),
          }
        }

        return {
          value: key,
          label: caseConversion(key, 'camelToCapitalWord'),
        }
      })
    }

    const touchedDataIndex = transformApiToCascaderOptions(data?.[0] || {})
    updateConfig.run({
      columns: touchedCol,
      dataIndex: touchedDataIndex,
    })

    if (ref?.current) ref.current.setFieldValue('columns', touchedCol)
  }, [ref, data])

  console.log('data', config)

  return (
    <ProCard
      split="vertical"
      bordered
      headerBordered
      style={{
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <ProForm
        formRef={ref}
        layout="inline"
        initialValues={initData}
        submitter={false}
        colon={false}
        onValuesChange={(_, values) => updateConfig.run(values)}
      >
        <ProCard
          colSpan={playgroundColSpan}
          style={{
            height: '100vh',
            overflow: 'auto',
            boxShadow: '2px 0 6px rgba(0, 21, 41, 0.35)',
            top: 0,
            right: 0,
            width: playgroundColSpan,
          }}
          tabs={{
            items: [
              {
                label: 'data config',
                key: 'tab2',
                children: (
                  <>
                    <ProForm.Group
                      title="Data Source"
                      size={0}
                      collapsible
                      tooltip="pagination={}"
                      direction="horizontal"
                      labelLayout="twoLine"
                      extra={
                        <ProFormSwitch
                          fieldProps={{
                            size: 'small',
                          }}
                          noStyle
                          name={['pagination', 'show']}
                        />
                      }
                    ></ProForm.Group>
                    <ProForm.Group
                      title="Paginator"
                      size={0}
                      defaultCollapsed
                      collapsible
                      tooltip="pagination={}"
                      direction="horizontal"
                      labelLayout="twoLine"
                      extra={
                        <ProFormSwitch
                          fieldProps={{
                            size: 'small',
                          }}
                          noStyle
                          name={['pagination', 'show']}
                        />
                      }
                    >
                      <ProFormRadio.Group
                        tooltip={`pagination={size:"middle"}`}
                        radioType="button"
                        fieldProps={{
                          size: 'small',
                        }}
                        label="size"
                        options={[
                          {
                            label: 'default',
                            value: 'default',
                          },
                          {
                            label: 'small',
                            value: 'small',
                          },
                        ]}
                        name={['pagination', 'size']}
                      />
                      <ProFormDigit
                        fieldProps={{
                          size: 'small',
                        }}
                        label="page number"
                        tooltip={`pagination={{ current:10 }}`}
                        name={['pagination', 'current']}
                      />
                      <ProFormDigit
                        fieldProps={{
                          size: 'small',
                        }}
                        label="Quantity per page"
                        tooltip={`pagination={{ pageSize:10 }}`}
                        name={['pagination', 'pageSize']}
                      />
                      <ProFormDigit
                        fieldProps={{
                          size: 'small',
                        }}
                        label="Total number of data"
                        tooltip={`pagination={{ total:100 }}`}
                        name={['pagination', 'total']}
                      />
                    </ProForm.Group>
                  </>
                ),
              },
              {
                label: 'Column config',
                key: 'tab4',
                children: (
                  <ProFormList
                    name="columns"
                    itemRender={({ listDom, action }) => {
                      return (
                        <ProCard
                          bordered
                          style={{
                            marginBlockEnd: 8,
                            position: 'relative',
                          }}
                          bodyStyle={{
                            padding: 8,
                            paddingInlineEnd: 16,
                            paddingBlockStart: 16,
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              top: -4,
                              right: 2,
                            }}
                          >
                            {action}
                          </div>
                          {listDom}
                        </ProCard>
                      )
                    }}
                  >
                    <ProFormText
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                      name="title"
                      label="title"
                    />
                    <ProFormGroup
                      style={{
                        marginBlockStart: 8,
                      }}
                    >
                      <ProFormSwitch label="Ellipsis" name="ellipsis" />
                      <ProFormSwitch label="copy button" name="copyable" />
                    </ProFormGroup>
                    <ProFormGroup
                      style={{
                        marginBlockStart: 8,
                      }}
                      size={8}
                    >
                      <ProFormCascader
                        name={'dataIndex'}
                        request={async () => config.dataIndex}
                        placeholder="Please select"
                      />

                      <ProFormSelect
                        width="xs"
                        label="value type"
                        name="valueType"
                        fieldProps={
                          {
                            // onChange: () => {
                            //   ref.current?.resetFields()
                            // },
                          }
                        }
                        options={valueTypeArray.map((value) => ({
                          label: value,
                          value,
                        }))}
                      />
                    </ProFormGroup>
                    <ProFormGroup
                      style={{
                        marginBlockStart: 8,
                      }}
                      size={8}
                    >
                      <ProFormText width="sm" label="title tooltip" name="tooltip" />
                    </ProFormGroup>
                    <ProFormDependency name={['valueType', 'valueEnum']}>
                      {({ valueType, valueEnum }) => {
                        if (valueType !== 'select') {
                          return null
                        }
                        return (
                          <ProFormTextArea
                            formItemProps={{
                              style: {
                                marginBlockStart: 8,
                              },
                            }}
                            fieldProps={{
                              value: JSON.stringify(valueEnum),
                            }}
                            normalize={(value) => {
                              return JSON.parse(value)
                            }}
                            label="data enumeration"
                            name="valueEnum"
                          />
                        )
                      }}
                    </ProFormDependency>
                  </ProFormList>
                ),
              },
            ],
          }}
        />
      </ProForm>
      <ProCard
        style={{
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Crud
          columns={config.columns as any}
          headerTitle="Auto CRUD"
          // custom dataSource
          postData={(resData: any[]) => {
            const touchedData = resData.map((item, idx) => {
              return {
                ...item,
                ...mockData,
              }
            })

            if (data.length === 0) {
              setData(touchedData)
            }
            return touchedData
          }}
          formRef={refCrud}
          addOrEditProps={{
            addReqOpt: (row) => ({
              url: '/users',
            }),
            editReqOpt: (row) => ({
              url: `/users/${row.id}`,
            }),
          }}
          listProps={{
            listReqOpt: ({ current, pageSize, ...rest }) => ({
              url: '/users',
              params: {
                ...rest,
                per_page: pageSize,
                page: current,
              },
            }),
            deleteReqOpt: (row) => ({ url: `/users/${row.id}` }),
            dataField: ['data', 'data'],
            totalItemField: ['data', 'meta', 'pagination', 'total'],
            totalPageField: ['data', 'meta', 'pagination', 'pages'],
          }}
          detailProps={{
            requestOpt: (row) => ({ url: `/users/${row.id}` }),
            modalOpt: (row) => ({
              title: `User Info: ${row?.name}`,
            }),
            dataField: ['data', 'data'],
            postData: (data) => {
              return {
                ...data,
                ...mockData,
              }
            },
          }}
          axios={axiosInstance}
          actionRef={actionRef}
        />
      </ProCard>
    </ProCard>
  )
}

export default DynamicSettings
