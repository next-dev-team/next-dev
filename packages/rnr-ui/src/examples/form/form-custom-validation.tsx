import { Form } from '@/rnr-ui/components/ui/forms';
import { TextInput, View } from 'react-native';
import { Button } from '~/components/ui/button';

export function FormCustomValidationPreview() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  // Custom validator functions
  const validateUsername = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Username is required'));
    }
    if (value.length < 3) {
      return Promise.reject(new Error('Username must be at least 3 characters'));
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return Promise.reject(
        new Error('Username can only contain letters, numbers, and underscores'),
      );
    }
    return Promise.resolve();
  };

  const validateAge = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Age is required'));
    }
    const age = parseInt(value, 10);
    if (isNaN(age)) {
      return Promise.reject(new Error('Please enter a valid number'));
    }
    if (age < 18) {
      return Promise.reject(new Error('You must be at least 18 years old'));
    }
    if (age > 120) {
      return Promise.reject(new Error('Please enter a valid age'));
    }
    return Promise.resolve();
  };

  const validateConfirmPassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('Please confirm your password'));
    }
    const password = form.getFieldValue('password');
    if (value !== password) {
      return Promise.reject(new Error('Passwords do not match'));
    }
    return Promise.resolve();
  };

  return (
    <View className="w-full max-w-md">
      <Form form={form} onFinish={onFinish}>
        {/* Username with custom validation */}
        <Form.Item name="username" label="Username" rules={[{ validator: validateUsername }]}>
          <TextInput
            placeholder="Choose a username"
            autoCapitalize="none"
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
          />
        </Form.Item>

        {/* Age with custom validation */}
        <Form.Item name="age" label="Age" rules={[{ validator: validateAge }]}>
          <TextInput
            placeholder="Enter your age"
            keyboardType="numeric"
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
          />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <TextInput
            placeholder="Enter your password"
            secureTextEntry
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
          />
        </Form.Item>

        {/* Confirm Password with custom validation */}
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          rules={[{ validator: validateConfirmPassword }]}
        >
          <TextInput
            placeholder="Confirm your password"
            secureTextEntry
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
          />
        </Form.Item>

        <View className="mt-4">
          <Button onPress={() => form.submit()}>Submit Form</Button>
        </View>
      </Form>
    </View>
  );
}
