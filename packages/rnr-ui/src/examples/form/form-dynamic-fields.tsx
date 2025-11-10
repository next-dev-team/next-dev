import { Form } from '@/rnr-ui/components/ui/forms';
import { TextInput, View, Text } from 'react-native';
import { Button } from '~/components/ui/button';
import { useState } from 'react';

export function FormDynamicFieldsPreview() {
  const [form] = Form.useForm();
  const [emails, setEmails] = useState(['']);

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  const addEmail = () => {
    setEmails([...emails, '']);
  };

  const removeEmail = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);

    // Remove from form values
    const currentEmails = form.getFieldValue('emails') || [];
    const updatedEmails = currentEmails.filter((_: any, i: number) => i !== index);
    form.setFieldsValue({ emails: updatedEmails });
  };

  return (
    <View className="w-full max-w-md">
      <Form form={form} onFinish={onFinish}>
        {/* Static fields */}
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter your first name' }]}
        >
          <TextInput
            placeholder="Enter first name"
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
          />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter your last name' }]}
        >
          <TextInput
            placeholder="Enter last name"
            className="border-input bg-background text-foreground rounded-md border px-3 py-2"
          />
        </Form.Item>

        {/* Dynamic email fields */}
        <Text className="mb-2 text-base font-medium">Email Addresses</Text>

        {emails.map((_, index) => (
          <View key={index} className="mb-2 flex-row items-center">
            <View className="mr-2 flex-1">
              <Form.Item
                name={['emails', index]}
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
                noStyle
              >
                <TextInput
                  placeholder={`Email ${index + 1}`}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="border-input bg-background text-foreground rounded-md border px-3 py-2"
                />
              </Form.Item>
            </View>

            {emails.length > 1 && (
              <Button onPress={() => removeEmail(index)} variant="destructive" size="sm">
                Remove
              </Button>
            )}
          </View>
        ))}

        <Button onPress={addEmail} variant="outline" className="mb-4">
          Add Email
        </Button>

        <View className="mt-4">
          <Button onPress={() => form.submit()}>Submit Form</Button>
        </View>
      </Form>
    </View>
  );
}
