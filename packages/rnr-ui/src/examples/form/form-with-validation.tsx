import { Form } from '@/rnr-ui/components/ui/forms';
import { TextInput } from 'react-native';
import { View } from 'react-native';
import { Button } from '~/components/ui/button';

export function FormWithValidationPreview() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <View className="w-full max-w-md">
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="username"
          label="Username"
          rules={[
            { required: true, message: 'Username is required' },
            { min: 3, message: 'Username must be at least 3 characters' },
            { max: 20, message: 'Username must be less than 20 characters' },
          ]}
        >
          <TextInput
            placeholder="Enter username"
            autoCapitalize="none"
            className="border border-input rounded-md px-3 py-2 bg-background text-foreground"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
        >
          <TextInput
            placeholder="Enter email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border border-input rounded-md px-3 py-2 bg-background text-foreground"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: 'Phone number is required' },
            { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' },
          ]}
        >
          <TextInput
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            className="border border-input rounded-md px-3 py-2 bg-background text-foreground"
          />
        </Form.Item>

        <View className="mt-4">
          <Button onPress={() => form.submit()}>
            Submit Form
          </Button>
        </View>
      </Form>
    </View>
  );
}

