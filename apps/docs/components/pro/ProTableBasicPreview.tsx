'use client'

import { ProTable } from '@rnr/rnr-ui'
import type { ProTableColumn, ProTableRequestData } from '@rnr/rnr-ui'
import { View, Text } from 'react-native'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
}

export function ProTableBasicPreview() {
  const columns: ProTableColumn<User>[] = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => (
        <View className={`px-2 py-1 rounded ${value === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
          <Text style={{ fontSize: 12 }}>{value}</Text>
        </View>
      ),
    },
  ]

  const mockData: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
  ]

  const request = async (): Promise<ProTableRequestData> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return { data: mockData, success: true, total: mockData.length }
  }

  return (
    <View className="w-full p-4">
      <ProTable
        columns={columns}
        request={request}
        rowKey="id"
        headerTitle="User Management"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        search={{ labelWidth: 100 }}
      />
    </View>
  )
}