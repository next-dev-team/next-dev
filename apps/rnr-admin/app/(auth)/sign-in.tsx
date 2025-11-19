import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { ProForm, ProFormText, PageContainer } from '@rnr/rnr-ui';
import { useAuth } from '@admin/components/AuthContext';

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const handleFinish = async (values: any) => {
    await signIn(values.email, values.password);
    router.replace('/dashboard');
  };

  return (
    <View className="max-w-md w-full">
      <PageContainer title="Sign In" subTitle="Welcome back">
        <ProForm title="" description="" onFinish={handleFinish} layout="vertical">
          <ProFormText name="email" label="Email" type="email" placeholder="m@example.com" rules={[{ required: true }, { type: 'email' }]} />
          <ProFormText name="password" label="Password" type="password" placeholder="••••••" rules={[{ required: true }, { min: 6 }]} />
        </ProForm>
      </PageContainer>
    </View>
  );
}