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
  ProCard,
  ProCardProps,
  ProForm,
  ProFormColumnsType,
  ProFormListProps,
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
import { SortOrder } from 'antd/es/table/interface'
import { FormInstance } from 'antd/lib'
import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { MutableRefObject, isValidElement, useCallback, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import TblExport from './export'

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
  postData?: (data: any) => any
}
type IMode = 'add' | 'edit' | 'close-reset' | 'close-reload' | 'close' | 'view'
export type ICrudCol<TData extends unknown> = ProFormColumnsType<TData[]> & {
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
  /**
   * works only valueType = 'formList'
   */
  _listCardProps?: ProCardProps & {
    titleFields?: string[]
    noCard?: boolean
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
  selectField: string[] | undefined
) => {
  if (!selectField) return response
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
        const limitTagData: any[] = data.slice(0, showLimit)
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
                  items: (data as any[]).slice(showLimit).map((item, idx) => {
                    const text = typeof item === 'string' ? item : getSelectField(item, labelField)
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

const AddOrEdit = ({
  isViewForm,
  loading,
  onFinish,
  editForm,
  isAddForm,
  isEditForm,
  setFormMode,
  columns,
  isSmUp,
}: Pick<ProFormProps, 'onFinish' | 'loading'> & {
  editForm: FormInstance
  isSmUp: boolean
  isAddForm: boolean
  isViewForm: boolean
  isEditForm: boolean
  setFormMode: (mode: IMode, row?: any) => void
  columns: ICrudCol<Record<string, any>>[]
}) => {
  if (!isAddForm && !isEditForm && !isViewForm) return null
  const okText = isViewForm ? 'Done' : isEditForm ? 'Save' : 'Submit'
  return (
    <BetaSchemaForm
      syncToUrlAsImportant
      readonly={isViewForm}
      scrollToFirstError
      onFinish={onFinish}
      loading={loading}
      form={editForm}
      columns={columns}
      open={isAddForm || isEditForm || isViewForm}
      layoutType="ModalForm"
      title={isAddForm ? 'Add' : isEditForm ? 'Edit' : 'View'}
      submitter={{
        render(props, dom) {
          if (isViewForm)
            return (
              <Button type="primary" onClick={() => setFormMode('close')}>
                Done
              </Button>
            )
          return dom
        },
      }}
      modalProps={{
        onCancel: () => setFormMode('close', false),
        okText,
        destroyOnClose: true,
      }}
      {...{
        rowProps: {
          gutter: [20, 20],
        },
        colProps: {
          span: 12,
        },
        grid: isSmUp,
      }}
    />
  )
}

const getColumns = ({
  loading,
  deleteReqOpt,
  columns = [],
  token,
  axios,
  reload,
  hideNoCol,
  onEditClick,
  detailReqOpt,
  setFormMode,
  detailRef,
  detailDataField,
  detailPostData,
  detailModalOpt,
}: {
  detailModalOpt?: (row: any) => ModalFuncProps
  detailPostData?: (data: any) => any
  detailDataField?: string[]
  detailRef: any
  setFormMode: (mode: IMode, row?: any) => void
  detailReqOpt?: (row: any) => AxiosRequestConfig<any>
  editForm: FormInstance
  loading: boolean
  onEditClick: (row: any) => void
  token: GlobalToken
  axios: AxiosInstance
  reload: (reset?: boolean) => void
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
          onClick={() => setFormMode('view')}
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

  const getCustomRender = ({ renderTag, ...col }: ICrudCol<any[]>) => {
    if (renderTag) return renderTagComp(col, renderTag)
    // custom width for date
    if (col.valueType === 'date')
      return {
        ...col,
        fieldProps: {
          className: 'w-full',
          ...col.fieldProps,
        },
      }
    if (col.valueType === 'formList') {
      const listCards = col?._listCardProps || {}
      if (listCards?.noCard) return col
      console.log('col', col)

      return {
        ...col,
        formItemProps: {
          itemRender: (dom, listMeta) => (
            <ProCard
              style={{ marginBottom: token.sizeMS, ...listCards.style }}
              type="inner"
              size="small"
              bordered
              headerBordered
              extra={dom.action}
              title={
                getSelectField(listMeta, listCards?.titleFields)
                  ? `${listMeta.name} ${listMeta.index + 1}`
                  : ''
              }
            >
              {dom.listDom}
            </ProCard>
          ),
          ...col?.formItemProps,
        } as ProFormListProps<any>,
      } as ICrudCol<any[]>
    }
    return col
  }

  const nextCol = columns?.map((colItem) => {
    const customRender = getCustomRender(colItem as any)
    return {
      ...colItem,
      ...customRender,
    }
  })

  const hasNextCol = nextCol.length > 0

  const preCol = [
    !hideNoCol && {
      title: 'No.',
      valueType: 'index',
      align: 'center',
      width: 64,
    },
  ]
  return [...preCol, ...nextCol, hasNextCol ? actionsCol : false].filter(Boolean)
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
    postData: detailPostData,
  } = detailProps || {}
  const [searchParams, setSearchParams] = useSearchParams()
  const { isSmUp } = useMediaQuery()
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
  const isViewForm = paramsObj.formMode === 'view'

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
    detailRef,
    setFormMode,
    detailDataField,
    detailModalOpt,
    detailPostData,
    detailReqOpt,
    editForm,
    loading: addOrEditLoading,
    hideNoCol,
    onEditClick,
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
          isViewForm,
          isSmUp,
          setFormMode,
          columns: nextColumn as any,
        }}
      />
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
            //@ts-ignore
            <TblExport key="export" />,
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
