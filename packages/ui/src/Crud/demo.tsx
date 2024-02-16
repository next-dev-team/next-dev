import { ActionType, ProColumns } from '@ant-design/pro-components'
import axios from 'axios'
import { useRef } from 'react'
import Crud from '.'

const API_TOKEN = '0b4c0fa225e4e432de7e51fe13691e86e27ac12a360ca251bf714eeb00942325'

const axiosInstance = axios.create({
  baseURL: 'https://gorest.co.in/public/v1',
  headers: {
    Authorization: `Bearer ${API_TOKEN}`,
  },
})

export default function Demo() {
  const actionRef = useRef<ActionType>(null)

  const columns: ProColumns<any[]>[] = [
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
      title: 'Email',
      dataIndex: 'email',
      formItemProps: {
        rules: [{ required: true }],
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
    },
  ]
  return (
    <>
      <Crud
        listProps={{
          url: '/users',
          dataField: ['data', 'data'],
          totalField: ['data', 'meta', 'pagination', 'total'],
        }}
        axios={axiosInstance}
        columns={columns}
        actionRef={actionRef}
      />
    </>
  )
}
