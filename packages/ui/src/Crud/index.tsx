import { PlusOutlined } from '@ant-design/icons'
import { ActionType, ProTable } from '@ant-design/pro-components'
import { isArray } from '@next-dev/utils'
import { Button } from 'antd'
import { AxiosInstance } from 'axios'
import { MutableRefObject, useCallback } from 'react'
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

// const getActionRef = (actionRef = null): MutableRefObject<ActionType>['current'] => {
//   return actionRef.current || {}
// }

export default function Crud<TData extends Record<string, any>>(props: Crud<TData>) {
  const { axios, listProps, options, ...rest } = props
  const { dataField = ['data'], totalField = [], url: listUrl, ...restList } = listProps || {}
  const [searchParams, setSearchParams] = useSearchParams()
  const actionRef = props.actionRef as MutableRefObject<ActionType>
  const reload = (resetPageIndex = false) => actionRef.current?.reload(resetPageIndex)

  const getPrams = ({
    current,
    pageSize,
  }: {
    pageSize?: number | undefined
    current?: number | undefined
  } = {}) => {
    const searchParamsObj: Record<string, string> = {}
    for (let [key, value] of searchParams.entries()) {
      if (value) searchParamsObj[key] = value
    }
    const params = {
      current: current || Number(searchParams.get('current')) || 1,
      pageSize: pageSize || Number(searchParams?.get('pageSize')) || 10,
      ...searchParamsObj,
    }
    return params
  }
  const updateFilter = useCallback((params = {}) => {
    setSearchParams({ ...getPrams(), ...params })
    // reload()
  }, [])

  return (
    <ProTable
      beforeSearchSubmit={(params) => {
        const { pageSize, _timestamp, ...filter } = params || {}
        updateFilter(filter)
        reload(true)
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
        defaultPageSize: 10,
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
