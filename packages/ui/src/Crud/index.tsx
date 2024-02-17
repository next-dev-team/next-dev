import {
  DeleteOutlined,
  EditFilled,
  EyeFilled,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { isArray } from '@next-dev/utils'
import { Button, Dropdown, GlobalToken, Popconfirm, Space, theme } from 'antd'
import { AxiosInstance } from 'axios'
import { MutableRefObject, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

type ListProps = {
  url: string
  dataField?: string[]
  totalField?: string[]
  reqOptions?: Record<string, any>
}

export type Crud<TData extends Record<string, any>> = {
  axios: AxiosInstance
  listProps: ListProps
} & React.ComponentProps<typeof ProTable<TData>>

const getSelectField = <T extends unknown>(
  response: Record<string, any>,
  selectField: string[]
) => {
  const result = selectField.reduce((acc, field) => acc[field] || null, response)
  return result as T
}

const defaultParams = {
  current: 1,
  pageSize: 10,
}

const getColumns = ({
  columns = [],
  token,
}: {
  token: GlobalToken
  columns: ProColumns<any[]>[]
}) => {
  const actionsCol = {
    fixed: 'right',
    title: 'Actions',
    align: 'center',
    width: 120,
    valueType: 'option',
    className: 'print:hidden block',
    render: (_, row) => {
      return [
        <Button shape="circle" key="view" size="small">
          <EyeFilled style={{ color: token.colorInfo, fontSize: 20 }} />
        </Button>,
        <Button type="primary" shape="circle" key="edit" size="small">
          <EditFilled style={{ color: 'white', fontSize: 15 }} />
        </Button>,
        <Dropdown
          key={'actions'}
          trigger={['click', 'contextMenu']}
          menu={{
            items: [
              {
                label: (
                  <Popconfirm
                    title={`Are you sure to delete "${row?.name || row?.title || ''}" ?`}
                    trigger={['click']}
                  >
                    <Space size="small">
                      <DeleteOutlined
                        style={{
                          color: token.colorError,
                          fontSize: token.fontSizeLG,
                        }}
                      />
                      {'Delete'}
                    </Space>
                  </Popconfirm>
                ),
                key: '0',
              },
            ],
          }}
        >
          <a className="text-text-secondary text-lg" onClick={(e) => e.preventDefault()}>
            <MoreOutlined />
          </a>
        </Dropdown>,
      ].filter(Boolean)
    },
  }
  const originCol = columns?.map((item) => {
    return {
      ...item,
    }
  })
  return [...originCol, actionsCol]
}

export default function Crud<TData extends Record<string, any>>(props: Crud<TData>) {
  const { axios, listProps, options, columns, formRef, ...rest } = props
  const { dataField = ['data'], totalField = [], url: listUrl, ...restList } = listProps || {}
  const [searchParams, setSearchParams] = useSearchParams()
  const { token } = theme.useToken()
  const actionRef = props.actionRef as MutableRefObject<ActionType>
  const reload = (resetPageIndex = false) => actionRef.current?.reload(resetPageIndex)

  const getPrams = ({
    current,
    pageSize,
  }: {
    pageSize?: number | undefined
    current?: number | undefined
  } = {}) => {
    const params = {
      current: current || Number(searchParams.get('current')) || defaultParams.current,
      pageSize: pageSize || Number(searchParams?.get('pageSize')) || defaultParams.pageSize,
      ...paramsObj,
    }
    return params
  }
  const updateFilter = useCallback(async (params = {}, isReset = false) => {
    setSearchParams(isReset ? {} : { ...params })
  }, [])

  const getParamsObj = () => {
    const searchParamsObj: Record<string, string> = {}
    for (let [key, value] of searchParams.entries()) {
      if (value) searchParamsObj[key] = value
    }
    return searchParamsObj
  }
  const paramsObj = getParamsObj()
  const nextColumn = getColumns({ columns, token })

  // init form value
  useEffect(() => {
    if (formRef?.current) formRef.current.setFieldsValue(getPrams())
  }, [formRef, getPrams])

  return (
    <ProTable
      formRef={formRef}
      columns={nextColumn}
      onReset={() => {
        updateFilter({}, true)
      }}
      beforeSearchSubmit={(params) => {
        const { _timestamp, ...filter } = params || {}
        updateFilter(filter)
      }}
      request={async (resParams, ...args) => {
        console.log('args', args)
        const params = getPrams(resParams)
        const responseList = await axios.request({ url: listUrl, params })
        console.log('data', responseList)
        const dataSource = getSelectField(responseList, dataField)
        const totalPage = getSelectField<number>(responseList, totalField)

        const touchedOpt = {
          data: isArray(dataSource) ? dataSource : [],
          success: true,
          total: isNaN(totalPage) ? undefined : totalPage,
        }
        // console.log('touchedOpt', touchedOpt)
        return touchedOpt
      }}
      pagination={{
        defaultPageSize: defaultParams.pageSize,
        showQuickJumper: true,
        ...getPrams(),
      }}
      onChange={({ pageSize, current }) => {
        updateFilter({ pageSize, current })
      }}
      {...rest}
      id="crud"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        fullScreen: true,
        setting: { draggable: true },
        // reload: ,
        ...options,
      }}
      scroll={{ x: true }}
      rowKey="id"
      dateFormatter="string"
      headerTitle="Data Table"
      toolBarRender={() =>
        [
          <Button key={'crud'} type="primary" icon={<PlusOutlined />}>
            Add
          </Button>,
        ].filter(Boolean)
      }
    />
  )
}
