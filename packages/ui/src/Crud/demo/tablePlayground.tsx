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
import SelectDataSource from './SelectDataSource'

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
  headerTitle: 'Advanced form',
  tooltip: 'Advanced table tooltip',
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

  /** Debounce config*/
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
                    >
                      <SelectDataSource />
                    </ProForm.Group>
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
                      <ProFormSwitch label="Too long to omit" name="ellipsis" />
                      <ProFormSwitch label="copy button" name="copyable" />
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
                        label="value type"
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
                            label="data enumeration"
                            name="valueEnum"
                          />
                        )
                      }}
                    </ProFormDependency>
                  </ProFormList>
                ),
              },
              {
                label: 'Basic config',
                key: 'tab1',
                children: (
                  <>
                    <ProForm.Group
                      title="Table config"
                      size={0}
                      collapsible
                      direction="horizontal"
                      labelLayout="twoLine"
                    >
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="border"
                        tooltip="bordered"
                        name="bordered"
                      />
                      <ProFormRadio.Group
                        tooltip={`size="middle"`}
                        radioType="button"
                        fieldProps={{
                          size: 'small',
                        }}
                        label="size"
                        options={[
                          {
                            label: 'big',
                            value: 'default',
                          },
                          {
                            label: '中',
                            value: 'middle',
                          },
                          {
                            label: 'small',
                            value: 'small',
                          },
                        ]}
                        name="size"
                      />
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="Loading"
                        tooltip="loading"
                        name="loading"
                      />
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="show title"
                        tooltip="showHeader"
                        name="showHeader"
                      />
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="footer"
                        tooltip="footer"
                        name="footer"
                      />
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="Support expansion"
                        tooltip="expandable"
                        name="expandable"
                      />
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="row selection"
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
                      title="Toolbar"
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
                        label="table title"
                        name="headerTitle"
                        tooltip="headerTitle={false}"
                      />
                      <ProFormText
                        fieldProps={{
                          size: 'small',
                        }}
                        label="tooltip of the table"
                        name="tooltip"
                        tooltip="tooltip={false}"
                      />

                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="Icon display"
                        name={['options', 'show']}
                        tooltip="options={false}"
                      />
                      <ProFormSwitch
                        fieldProps={{
                          size: 'small',
                        }}
                        label="DensityIcon"
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
                        label="Full screen Icon"
                        fieldProps={{
                          size: 'small',
                        }}
                        name={['options', 'fullScreen']}
                        tooltip="options={{ fullScreen:false }}"
                      />
                      <ProFormSwitch
                        label="Column Settings Icon"
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
                label: 'Form config',
                key: 'tab3',
                children: (
                  <ProForm.Group
                    title="Query form"
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
                      label="Query button copy"
                      fieldProps={{
                        size: 'small',
                      }}
                      tooltip={`search={{searchText:"query"}}`}
                      name={['search', 'searchText']}
                    />
                    <ProFormText
                      label="Reset button copy"
                      fieldProps={{
                        size: 'small',
                      }}
                      tooltip={`search={{resetText:"Reset"}}`}
                      name={['search', 'resetText']}
                    />
                    <ProFormSwitch
                      fieldProps={{
                        size: 'small',
                      }}
                      label="Collapse button"
                      tooltip={`search={{collapseRender:false}}`}
                      name={['search', 'collapseRender']}
                    />
                    <ProFormSwitch
                      fieldProps={{
                        size: 'small',
                      }}
                      label="form close"
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
                      label="form grid"
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
                          label: 'vertical',
                          value: 'vertical',
                        },
                        {
                          label: 'horizontal',
                          value: 'horizontal',
                        },
                      ]}
                      label="form layout"
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
                          label: 'default',
                          value: 'query',
                        },
                        {
                          label: 'lightweight',
                          value: 'light',
                        },
                      ]}
                      label="form type"
                    />
                  </ProForm.Group>
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
