import { View } from 'react-native';
import { PageContainer, ProForm, ProFormText } from '@rnr/rnr-ui';

export default function UsersCreatePage() {
  const handleFinish = async (values: any) => {
    console.log('Create user:', values);
  };

  return (
    <View className="max-w-md w-full">
      <PageContainer title="Create User" subTitle="Add a new user">
        <ProForm title="" description="" onFinish={handleFinish} layout="vertical">
          <ProFormText name="name" label="Name" placeholder="Full name" rules={[{ required: true }]} />
          <ProFormText name="email" label="Email" type="email" placeholder="m@example.com" rules={[{ required: true }, { type: 'email' }]} />
          <ProFormText name="role" label="Role" placeholder="Admin" />
        </ProForm>
      </PageContainer>
    </View>
  );
}