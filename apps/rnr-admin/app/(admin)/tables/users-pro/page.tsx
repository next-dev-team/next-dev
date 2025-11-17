'use client';

import { ProTable } from '@rnr/rnr-ui-pro';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Badge } from '@/registry/new-york/components/ui/badge';
import { useState } from 'react';
import { Edit, Trash2, UserCheck, Plus } from 'lucide-react';
import { ModalForm } from '@rnr/rnr-ui-pro';
import { Input } from '@/registry/new-york/components/ui/input';
import { View } from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export default function UsersProTablePage() {
  const [data, setData] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Editor',
      status: 'active',
      createdAt: '2024-01-20',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'User',
      status: 'inactive',
      createdAt: '2024-02-01',
    },
    {
      id: '4',
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'Editor',
      status: 'active',
      createdAt: '2024-02-10',
    },
    {
      id: '5',
      name: 'Charlie Wilson',
      email: 'charlie@example.com',
      role: 'User',
      status: 'active',
      createdAt: '2024-02-15',
    },
  ]);

  const handleCreateUser = async (values: any) => {
    const newUser: User = {
      id: String(data.length + 1),
      name: values.name,
      email: values.email,
      role: 'User',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setData([...data, newUser]);
  };

  const handleDelete = (userId: string) => {
    setData(data.filter((user) => user.id !== userId));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name' as const,
      key: 'name',
      search: true,
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
      render: (name: string, record: User) => (
        <View className="flex-row items-center gap-3">
          <View className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
            <Text className="font-semibold text-primary">{name.charAt(0)}</Text>
          </View>
          <View>
            <Text className="font-medium">{name}</Text>
            <Text className="text-sm text-muted-foreground">{record.email}</Text>
          </View>
        </View>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email' as const,
      key: 'email',
      search: true,
      hideInTable: true,
    },
    {
      title: 'Role',
      dataIndex: 'role' as const,
      key: 'role',
      render: (role: string) => (
        <Badge variant={role === 'Admin' ? 'default' : 'secondary'}>
          <Text>{role}</Text>
        </Badge>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status' as const,
      key: 'status',
      render: (status: string) => (
        <Badge variant={status === 'active' ? 'default' : 'destructive'}>
          <Text>{status}</Text>
        </Badge>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt' as const,
      key: 'createdAt',
      sorter: (a: User, b: User) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      render: (_: any, record: User) => (
        <View className="flex-row gap-2 justify-end">
          <Button size="sm" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <UserCheck className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onPress={() => handleDelete(record.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </View>
      ),
    },
  ];

  return (
    <div className="p-6">
      <ProTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        headerTitle="Users Management (Pro)"
        search={{
          searchText: 'Search',
          resetText: 'Reset',
        }}
        toolbar={{
          title: 'Users',
          subTitle: 'Manage your users with ProTable component',
          actions: [
            <ModalForm
              key="create"
              title="Create New User"
              description="Add a new user to your system"
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  <Text>Add User</Text>
                </Button>
              }
              onFinish={handleCreateUser}
            >
              <ModalForm.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter name' }]}
              >
                <Input placeholder="John Doe" />
              </ModalForm.Item>
              <ModalForm.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input placeholder="john@example.com" />
              </ModalForm.Item>
            </ModalForm>,
          ],
        }}
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  );
}

