import { ProTable } from '@/rnr-ui/components/ui';
import type { ProTableColumn, ProTableRequestData } from '@/rnr-ui/components/ui';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export function ProTableBasicPreview() {
  const columns: ProTableColumn<User>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value) => (
        <View
          className={`rounded px-2 py-1 ${value === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}
        >
          <Text className="text-xs">{value}</Text>
        </View>
      ),
    },
  ];

  const mockData: User[] = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
  ];

  const request = async (): Promise<ProTableRequestData> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      data: mockData,
      success: true,
      total: mockData.length,
    };
  };

  return (
    <View className="w-full p-4">
      <ProTable
        columns={columns}
        request={request}
        rowKey="id"
        headerTitle="User Management"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
        }}
        search={{
          labelWidth: 100,
        }}
      />
    </View>
  );
}
