import { ProForm, ProFormText, ProFormSelect, ProFormTextArea } from '@/rnr-ui/components/ui';
import { View } from 'react-native';

export function ProFormBasicPreview() {
  const handleFinish = async (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <View className="w-full max-w-md p-4">
      <ProForm
        onFinish={handleFinish}
        title="Basic Form"
        description="This is a basic form example using ProForm"
        layout="vertical"
      >
        <ProFormText
          name="username"
          label="Username"
          placeholder="Enter username"
          rules={[
            { required: true, message: 'Please enter username' },
            { min: 3, message: 'Username must be at least 3 characters' },
          ]}
        />

        <ProFormText
          name="email"
          label="Email"
          type="email"
          placeholder="Enter email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        />

        <ProFormSelect
          name="country"
          label="Country"
          placeholder="Select country"
          options={[
            { label: 'United States', value: 'us' },
            { label: 'Canada', value: 'ca' },
            { label: 'United Kingdom', value: 'uk' },
          ]}
          rules={[{ required: true, message: 'Please select a country' }]}
        />

        <ProFormTextArea
          name="bio"
          label="Bio"
          placeholder="Tell us about yourself"
          rows={4}
          maxLength={200}
          showCount
        />
      </ProForm>
    </View>
  );
}
