import {
  DeleteOutlined,
  EditFilled,
  EyeFilled,
  EyeOutlined,
  MoreOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  ActionType,
  BetaSchemaForm,
  ParamsType,
  ProColumns,
  ProDescriptions,
  ProForm,
  ProFormProps,
  ProTable,
} from '@ant-design/pro-components'
import { useMediaQuery } from '@next-dev/hooks'
import { isArray, isObject, isString } from '@next-dev/utils'
import {
  Button,
  Dropdown,
  GlobalToken,
  ModalFuncProps,
  Popconfirm,
  Space,
  Tag,
  TagProps,
  message,
  theme,
} from 'antd'
import useModal from 'antd/es/modal/useModal'
import { SortOrder } from 'antd/es/table/interface'
import { FormInstance } from 'antd/lib'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { MutableRefObject, isValidElement, useCallback, useRef, useState } from 'react'
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
  totalItemField?: string[]
  totalPageField?: string[]
  reqOptions?: Record<string, any>
}
type DetailProps = {
  requestOpt?: (row: any) => AxiosRequestConfig<any>
  modalOpt?: (row: any) => ModalFuncProps
  dataField?: string[]
}
type IMode = 'add' | 'edit' | 'close-reset' | 'close-reload' | 'close'
export type ICrudCol<TData extends unknown> = ProColumns<TData[]> & {
  renderTag?: (
    dom: React.ReactNode,
    entity: TData,
    index: number
  ) => TagProps & {
    label?: React.ReactNode
    data?: any[]
    labelField?: string[]
    showLimit?: number
  }
}

export type Crud<TData extends Record<string, any>> = {
  axios: AxiosInstance
  listProps: ListProps
  detailProps?: DetailProps
  hideNoCol?: boolean
  addOrEditProps?: {
    addReqOpt?: (row: any) => AxiosRequestConfig<any>
    editReqOpt?: (row: any) => AxiosRequestConfig<any>
  }
} & React.ComponentProps<typeof ProTable<TData>>

const getSelectField = <T extends unknown>(
  response: Record<string, any>,
  selectField: string[]
) => {
  if (!isArray(selectField)) return response
  const result = selectField.reduce((acc, field) => acc?.[field] || null, response)
  return result as T
}

const defaultParams = {
  current: 1,
  pageSize: 10,
}

const renderTagComp = (col: any, renderTag: any): ICrudCol<any> => {
  return {
    ...col,
    render: (_, ...args) => {
      const text = typeof _ === 'string' ? _ : isValidElement(_) && _
      const tagProps = renderTag?.(_, ...args)
      const { label, labelField, showLimit = 4, data, ...restTag } = tagProps || {}
      const nextText = label || text

      if (isArray(data)) {
        const limitTagData = data.slice(0, showLimit)
        const hasMoreTags = data.length > showLimit
        const showMoreLabel = `+${data.length - showLimit}`

        return (
          <Space size={[0, 4]}>
            {limitTagData.map((item, idx) => {
              const { color } = isObject(item) ? item : ({} as any)
              const text =
                typeof item === 'string'
                  ? item
                  : (getSelectField(item as any, labelField) as string)
              if (!isString(text)) return null
              return (
                <Tag key={text || idx} color={color} {...restTag}>
                  {text}
                </Tag>
              )
            })}
            {hasMoreTags && (
              <Dropdown
                trigger={['click']}
                menu={{
                  items: data.slice(showLimit).map((item: any, idx) => {
                    const text =
                      typeof item === 'string'
                        ? item
                        : (getSelectField(item as any, labelField) as string)
                    if (!text) return null
                    return {
                      key: idx,
                      label: (
                        <Tag color={item?.color || 'default'} key={text || idx} {...restTag}>
                          {text}
                        </Tag>
                      ),
                    }
                  }),
                }}
                placement="bottomRight"
                arrow
              >
                <Tag {...restTag} style={{ cursor: 'pointer', ...restTag?.style }} color="default">
                  <EyeOutlined style={{ fontSize: 12, marginRight: 3 }} />
                  {showMoreLabel}
                </Tag>
              </Dropdown>
            )}
          </Space>
        )
      }
      if (!nextText) return null
      return <Tag {...restTag}>{nextText}</Tag>
    },
  }
}

const getColumns = ({
  loading,
  deleteReqOpt,
  columns = [],
  token,
  axios,
  reload,
  onDetailClick,
  hideNoCol,
  onEditClick,
}: {
  editId?: any
  editForm: FormInstance
  loading: boolean
  onEditClick: (row: any) => void
  token: GlobalToken
  axios: AxiosInstance
  reload: (reset?: boolean) => void
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
        <Button
          disabled={loading}
          onClick={onEditClick.bind(null, row)}
          title="Edit"
          type="primary"
          shape="circle"
          key="edit"
          size="small"
          icon={<EditFilled style={{ color: 'white', fontSize: 15 }} />}
        />,
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
  } as ICrudCol<any[]>

  const getCustomRender = ({ renderTag, ...col }: ICrudCol<any[]> & { renderTag: any }) => {
    if (renderTag) return renderTagComp(col, renderTag)
    return col
  }

  const nextCol = columns?.map((colItem) => {
    const customRender = getCustomRender(colItem as any)
    return {
      ...colItem,
      ...customRender,
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
  return [...preCol, ...nextCol, actionsCol].filter(Boolean)
}

const AddOrEdit = ({
  loading,
  onFinish,
  editForm,
  isAddForm,
  isEditForm,
  setFormMode,
  columns,
  isSmUp,
}: Pick<Crud<any>, 'columns'> &
  Pick<ProFormProps, 'onFinish' | 'loading'> & {
    editForm: FormInstance
    isSmUp: boolean
    isAddForm: boolean
    isEditForm: boolean
    setFormMode: (mode: IMode, row?: any) => void
  }) => {
  if (!isAddForm && !isEditForm) return null
  return (
    <BetaSchemaForm
      scrollToFirstError
      onFinish={onFinish}
      loading={loading}
      form={editForm}
      columns={columns as any}
      open={isAddForm || isEditForm}
      layoutType="ModalForm"
      modalProps={{
        onCancel: () => setFormMode('close', false),
        okText: 'Submit',
        destroyOnClose: true,
      }}
      {...{
        rowProps: {
          gutter: [10, 2],
        },
        colProps: {
          span: 12,
        },
        grid: isSmUp,
      }}
    />
  )
}

export default function Crud<TData extends Record<string, any>>(props: Crud<TData>) {
  const {
    axios,
    listProps,
    detailProps,
    options,
    columns,
    formRef,
    hideNoCol,
    addOrEditProps,
    search,
    ...rest
  } = props
  const [editForm] = ProForm.useForm()

  const {
    dataField = ['data'],
    totalItemField = [],
    totalPageField = [],
    deleteReqOpt,
    listReqOpt,
  } = listProps || {}
  const { addReqOpt, editReqOpt } = addOrEditProps || {}
  const {
    requestOpt: detailReqOpt,
    modalOpt: detailModalOpt,
    dataField: detailDataField,
  } = detailProps || {}
  const [searchParams, setSearchParams] = useSearchParams()
  const { isSmUp } = useMediaQuery()
  const [modal, contextHolder] = useModal()
  const [rowRecords, setRowRecords] = useState<Record<string, any>>({})
  const [addOrEditLoading, setAddOrEditLoading] = useState(false)
  const { token } = theme.useToken()
  const actionRef = props.actionRef as MutableRefObject<ActionType>
  const detailRef = useRef<ActionType>()
  const reload = (resetPageIndex = false) => actionRef.current?.reload(resetPageIndex)

  const getParamsObj = (): { formMode?: any } => {
    const searchParamsObj: Record<string, string> = {}
    for (let [key, value] of searchParams.entries()) {
      if (value) searchParamsObj[key] = value
    }
    return searchParamsObj
  }
  const paramsObj = getParamsObj()

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
  const params = getPrams() || {}

  const isAddForm = paramsObj.formMode === 'add'
  const isEditForm = paramsObj.formMode === 'edit'

  const resetAll = (isReload = false, fullReset = false) => {
    editForm.resetFields()
    formRef?.current?.resetFields()
    setRowRecords({})

    if (fullReset) setSearchParams({})
    if (isReload) reload()
  }

  const setFormMode = (mode: IMode, row?: any) => {
    const modeAdd = mode === 'add'
    const modeEdit = mode === 'edit'
    const modeCloseReload = mode === 'close-reload'
    const modeCloseReset = mode === 'close-reset'

    setSearchParams({ ...getPrams(), formMode: mode } as any)
    if (modeEdit) {
      setRowRecords(() => row)
      editForm.setFieldsValue(row)
    }
    if (modeAdd) {
      editForm.resetFields()
      setRowRecords({})
    }
    if (modeCloseReset) {
      resetAll(true, true)
    }
    if (modeCloseReload) {
      reload()
    }
  }

  const updateFilter = useCallback(async (params = {}, isReset = false) => {
    const { formMode, ...restParams } = params || ({} as any)
    setSearchParams(isReset ? {} : { ...restParams })
    reload()
  }, [])

  const onDetailClick = (row: any) => {
    if (!detailReqOpt) return message.error('Something went wrong')
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
      onCancel: () => {
        setFormMode('close')
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
            if (!detailReqOpt)
              return {
                data: [],
                success: true,
              }
            const resDetail = await axios.request(detailReqOpt(row))
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

  const onEditClick = async (row: any) => {
    if (!detailReqOpt) {
      return message.error('Something went wrong')
    }
    setAddOrEditLoading(true)
    try {
      await axios.request(detailReqOpt(row))
      setFormMode('edit', row)
    } catch (error) {
      // Handle error
    } finally {
      setAddOrEditLoading(false)
    }
  }

  const nextColumn = getColumns({
    editForm,
    loading: addOrEditLoading,
    hideNoCol,
    onEditClick,
    onDetailClick,
    reload,
    columns: columns as any,
    token,
    axios,
    deleteReqOpt,
  })

  return (
    <>
      <AddOrEdit
        {...{
          loading: addOrEditLoading,
          onFinish: async (formValues) => {
            const addOpt = addReqOpt?.(rowRecords)
            const editOpt = editReqOpt?.(rowRecords)
            // loading
            setAddOrEditLoading(true)
            if (isAddForm) {
              return axios
                .request({
                  method: 'post',
                  params: formValues,
                  ...addOpt,
                })
                .then(() => {
                  message.success('Add successfully')
                  setFormMode('close-reset')
                })
                .catch(() => {
                  message.error('Add failed')
                })
                .finally(() => {
                  setAddOrEditLoading(false)
                })
            }
            return axios
              .request({
                method: 'put',
                data: formValues,
                ...editOpt,
              })
              .then(() => {
                message.success('Edit successfully')
                setFormMode('close-reset')
              })
              .catch(() => {
                message.error('Edit failed')
              })
              .finally(() => {
                setAddOrEditLoading(false)
              })
          },
          editForm,
          isAddForm,
          isEditForm,
          isSmUp,
          setFormMode,
          columns,
        }}
      />
      {contextHolder}
      <ProTable
        beforeSearchSubmit={async (params) => {
          // sync search url params with search form
          if (formRef?.current) formRef.current.setFieldsValue(getPrams(params))
          return params
        }}
        formRef={formRef}
        columns={nextColumn as any}
        onReset={() => {
          resetAll(true, true)
        }}
        onSubmit={(params) => {
          updateFilter(params)
        }}
        request={async (resParams, ...arg) => {
          if (!listReqOpt) throw new Error('listReqOpt is required')
          const params = getPrams(resParams)
          const { formMode, ...restP } = (params || {}) as any
          const responseList = await axios.request(listReqOpt(restP, ...arg))
          const dataSource = getSelectField(responseList, dataField)
          const totalItem = getSelectField<number>(responseList, totalItemField)
          const totalPage = getSelectField<number>(responseList, totalPageField)
          const total = isNaN(totalItem as number) ? 0 : (totalItem as number)
          const validCurrentPage = +(params.current || 0)
          const invalidTotal = validCurrentPage > +totalPage
          if (invalidTotal || isNaN(validCurrentPage)) {
            updateFilter({ ...params, current: defaultParams.current })
          }
          const touchedResponse = {
            data: Array.isArray(dataSource) ? dataSource : ([] as any),
            success: true,
            total,
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
          ...search,
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
        toolBarRender={() =>
          [
            <Button
              onClick={() => setFormMode('add')}
              key={'crud'}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add
            </Button>,
          ].filter(Boolean)
        }
      />
    </>
  )
}
