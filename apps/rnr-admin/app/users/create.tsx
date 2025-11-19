import { View } from 'react-native';
import {
  PageContainer,
  ProForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormCheckbox,
  ProFormRadio,
  ProFormDigit,
} from '@rnr/rnr-ui';

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
          <ProFormText name="password" label="Password" type="password" placeholder="••••••" rules={[{ required: true }, { min: 6 }]} />
          <ProFormSelect
            name="role"
            label="Role"
            placeholder="Select role"
            options={[
              { label: 'Admin', value: 'admin' },
              { label: 'Editor', value: 'editor' },
              { label: 'Viewer', value: 'viewer' },
            ]}
            rules={[{ required: true }]}
          />
          <ProFormRadio
            name="status"
            label="Status"
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
            rules={[{ required: true }]}
          />
          <ProFormDigit name="age" label="Age" placeholder="Age" min={0} max={120} />
          <ProFormTextArea name="bio" label="Bio" placeholder="Short bio" rows={4} maxLength={200} showCount />
          <ProFormCheckbox name="agree" text="Agree to terms" rules={[{ required: true }]} />
          <ProFormCheckbox name="notifications" text="Enable email notifications" />
        </ProForm>
      </PageContainer>
    </View>
  );
}