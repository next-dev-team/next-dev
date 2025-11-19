import { View } from 'react-native';
import { PageContainer, ProForm, ProFormText } from '@rnr/rnr-ui';

export default function SettingsPage() {
  const handleFinish = async (values: any) => {
    console.log('Settings saved:', values);
  };

  return (
    <View className="w-full">
      <PageContainer title="Settings" subTitle="Application preferences">
        <ProForm title="General" description="Update core settings" onFinish={handleFinish} layout="vertical">
          <ProFormText name="siteName" label="Site Name" placeholder="Admin Portal" rules={[{ required: true }]} />
          <ProFormText name="supportEmail" label="Support Email" type="email" placeholder="support@example.com" rules={[{ type: 'email' }]} />
        </ProForm>
      </PageContainer>
    </View>
  );
}
