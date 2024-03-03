import type { ProColumnType, ProFormInstance } from '@ant-design/pro-components'
import {
  ProCard,
  ProForm,
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
import { useRef, useState } from 'react'

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

type DataType = {
  age: number
  address: string
  name: string
  time: number
  key: number
  description: string
}

const columns: ProColumnType<DataType>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'time',
    dataIndex: 'time',
    valueType: 'date',
  },
]

const initData = {
  bordered: true,
  loading: false,
  columns,
  pagination: {
    show: true,
    pageSize: 5,
    current: 1,
    total: 100,
  },
  size: 'small',
  expandable: false,
  headerTitle: '高级表格',
  tooltip: '高级表格 tooltip',
  showHeader: true,
  footer: true,
  rowSelection: {},
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

const DynamicSettings = ({
  tableComp,
  playgroundColSpan = '490px',
}: {
  tableComp: any
  playgroundColSpan?: any
}) => {
  const ref = useRef<ProFormInstance>()

  const [config, setConfig] = useState<any>(initData)

  /** 去抖配置 */
  const updateConfig = useDebounceFn(async (state) => {
    setConfig(state)
  }, 20)

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
                label: '基本配置',
                key: 'tab1',
                children: (
                  <>
                    <ProForm.Group
                      title="表格配置"
                      size={0}
                      collapsible
                      direction="horizontal"
                      labelLayout="twoLine"
                    >
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="边框"
                        tooltip="bordered"
                        name="bordered"
                      />
                      <ProFormRadio.Group
                        tooltip={`size="middle"`}
                        radioType="button"
                        fieldProps={{
                          size: 'small',
                        }}
                        label="尺寸"
                        options={[
                          {
                            label: '大',
                            value: 'default',
                          },
                          {
                            label: '中',
                            value: 'middle',
                          },
                          {
                            label: '小',
                            value: 'small',
                          },
                        ]}
                        name="size"
                      />
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="加载中"
                        tooltip="loading"
                        name="loading"
                      />
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="显示标题"
                        tooltip="showHeader"
                        name="showHeader"
                      />
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="页脚"
                        tooltip="footer"
                        name="footer"
                      />
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="支持展开"
                        tooltip="expandable"
                        name="expandable"
                      />
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="行选择"
                        tooltip="rowSelection"
                        name="rowSelection"
                      />
                    </ProForm.Group>
                    <ProForm.Group
                      size={0}
                      collapsible
                      direction="horizontal"
                      labelLayout="twoLine"
                      tooltip="toolBarRender={false}"
                      title="工具栏"
                      extra={
                        <ProFormSwitch
                          fieldProps={{
                            size: 'small',
                          }}
                          noStyle
                          name="toolBarRender"
                        />
                      }
                    >
                      <ProFormText
                        fieldProps={{
                          size: 'small',
                        }}
                        label="表格标题"
                        name="headerTitle"
                        tooltip="headerTitle={false}"
                      />
                      <ProFormText
                        fieldProps={{
                          size: 'small',
                        }}
                        label="表格的tooltip"
                        name="tooltip"
                        tooltip="tooltip={false}"
                      />

                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="Icon 显示"
                        name={['options', 'show']}
                        tooltip="options={false}"
                      />
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="密度 Icon"
                        name={['options', 'density']}
                        tooltip="options={{ density:false }}"
                      />
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="keyWords"
                        name={['options', 'search']}
                        tooltip="options={{ search:'keyWords' }}"
                      />
                      <ProFormSwitch
                        label="全屏 Icon"
                        fieldProps={{
                          size: 'small',
                        }}
                        name={['options', 'fullScreen']}
                        tooltip="options={{ fullScreen:false }}"
                      />
                      <ProFormSwitch
                        label="列设置 Icon"
                        fieldProps={{
                          size: 'small',
                        }}
                        tooltip="options={{ setting:false }}"
                        name={['options', 'setting']}
                      />
                    </ProForm.Group>
                  </>
                ),
              },
              {
                label: '表单配置',
                key: 'tab3',
                children: (
                  <ProForm.Group
                    title="查询表单"
                    size={0}
                    collapsible
                    tooltip="search={false}"
                    direction="horizontal"
                    labelLayout="twoLine"
                    extra={
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        noStyle
                        name={['search', 'show']}
                      />
                    }
                  >
                    <ProFormText
                      label="查询按钮文案"
                      fieldProps={{
                        size: 'small',
                      }}
                      tooltip={`search={{searchText:"查询"}}`}
                      name={['search', 'searchText']}
                    />
                    <ProFormText
                      label="重置按钮文案"
                      fieldProps={{
                        size: 'small',
                      }}
                      tooltip={`search={{resetText:"重置"}}`}
                      name={['search', 'resetText']}
                    />
                    <ProFormSwitch
                      fieldProps={{
                        size: 'small',
                      }}
                      label="收起按钮"
                      tooltip={`search={{collapseRender:false}}`}
                      name={['search', 'collapseRender']}
                    />
                    <ProFormSwitch
                      fieldProps={{
                        size: 'small',
                      }}
                      label="表单收起"
                      name={['search', 'collapsed']}
                      tooltip={`search={{collapsed:false}}`}
                    />
                    <ProFormSelect
                      fieldProps={{
                        size: 'small',
                      }}
                      tooltip={`search={{span:8}}`}
                      options={[
                        {
                          label: '24',
                          value: 24,
                        },
                        {
                          label: '12',
                          value: 12,
                        },
                        {
                          label: '8',
                          value: 8,
                        },
                        {
                          label: '6',
                          value: 6,
                        },
                      ]}
                      label="表单栅格"
                      name={['search', 'span']}
                    />
                    <ProFormRadio.Group
                      radioType="button"
                      fieldProps={{
                        size: 'small',
                      }}
                      name={['search', 'layout']}
                      tooltip={`search={{layout:"${config.search?.layout}"}}`}
                      options={[
                        {
                          label: '垂直',
                          value: 'vertical',
                        },
                        {
                          label: '水平',
                          value: 'horizontal',
                        },
                      ]}
                      label="表单布局"
                    />
                    <ProFormRadio.Group
                      radioType="button"
                      fieldProps={{
                        size: 'small',
                      }}
                      name={['search', 'filterType']}
                      tooltip={`search={{filterType:"light"}}`}
                      options={[
                        {
                          label: '默认',
                          value: 'query',
                        },
                        {
                          label: '轻量',
                          value: 'light',
                        },
                      ]}
                      label="表单类型"
                    />
                  </ProForm.Group>
                ),
              },
              {
                label: '数据配置',
                key: 'tab2',
                children: (
                  <ProForm.Group
                    title="分页器"
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
                  >
                    <ProFormRadio.Group
                      tooltip={`pagination={size:"middle"}`}
                      radioType="button"
                      fieldProps={{
                        size: 'small',
                      }}
                      label="尺寸"
                      options={[
                        {
                          label: '默认',
                          value: 'default',
                        },
                        {
                          label: '小',
                          value: 'small',
                        },
                      ]}
                      name={['pagination', 'size']}
                    />
                    <ProFormDigit
                      fieldProps={{
                        size: 'small',
                      }}
                      label="页码"
                      tooltip={`pagination={{ current:10 }}`}
                      name={['pagination', 'current']}
                    />
                    <ProFormDigit
                      fieldProps={{
                        size: 'small',
                      }}
                      label="每页数量"
                      tooltip={`pagination={{ pageSize:10 }}`}
                      name={['pagination', 'pageSize']}
                    />
                    <ProFormDigit
                      fieldProps={{
                        size: 'small',
                      }}
                      label="数据总数"
                      tooltip={`pagination={{ total:100 }}`}
                      name={['pagination', 'total']}
                    />
                  </ProForm.Group>
                ),
              },
              {
                label: '列配置',
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
                      label="标题"
                    />
                    <ProFormGroup
                      style={{
                        marginBlockStart: 8,
                      }}
                    >
                      <ProFormSwitch label="过长省略" name="ellipsis" />
                      <ProFormSwitch label="复制按钮" name="copyable" />
                    </ProFormGroup>
                    <ProFormGroup
                      style={{
                        marginBlockStart: 8,
                      }}
                      size={8}
                    >
                      <ProFormSelect
                        label="dataIndex"
                        width="xs"
                        name="dataIndex"
                        valueEnum={{
                          age: 'age',
                          address: 'address',
                          name: 'name',
                          time: 'time',
                          description: 'string',
                        }}
                      />
                      <ProFormSelect
                        width="xs"
                        label="值类型"
                        name="valueType"
                        fieldProps={{
                          onChange: () => {
                            ref.current?.resetFields()
                          },
                        }}
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
                      <ProFormText width="xs" label="列提示" name="tooltip" />
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
                            label="数据枚举"
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
        {tableComp({ config })}
      </ProCard>
    </ProCard>
  )
}

export default DynamicSettings
