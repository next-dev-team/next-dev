import {
  DeleteOutlined,
  EditFilled,
  EyeFilled,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  ActionType,
  ParamsType,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components'
// import { isArray } from '@next-dev/utils'
import {
  Button,
  Dropdown,
  GlobalToken,
  ModalFuncProps,
  Popconfirm,
  Space,
  message,
  theme,
} from 'antd'
import useModal from 'antd/es/modal/useModal'
import { SortOrder } from 'antd/es/table/interface'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { MutableRefObject, useCallback, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

type ListProps = {
  deleteReqOpt?: (row: any) => AxiosRequestConfig<any>
  listReqOpt?: (
    params: ParamsType & {
      pageSize?: number | undefined
      current?: number | undefined
      keyword?: string | undefined
    },
    sort: Record<string, SortOrder>,
    filter: Record<any, any>
  ) => AxiosRequestConfig<any>
  dataField?: string[]
  totalField?: string[]
  reqOptions?: Record<string, any>
}
type DetailProps = {
  requestOpt?: (row: any) => AxiosRequestConfig<any>
  modalOpt?: (row: any) => ModalFuncProps
  dataField?: string[]
}

export type Crud<TData extends Record<string, any>> = {
  axios: AxiosInstance
  listProps: ListProps
  detailProps?: DetailProps
  hideNoCol?: boolean
} & React.ComponentProps<typeof ProTable<TData>>

const getSelectField = <T extends unknown>(
  response: Record<string, any>,
  selectField: string[]
) => {
  if (!Array.isArray(selectField)) return response
  const result = selectField.reduce((acc, field) => acc[field] || null, response)
  return result as T
}

const defaultParams = {
  current: 1,
  pageSize: 10,
}

const getColumns = ({
  deleteReqOpt,
  columns = [],
  token,
  axios,
  reload,
  onDetailClick,
  hideNoCol,
}: {
  token: GlobalToken
  axios: AxiosInstance
  reload: () => void
  onDetailClick: (row: any) => void
} & Pick<ListProps, 'deleteReqOpt'> &
  Pick<Crud<any>, 'hideNoCol' | 'columns'>) => {
  const handleConfirmDelete = async (row: any) => {
    if (!deleteReqOpt) return message.error('Something went wrong')
    const deleteConfig = {
      method: 'DELETE',
      ...deleteReqOpt?.(row),
    } as AxiosRequestConfig
    await axios
      .request(deleteConfig)
      .then(() => {
        message.success('Delete success')
        reload()
      })
      .catch(() => {
        message.error('Delete failed')
      })
  }

  const actionsCol = {
    fixed: 'right',
    title: 'Actions',
    align: 'center',
    width: 120,
    valueType: 'option',
    className: 'print:hidden block',
    render: (_, row: any) => {
      return [
        <Button
          onClick={() => onDetailClick(row)}
          title="View Detail"
          shape="circle"
          key="view"
          size="small"
        >
          <EyeFilled style={{ color: token.colorInfo, fontSize: 20 }} />
        </Button>,
        <Button title="Edit" type="primary" shape="circle" key="edit" size="small">
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
                    onConfirm={() => handleConfirmDelete(row)}
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
  } as ProColumns<any[]>
  const originCol = columns?.map((item) => {
    return {
      ...item,
    }
  })
  const preCol = [
    !hideNoCol && {
      title: 'No.',
      valueType: 'index',
      align: 'center',
      width: 64,
    },
  ]
  return [...preCol, ...originCol, actionsCol].filter(Boolean)
}

export default function Crud<TData extends Record<string, any>>(props: Crud<TData>) {
  const { axios, listProps, detailProps, options, columns, formRef, hideNoCol, ...rest } = props
  const { dataField = ['data'], totalField = [], deleteReqOpt, listReqOpt } = listProps || {}
  const { requestOpt, modalOpt: detailModalOpt, dataField: detailDataField } = detailProps || {}
  const [searchParams, setSearchParams] = useSearchParams()
  const [modal, contextHolder] = useModal()
  const { token } = theme.useToken()
  const actionRef = props.actionRef as MutableRefObject<ActionType>
  const detailRef = useRef<ActionType>()
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

  const onDetailClick = (row: any) => {
    if (!requestOpt) return message.error('Something went wrong')
    modal.info({
      // centered: true,
      width: token.screenMD,
      title: 'Detail',
      maskClosable: true,
      footer: null,
      icon: null,
      closable: true,
      styles: {
        body: {
          minHeight: 300,
        },
      },
      content: (
        <ProDescriptions
          style={{
            padding: token.paddingContentVertical,
          }}
          layout="vertical"
          actionRef={detailRef}
          columns={columns as any}
          request={async () => {
            const resDetail = await axios.request(requestOpt(row))
            const dataSource = getSelectField(resDetail, detailDataField!)
            return {
              data: dataSource,
              success: true,
            }
          }}
        />
      ),
      ...detailModalOpt?.(row),
    })
  }

  const nextColumn = getColumns({
    hideNoCol,
    onDetailClick,
    reload,
    columns: columns as any,
    token,
    axios,
    deleteReqOpt,
  })

  // init form value
  useEffect(() => {
    if (formRef?.current) formRef.current.setFieldsValue(getPrams())
  }, [formRef, getPrams])

  return (
    <>
      {contextHolder}
      <ProTable
        formRef={formRef}
        columns={nextColumn as any}
        onReset={() => {
          updateFilter({}, true)
        }}
        beforeSearchSubmit={(params) => {
          const { _timestamp, ...filter } = params || {}
          updateFilter(filter)
        }}
        request={async (resParams, ...arg) => {
          if (!listReqOpt) throw new Error('listReqOpt is required')
          const params = getPrams(resParams)
          const responseList = await axios.request(listReqOpt(params, ...arg))
          const dataSource = getSelectField(responseList, dataField)
          const totalPage = getSelectField<number>(responseList, totalField)

          const touchedResponse = {
            data: Array.isArray(dataSource) ? dataSource : ([] as any),
            success: true,
            total: isNaN(totalPage as number) ? 0 : (totalPage as number),
          }
          // console.log('touchedOpt', touchedOpt)
          return touchedResponse
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
    </>
  )
}
