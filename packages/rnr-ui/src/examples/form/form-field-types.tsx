import { Form } from '@/rnr-ui/components/ui/forms';
import { TextInput, View, Text } from 'react-native';
import { Button } from '~/components/ui/button';
import { useState } from 'react';

export function FormFieldTypesPreview() {
  const [form] = Form.useForm();
  const [submittedData, setSubmittedData] = useState<any>(null);

  const onFinish = (values: any) => {
    console.log('Form values:', values);
    setSubmittedData(values);
  };

  return (
    <View className="w-full max-w-md">
      <Form form={form} onFinish={onFinish}>
        {/* Text Input */}
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <TextInput
            placeholder="Enter your full name"
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
          />
        </Form.Item>

        {/* Email Input */}
        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
        >
          <TextInput
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
          />
        </Form.Item>

        {/* Phone Input */}
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            { required: true, message: 'Please enter your phone number' },
            { pattern: /^[0-9]{10}$/, message: 'Please enter a valid 10-digit phone number' },
          ]}
        >
          <TextInput
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
          />
        </Form.Item>

        {/* Password Input */}
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 8, message: 'Password must be at least 8 characters' },
            { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Password must contain uppercase, lowercase, and number' },
          ]}
        >
          <TextInput
            placeholder="Enter your password"
            secureTextEntry
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
          />
        </Form.Item>

        {/* Textarea (multiline) */}
        <Form.Item
          name="bio"
          label="Bio"
          rules={[
            { max: 200, message: 'Bio must be less than 200 characters' },
          ]}
        >
          <TextInput
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
            className="border-input bg-background text-foreground rounded-md border px-3 py-2 min-h-[100px]"
          />
        </Form.Item>

        <View className="mt-4">
          <Button onPress={() => form.submit()}>Submit Form</Button>
        </View>

        {submittedData && (
          <View className="mt-4 p-4 bg-muted rounded-md">
            <Text className="font-semibold mb-2">Submitted Data:</Text>
            <Text>{JSON.stringify(submittedData, null, 2)}</Text>
          </View>
        )}
      </Form>
    </View>
  );
}