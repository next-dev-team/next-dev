import { useLoginUser, useLogoutUser } from '@/api/petstore/user/user';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Alert, Button, Form, Input, Space } from 'antd';
import React from 'react';

const PetStoreLogin: React.FC = () => {
  const [form] = Form.useForm<{ username: string; password: string }>();
  const { setName } = useModel('global');
  const { setInitialState } = useModel('@@initialState');

  // set demo user by default
  React.useEffect(() => {
    form.setFieldsValue({ username: 'demo', password: 'demo123' });
  }, [form]);

  const values = form.getFieldsValue();

  const login = useLoginUser(
    { username: values?.username || '', password: values?.password || '' },
    { query: { enabled: false, retry: false } },
  );

  const logout = useLogoutUser({ query: { enabled: false, retry: false } });

  const onFinish = async () => {
    const u = form.getFieldValue('username');
    await login.refetch();
    if (login.data && login.data.status === 200) {
      setName(u);
      setInitialState((s: any) => ({ ...(s || {}), name: u }));
      localStorage.setItem('petstoreUserName', u);
    }
  };

  return (
    <PageContainer ghost>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input placeholder="username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={login.isFetching}>
              Login
            </Button>
          </Form.Item>
        </Form>

        <div
          style={{ cursor: 'pointer', color: '#1677ff', width: 'fit-content' }}
          onClick={async () => {
            await logout.refetch();
            setName('Umi Max');
            setInitialState((s: any) => ({ ...(s || {}), name: 'Umi Max' }));
            localStorage.removeItem('petstoreUserName');
            localStorage.removeItem('petstoreToken');
          }}
        >
          Logout
        </div>

        {login.isError && (
          <Alert
            type="error"
            showIcon
            message={(login.error as unknown as Error).message}
          />
        )}
        {login.data && (
          <Alert type="success" showIcon message={login.data.data as string} />
        )}
        {logout.isError && (
          <Alert
            type="error"
            showIcon
            message={(logout.error as unknown as Error).message}
          />
        )}
        {logout.data && <Alert type="success" showIcon message="Logged out" />}
      </Space>
    </PageContainer>
  );
};

export default PetStoreLogin;
