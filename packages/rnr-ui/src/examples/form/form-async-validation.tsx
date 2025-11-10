import { Form } from '@/rnr-ui/components/ui/forms';
import { TextInput, View, Text } from 'react-native';
import { Button } from '~/components/ui/button';
import { useState } from 'react';

export function FormAsyncValidationPreview() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  // Simulate async validation
  const validateUsername = async (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Username is required'));
    }

    if (value.length < 3) {
      return Promise.reject(new Error('Username must be at least 3 characters'));
    }

    // Simulate API call to check if username is available
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    // Simulate username availability check
    const takenUsernames = ['admin', 'user', 'test', 'demo'];
    if (takenUsernames.includes(value.toLowerCase())) {
      return Promise.reject(new Error('This username is already taken'));
    }

    return Promise.resolve();
  };

  const validateEmail = async (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Email is required'));
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return Promise.reject(new Error('Please enter a valid email address'));
    }

    // Simulate API call to check if email is available
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    // Simulate email availability check
    const takenEmails = ['test@example.com', 'demo@example.com'];
    if (takenEmails.includes(value.toLowerCase())) {
      return Promise.reject(new Error('This email is already registered'));
    }

    return Promise.resolve();
  };

  const validatePhone = async (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Phone number is required'));
    }

    // Basic phone validation (US format)
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phoneRegex.test(value)) {
      return Promise.reject(new Error('Please enter phone in format: (123) 456-7890'));
    }

    // Simulate API call to validate phone number
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);

    // Simulate phone validation
    const invalidPhones = ['(000) 000-0000', '(123) 123-1234'];
    if (invalidPhones.includes(value)) {
      return Promise.reject(new Error('This phone number appears to be invalid'));
    }

    return Promise.resolve();
  };

  return (
    <View className="w-full max-w-md">
      <Form form={form} onFinish={onFinish}>
        <Text className="text-muted-foreground mb-4 text-sm">
          Try usernames: admin, user, test (these are taken)
        </Text>

        {/* Username with async validation */}
        <Form.Item
          name="username"
          label="Username"
          rules={[{ validator: validateUsername }]}
          validateTrigger="onBlur"
        >
          <TextInput
            placeholder="Choose a username"
            autoCapitalize="none"
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
            editable={!loading}
          />
        </Form.Item>

        {/* Email with async validation */}
        <Form.Item
          name="email"
          label="Email Address"
          rules={[{ validator: validateEmail }]}
          validateTrigger="onBlur"
        >
          <TextInput
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
            editable={!loading}
          />
        </Form.Item>

        {/* Phone with async validation */}
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ validator: validatePhone }]}
          validateTrigger="onBlur"
        >
          <TextInput
            placeholder="(123) 456-7890"
            keyboardType="phone-pad"
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
            editable={!loading}
          />
        </Form.Item>

        <View className="mt-4">
          <Button onPress={() => form.submit()} disabled={loading}>
            {loading ? 'Validating...' : 'Submit Form'}
          </Button>
        </View>
      </Form>
    </View>
  );
}
