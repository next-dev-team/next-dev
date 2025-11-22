import { PageContainer } from '@ant-design/pro-components';
import { Button, Modal, Form, Input, Table, Popconfirm, message } from 'antd';
import { useState } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import {
  getApiUsers,
  postApiUsers,
  putApiUsersId,
  deleteApiUsersId,
} from '@rnr/api-spec/src/gen/client';
import type { User } from '@rnr/api-spec/src/gen/types';
import { getAuthHeaders, getAuthHeadersWithContentType } from '@/utils/auth';

export default function Users() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const qc = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => getApiUsers({ headers: getAuthHeaders() }),
  });
  const createMutation = useMutation({
    mutationFn: (variables: any) =>
      postApiUsers(variables.data, { headers: getAuthHeadersWithContentType() }),
    onSuccess: () => {
      message.success('Created');
      setCreateOpen(false);
      createForm.resetFields();
      qc.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err: any) => message.error(err?.response?.data?.error ?? 'Create failed'),
  });
  const updateMutation = useMutation({
    mutationFn: (variables: any) =>
      putApiUsersId(variables.id, variables.data, { headers: getAuthHeadersWithContentType() }),
    onSuccess: () => {
      message.success('Updated');
      setEditOpen(false);
      editForm.resetFields();
      setEditing(null);
      qc.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err: any) => message.error(err?.response?.data?.error ?? 'Update failed'),
  });
  const deleteMutation = useMutation({
    mutationFn: (variables: any) => deleteApiUsersId(variables.id, { headers: getAuthHeaders() }),
    onSuccess: () => {
      message.success('Deleted');
      qc.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err: any) => message.error(err?.response?.data?.error ?? 'Delete failed'),
  });

  const dataSource: User[] = (usersQuery.data as any)?.data ?? [];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', width: 200 },
    { title: 'Updated At', dataIndex: 'updatedAt', key: 'updatedAt', width: 200 },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="link"
            onClick={() => {
              setEditing(record);
              editForm.setFieldsValue({
                email: record.email ?? '',
                name: record.name ?? '',
              });
              setEditOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this user?"
            onConfirm={() => {
              if (record.id == null) return;
              deleteMutation.mutate({ id: record.id });
            }}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <PageContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <Button type="primary" onClick={() => setCreateOpen(true)}>
            New User
          </Button>
        </div>
      </div>
      <Table
        rowKey="id"
        loading={usersQuery.isLoading}
        dataSource={dataSource}
        columns={columns as any}
      />

      <Modal
        title="Create User"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={() => {
          createForm.validateFields().then((values) => {
            const payload = {
              email: values.email,
              name: values.name && values.name.trim().length > 0 ? values.name.trim() : undefined,
            };
            createMutation.mutate({ data: payload });
          });
        }}
        confirmLoading={createMutation.isPending}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit User"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onOk={() => {
          editForm.validateFields().then((values) => {
            if (!editing?.id) return;
            const payload = {
              email: values.email,
              name: values.name && values.name.trim().length > 0 ? values.name.trim() : undefined,
            };
            updateMutation.mutate({ id: editing.id, data: payload });
          });
        }}
        confirmLoading={updateMutation.isPending}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Name">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
