'use client';

import { PageContainer } from '@/components/layout/page-container';
import { View } from 'react-native';
import { Input } from '@/registry/new-york/components/ui/input';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { useState } from 'react';

export default function BasicFormPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Form submitted successfully
      // TODO: Send to API
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <PageContainer
      title="Basic Form"
      description="Simple form example with validation"
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Forms', href: '/forms' },
        { title: 'Basic Form' },
      ]}
    >
      <div className="max-w-2xl">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <View className="space-y-6">
            {/* Name Field */}
            <View>
              <Text className="mb-2 text-sm font-medium">
                Name <Text className="text-destructive">*</Text>
              </Text>
              <Input
                placeholder="Enter your name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
              {errors.name && (
                <Text variant="small" className="text-destructive mt-1">
                  {errors.name}
                </Text>
              )}
            </View>

            {/* Email Field */}
            <View>
              <Text className="mb-2 text-sm font-medium">
                Email <Text className="text-destructive">*</Text>
              </Text>
              <Input
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text variant="small" className="text-destructive mt-1">
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Phone Field */}
            <View>
              <Text className="mb-2 text-sm font-medium">
                Phone <Text className="text-destructive">*</Text>
              </Text>
              <Input
                placeholder="Enter your phone"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />
              {errors.phone && (
                <Text variant="small" className="text-destructive mt-1">
                  {errors.phone}
                </Text>
              )}
            </View>

            {/* Company Field */}
            <View>
              <Text className="mb-2 text-sm font-medium">Company</Text>
              <Input
                placeholder="Enter your company (optional)"
                value={formData.company}
                onChangeText={(text) => setFormData({ ...formData, company: text })}
              />
            </View>

            {/* Message Field */}
            <View>
              <Text className="mb-2 text-sm font-medium">Message</Text>
              <Input
                placeholder="Enter your message"
                value={formData.message}
                onChangeText={(text) => setFormData({ ...formData, message: text })}
                multiline
                numberOfLines={4}
                className="h-24"
              />
            </View>

            {/* Success Message */}
            {submitted && (
              <View className="rounded-lg bg-green-100 dark:bg-green-900/30 p-4">
                <Text className="text-green-800 dark:text-green-300">
                  ✓ Form submitted successfully!
                </Text>
              </View>
            )}

            {/* Submit Button */}
            <View className="flex-row gap-3">
              <Button onPress={handleSubmit} className="flex-1">
                <Text className="text-primary-foreground font-medium">Submit</Text>
              </Button>
              <Button
                variant="outline"
                onPress={() => {
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    message: '',
                  });
                  setErrors({});
                }}
                className="flex-1"
              >
                <Text className="font-medium">Reset</Text>
              </Button>
            </View>
          </View>
        </div>

        {/* Form Guide */}
        <div className="mt-6 rounded-lg border bg-muted/50 p-6">
          <h3 className="text-lg font-semibold mb-3">Form Features</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✓ Client-side validation</li>
            <li>✓ Error messages display</li>
            <li>✓ Required field indicators</li>
            <li>✓ Reset functionality</li>
            <li>✓ Success feedback</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
}

