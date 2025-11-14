import { useCreateUser } from '@/api/petstore/user/user';
import { PageContainer } from '@ant-design/pro-components';
import { Alert, Button, Form, Input, InputNumber, Space } from 'antd';
import React from 'react';

const UserCreate: React.FC = () => {
  const [form] = Form.useForm();
  const createUser = useCreateUser({ mutation: { retry: false } });

  const onFinish = async () => {
    const values = form.getFieldsValue();
    await createUser.mutateAsync({ data: values });
  };

  return (
    <PageContainer ghost>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ userStatus: 1 }}>
          <Form.Item name="username" label="Username" rules={[{ required: true }]}> <Input placeholder="Username" /> </Form.Item>
          <Form.Item name="firstName" label="First Name"> <Input placeholder="First Name" /> </Form.Item>
          <Form.Item name="lastName" label="Last Name"> <Input placeholder="Last Name" /> </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ type: 'email' }]}> <Input placeholder="Email" /> </Form.Item>
          <Form.Item name="password" label="Password"> <Input.Password placeholder="Password" /> </Form.Item>
          <Form.Item name="phone" label="Phone"> <Input placeholder="Phone" /> </Form.Item>
          <Form.Item name="userStatus" label="User Status"> <InputNumber min={0} /> </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={createUser.isPending}>Create User</Button>
          </Form.Item>
        </Form>
        {createUser.isError && (
          <Alert type="error" showIcon message={(createUser.error as unknown as Error).message} />
        )}
        {createUser.isSuccess && (
          <Alert type="success" showIcon message="User created" />
        )}
      </Space>
    </PageContainer>
  );
};

export default UserCreate;