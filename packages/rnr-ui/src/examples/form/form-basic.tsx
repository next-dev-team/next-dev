import { Form } from '@/rnr-ui/components/ui/forms';
import { TextInput } from 'react-native';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';

export function FormBasicPreview() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <View className="w-full max-w-md">
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}>
          <TextInput
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}>
          <TextInput
            placeholder="Enter your password"
            secureTextEntry
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
          />
        </Form.Item>

        <View className="mt-4">
          <Button onPress={() => form.submit()}>Submit</Button>
        </View>
      </Form>
    </View>
  );
}
