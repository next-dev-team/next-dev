import { ActionType, ProFormInstance, ProFormUploadButton } from '@ant-design/pro-components'
import axios from 'axios'
import Mock, { Random } from 'mockjs'
import { useRef } from 'react'
import Crud, { ICrudCol } from '.'

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

export default function Demo() {
  const actionRef = useRef<ActionType>(null)
  const ref = useRef<ProFormInstance>()
  const columns: ICrudCol<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 64,
      hideInForm: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true }],
      },
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      formItemProps: {
        rules: [{ required: true }],
      },
      valueEnum: {
        male: {
          text: 'Male',
          status: 'male',
        },
        female: {
          text: 'Female',
          status: 'female',
        },
      },
    },
    {
      hideInSearch: true,
      title: 'Email',
      dataIndex: 'email',
      formItemProps: {
        rules: [{ required: true, type: 'email' }],
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      formItemProps: {
        rules: [{ required: true }],
      },
      valueEnum: {
        active: {
          text: 'Active',
          status: 'active',
        },
        inactive: {
          text: 'Inactive',
          status: 'inactive',
        },
      },
      renderTag: (_, records) => {
        const { status } = records
        const colorMap: Record<string, string> = {
          active: 'green',
          inactive: 'red',
        }
        return {
          color: colorMap[status],
        }
      },
    },
    {
      title: 'Cannel',
      hideInForm: true,
      renderTag: (_, records) => {
        const { tags = [] } = records || {}
        return {
          data: tags.map((item: any, i: any) => {
            return {
              id: item.id,
              name: item.name,
              color: i % 2 === 0 ? 'cyan' : 'blue',
            }
          }),
          labelField: ['name'],
          showLimit: 2,
        }
      },
    },
    {
      title: 'Profile',
      dataIndex: 'img',
      valueType: () => {
        return {
          type: 'image',
          width: 80,
        }
      },
      renderFormItem: () => {
        return (
          <>
            <ProFormUploadButton
              fieldProps={{
                multiple: false,
              }}
              title="Upload"
            />
          </>
        )
      },
    },

    {
      title: 'Publish Date',
      dataIndex: 'publishDate',
      valueType: 'date',
    },
    {
      title: 'Form List',
      valueType: 'formList',
      dataIndex: 'list',
      initialValue: mockData.formList,
      colProps: { span: 24 },
      hideInTable: true,
      hideInSearch: true,
      columns: [
        {
          valueType: 'group',
          colProps: { span: 24 },
          columns: [
            {
              title: 'ID',
              dataIndex: 'id',
              valueType: 'text',
            },
            {
              title: 'Name',
              dataIndex: 'name',
              valueType: 'text',
            },
          ],
        },
        {
          title: 'Text Area',
          valueType: 'textarea',
          dataIndex: 'textarea',
          colProps: { span: 24 },
          formItemProps: {
            rules: [{ required: true }],
            style: {
              display: 'inline-block',
              width: '100%',
            },
          },
        },
      ],
    },
  ]

  return (
    <>
      <Crud
        headerTitle="Auto CRUD"
        // custom dataSource
        postData={(data: any[]) => {
          const touchedData = data.map((item, idx) => {
            return {
              ...item,
              ...mockData,
            }
          })
          return touchedData
        }}
        formRef={ref}
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
        columns={columns as any}
        actionRef={actionRef}
      />
    </>
  )
}
