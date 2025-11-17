'use client';

import { ProForm } from '@rnr/rnr-ui-pro';
import { Input } from '@/registry/new-york/components/ui/input';
import { Textarea } from '@/registry/new-york/components/ui/textarea';
import { useState } from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { PageContainer } from '@/components/layout/page-container';

export default function ProFormPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (values: any) => {
    console.log('Form values:', values);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <PageContainer
      title="ProForm Example"
      description="Advanced form with built-in validation and submission handling"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Forms', href: '/forms' },
        { title: 'ProForm' },
      ]}
    >
      <div className="max-w-2xl">
        {submitted && (
          <View className="mb-4 rounded-lg bg-green-100 dark:bg-green-900/30 p-4">
            <Text className="text-green-800 dark:text-green-300">
              ✓ Form submitted successfully!
            </Text>
          </View>
        )}

        <ProForm
          title="Contact Form"
          description="Fill out the form below and we'll get back to you"
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            name: '',
            email: '',
            subject: '',
            message: '',
          }}
        >
          <ProForm.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter your name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input placeholder="John Doe" />
          </ProForm.Item>

          <ProForm.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder="john@example.com" autoCapitalize="none" />
          </ProForm.Item>

          <ProForm.Item
            name="subject"
            label="Subject"
            rules={[
              { required: true, message: 'Please enter a subject' },
              { min: 5, message: 'Subject must be at least 5 characters' },
            ]}
          >
            <Input placeholder="How can we help you?" />
          </ProForm.Item>

          <ProForm.Item
            name="message"
            label="Message"
            rules={[
              { required: true, message: 'Please enter your message' },
              { min: 20, message: 'Message must be at least 20 characters' },
            ]}
          >
            <Textarea
              placeholder="Tell us more about your inquiry..."
              className="min-h-[120px]"
            />
          </ProForm.Item>
        </ProForm>

        {/* Features List */}
        <div className="mt-6 rounded-lg border bg-muted/50 p-6">
          <h3 className="text-lg font-semibold mb-3">ProForm Features</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Built-in validation with rc-field-form</li>
            <li>✓ Automatic submit/reset buttons</li>
            <li>✓ Loading states support</li>
            <li>✓ Title and description display</li>
            <li>✓ Multiple layout options</li>
            <li>✓ Error handling</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}

