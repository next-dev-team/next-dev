import React, { useState } from 'react';
import { View } from 'react-native';
import { ProTable } from '../components/pro-table';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';
import { Text } from '@rnr/registry/src/new-york/components/ui/text';
import { Badge } from '@rnr/registry/src/new-york/components/ui/badge';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

/**
 * Example: ProTable usage with search and pagination
 */
export function ProTableExample() {
  const [data] = useState<User[]>([
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
      role: 'User',
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
  ]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name' as const,
      key: 'name',
      search: true,
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email' as const,
      key: 'email',
      search: true,
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
      render: (_: any, record: User) => (
        <View className="flex-row gap-2">
          <Button size="sm" variant="outline">
            <Text>Edit</Text>
          </Button>
          <Button size="sm" variant="destructive">
            <Text>Delete</Text>
          </Button>
        </View>
      ),
    },
  ];

  return (
    <View className="p-4">
      <ProTable
        columns={columns}
        dataSource={data}
        rowKey="id"
        headerTitle="User Management"
        search={{
          searchText: 'Search',
          resetText: 'Reset',
        }}
        toolbar={{
          title: 'Users',
          subTitle: 'Manage your users',
          actions: [
            <Button key="add">
              <Text>Add User</Text>
            </Button>,
          ],
        }}
        pagination={{
          pageSize: 10,
        }}
      />
    </View>
  );
}

