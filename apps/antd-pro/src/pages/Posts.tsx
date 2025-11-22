import { PageContainer } from '@ant-design/pro-components';
import {
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Table,
  Popconfirm,
  message,
  Select,
} from 'antd';
import { useState, useMemo } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import {
  getApiPosts,
  postApiPosts,
  putApiPostsId,
  deleteApiPostsId,
  getApiUsers,
} from '@rnr/api-spec/src/gen/client';
import type { Post } from '@rnr/api-spec/src/gen/types';

export default function Posts() {
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const qc = useQueryClient();

  const params = useMemo(() => ({ page, pageSize }), [page, pageSize]);
  const postsQuery = useQuery({
    queryKey: ['posts', page, pageSize],
    queryFn: () => getApiPosts(params),
  });
  const usersQuery = useQuery({ queryKey: ['users-for-posts'], queryFn: () => getApiUsers() });
  const createMutation = useMutation({
    mutationFn: (variables: any) => postApiPosts(variables.data),
    onSuccess: () => {
      message.success('Created');
      setCreateOpen(false);
      createForm.resetFields();
      qc.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err: any) => message.error(err?.response?.data?.error ?? 'Create failed'),
  });
  const updateMutation = useMutation({
    mutationFn: (variables: any) => putApiPostsId(variables.id, variables.data),
    onSuccess: () => {
      message.success('Updated');
      setEditOpen(false);
      editForm.resetFields();
      setEditing(null);
      qc.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err: any) => message.error(err?.response?.data?.error ?? 'Update failed'),
  });
  const deleteMutation = useMutation({
    mutationFn: (variables: any) => deleteApiPostsId(variables.id),
    onSuccess: () => {
      message.success('Deleted');
      qc.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err: any) => message.error(err?.response?.data?.error ?? 'Delete failed'),
  });

  const dataSource: Post[] = (postsQuery.data as any)?.data ?? [];

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Content', dataIndex: 'content', key: 'content' },
    {
      title: 'Published',
      dataIndex: 'published',
      key: 'published',
      render: (v: boolean) => (v ? 'Yes' : 'No'),
    },
    { title: 'Author ID', dataIndex: 'authorId', key: 'authorId', width: 120 },
    { title: 'Created At', dataIndex: 'createdAt', key: 'createdAt', width: 200 },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Post) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="link"
            onClick={() => {
              setEditing(record);
              editForm.setFieldsValue({
                title: record.title,
                content: record.content ?? '',
                authorId: record.authorId,
                published: !!record.published,
              });
              setEditOpen(true);
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this post?"
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
            New Post
          </Button>
        </div>
      </div>
      <Table
        rowKey="id"
        loading={postsQuery.isLoading}
        dataSource={dataSource}
        columns={columns as any}
        pagination={{
          current: page,
          pageSize,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
      />

      <Modal
        title="Create Post"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={() => {
          createForm.validateFields().then((values) => {
            const payload = {
              title: values.title,
              content: values.content,
              authorId: Number(values.authorId),
              published: !!values.published,
            };
            createMutation.mutate({ data: payload });
          });
        }}
        confirmLoading={createMutation.isPending}
      >
        <Form form={createForm} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Content">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="authorId" label="Author" rules={[{ required: true }]}>
            <Select
              placeholder="Select author"
              options={(((usersQuery.data as any)?.data ?? []) as any[]).map((u: any) => ({
                label: `${u.name ?? u.email ?? 'User'} (#${u.id})`,
                value: u.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="published" label="Published" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Post"
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditing(null);
        }}
        onOk={() => {
          editForm.validateFields().then((values) => {
            if (!editing?.id) return;
            const payload = {
              title: values.title,
              content: values.content,
              authorId: values.authorId != null ? Number(values.authorId) : undefined,
              published: typeof values.published === 'boolean' ? values.published : undefined,
            };
            updateMutation.mutate({ id: editing.id, data: payload });
          });
        }}
        confirmLoading={updateMutation.isPending}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="title" label="Title">
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Content">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="authorId" label="Author ID">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="published" label="Published" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
}
