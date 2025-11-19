import { View } from 'react-native';
import { ProTable } from '@rnr/rnr-ui';
import type { ProTableColumn, ProTableRequestData } from '@rnr/rnr-ui';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: ProTableColumn<User>[] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
];

const data: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: '3', name: 'Carol Lee', email: 'carol@example.com', role: 'Viewer', status: 'Invited' },
];

export default function UsersListPage() {
  const request = async (): Promise<ProTableRequestData<User>> => {
    return { data, success: true, total: data.length };
  };

  return (
    <View className="w-full flex-1">
      <ProTable<User> rowKey="id" columns={columns} request={request} pagination={{ pageSize: 10 }} />
    </View>
  );
}