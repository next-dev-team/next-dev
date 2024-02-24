import { ActionType, ProFormInstance } from '@ant-design/pro-components'
import axios from 'axios'
import { useRef } from 'react'
import Crud, { ICrudCol } from '.'

const API_TOKEN = '0b4c0fa225e4e432de7e51fe13691e86e27ac12a360ca251bf714eeb00942325'

const axiosInstance = axios.create({
  baseURL: 'https://gorest.co.in/public/v1',
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
})

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
      title: 'Profile',
      dataIndex: 'profile',
      valueType: {
        type: 'image',
        width: 80,
      },
      hideInForm: true,
      hideInSearch: true,
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
        console.log('tags', tags)
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
  ]

  return (
    <>
      <Crud
        headerTitle="Auto CRUD"
        // custom dataSource
        postData={(data: any[]) => {
          const touchedData = data.map((item) => {
            return {
              ...item,
              tags: Array.from({ length: 8 }).map((_, i) => {
                return { id: i, name: `tags ${i}` }
              }),
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
        }}
        axios={axiosInstance}
        columns={columns}
        actionRef={actionRef}
      />
    </>
  )
}
