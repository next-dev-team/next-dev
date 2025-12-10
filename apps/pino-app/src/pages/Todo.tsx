import { PageContainer } from '@ant-design/pro-components';
import {
  todoControllerAllQueryKey,
  useTodoControllerAll,
  useTodoControllerCreate,
  useTodoControllerRemove,
  useTodoControllerUpdate,
} from '@rnr/api-counter/src/gen/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, Input, InputNumber, Modal, message, Space, Switch, Table } from 'antd';
import { useMemo, useState } from 'react';

const Todo = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useTodoControllerAll();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const createMutation = useTodoControllerCreate({
    mutation: {
      onSuccess: () => {
        message.success('Created');
        queryClient.invalidateQueries({
          queryKey: todoControllerAllQueryKey(),
        });
      },
      onError: (e: any) => {
        message.error(e?.message || 'Create failed');
      },
    },
  });

  const updateMutation = useTodoControllerUpdate({
    mutation: {
      onSuccess: () => {
        message.success('Updated');
        queryClient.invalidateQueries({
          queryKey: todoControllerAllQueryKey(),
        });
      },
      onError: (e: any) => {
        message.error(e?.message || 'Update failed');
      },
    },
  });

  const removeMutation = useTodoControllerRemove({
    mutation: {
      onSuccess: () => {
        message.success('Deleted');
        queryClient.invalidateQueries({
          queryKey: todoControllerAllQueryKey(),
        });
      },
      onError: (e: any) => {
        message.error(e?.message || 'Delete failed');
      },
    },
  });

  const rows = Array.isArray(data) ? (data as any[]) : [];

  const sample = rows[0] || {};
  const fieldDefs = useMemo(() => {
    const keys = Object.keys(sample).filter((k) => k !== 'id');
    if (!keys.length)
      return [
        { key: 'title', type: 'string' },
        { key: 'completed', type: 'boolean' },
      ];
    return keys
      .filter((k) => typeof (sample as any)[k] !== 'object')
      .map((k) => {
        const v = (sample as any)[k];
        const t = typeof v;
        return {
          key: k,
          type: t === 'boolean' ? 'boolean' : t === 'number' ? 'number' : 'string',
        };
      });
  }, [sample]);

  const columns = useMemo(() => {
    const base = rows.length
      ? Object.keys(rows[0]).map((key) => ({ title: key, dataIndex: key, key }))
      : [];
    const actionCol = {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            onClick={() => {
              setCurrentItem(record);
              setEditOpen(true);
              editForm.setFieldsValue(record);
            }}
          >
            Edit
          </Button>
          <Button
            danger
            onClick={() => {
              const id = String(record?.id ?? '');
              if (!id) {
                message.error('Missing id');
                return;
              }
              removeMutation.mutate({ id });
            }}
            loading={removeMutation.isPending}
          >
            Delete
          </Button>
        </Space>
      ),
    } as any;
    return [...base, actionCol];
  }, [rows, editForm, removeMutation.isPending]);

  return (
    <PageContainer>
      <Card style={{ borderRadius: 8, marginTop: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Space wrap>
            <Button
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: todoControllerAllQueryKey(),
                })
              }
            >
              Refresh
            </Button>
            <Button type="primary" onClick={() => setCreateOpen(true)}>
              New Todo
            </Button>
          </Space>

          <Table
            loading={isLoading}
            columns={columns as any}
            dataSource={rows}
            rowKey={(r: any, i) => r?.id ?? i}
            pagination={false}
          />

          <Modal
            open={createOpen}
            title="Create Todo"
            onCancel={() => setCreateOpen(false)}
            onOk={() => createForm.submit()}
            confirmLoading={createMutation.isPending}
          >
            <Form
              form={createForm}
              layout="vertical"
              onFinish={(values) => {
                createMutation.mutate({ data: values as any });
                setCreateOpen(false);
                createForm.resetFields();
              }}
            >
              {fieldDefs.map((f) => {
                if (f.type === 'boolean') {
                  return (
                    <Form.Item key={f.key} name={f.key} label={f.key} valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  );
                }
                if (f.type === 'number') {
                  return (
                    <Form.Item key={f.key} name={f.key} label={f.key}>
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  );
                }
                return (
                  <Form.Item key={f.key} name={f.key} label={f.key}>
                    <Input />
                  </Form.Item>
                );
              })}
            </Form>
          </Modal>

          <Modal
            open={editOpen}
            title="Edit Todo"
            onCancel={() => setEditOpen(false)}
            onOk={() => editForm.submit()}
            confirmLoading={updateMutation.isPending}
          >
            <Form
              form={editForm}
              layout="vertical"
              onFinish={(values) => {
                const id = String(currentItem?.id ?? '');
                if (!id) {
                  message.error('Missing id');
                  return;
                }
                updateMutation.mutate({ id, data: values as any });
                setEditOpen(false);
              }}
            >
              {fieldDefs.map((f) => {
                if (f.type === 'boolean') {
                  return (
                    <Form.Item key={f.key} name={f.key} label={f.key} valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  );
                }
                if (f.type === 'number') {
                  return (
                    <Form.Item key={f.key} name={f.key} label={f.key}>
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  );
                }
                return (
                  <Form.Item key={f.key} name={f.key} label={f.key}>
                    <Input />
                  </Form.Item>
                );
              })}
            </Form>
          </Modal>
        </Space>
      </Card>
    </PageContainer>
  );
};

export default Todo;
