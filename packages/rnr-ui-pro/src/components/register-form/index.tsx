import { Form } from '@rnr/rnr-ui/src/components/ui/forms';
import React, { useState } from 'react';
import { View, ViewStyle } from 'react-native';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';
import { Input } from '@rnr/registry/src/new-york/components/ui/input';
import { Text } from '@rnr/registry/src/new-york/components/ui/text';
import { Checkbox } from '@rnr/registry/src/new-york/components/ui/checkbox';
import { Label } from '@rnr/registry/src/new-york/components/ui/label';
import { cn } from '@rnr/registry/src/new-york/lib/utils';

export interface RegisterFormProps {
  onFinish?: (values: RegisterFormValues) => void | Promise<void>;
  onFinishFailed?: (errorInfo: any) => void;
  loading?: boolean;
  showTermsAndConditions?: boolean;
  onTermsClick?: () => void;
  title?: string;
  description?: string;
  className?: string;
  style?: ViewStyle;
  nameLabel?: string;
  emailLabel?: string;
  passwordLabel?: string;
  confirmPasswordLabel?: string;
  submitText?: string;
  termsText?: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms?: boolean;
}

/**
 * RegisterForm - Pre-built registration form
 * Ready-to-use signup form with validation and terms acceptance
 */
export function RegisterForm({
  onFinish,
  onFinishFailed,
  loading = false,
  showTermsAndConditions = true,
  onTermsClick,
  title = 'Create Account',
  description = 'Enter your information to get started',
  className,
  style,
  nameLabel = 'Full Name',
  emailLabel = 'Email',
  passwordLabel = 'Password',
  confirmPasswordLabel = 'Confirm Password',
  submitText = 'Create Account',
  termsText = 'I agree to the Terms and Conditions',
}: RegisterFormProps) {
  const [form] = Form.useForm();
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async () => {
    if (showTermsAndConditions && !agreeToTerms) {
      return;
    }

    try {
      const values = await form.validateFields();
      await onFinish?.({ ...values, agreeToTerms });
    } catch (errorInfo) {
      onFinishFailed?.(errorInfo);
    }
  };

  return (
    <View className={cn('w-full max-w-md', className)} style={style}>
      {(title || description) && (
        <View className="mb-6 text-center">
          {title && (
            <Text className="text-3xl font-bold mb-2">{title}</Text>
          )}
          {description && (
            <Text className="text-muted-foreground">{description}</Text>
          )}
        </View>
      )}

      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="name"
          label={nameLabel}
          rules={[
            { required: true, message: 'Please enter your name' },
            { min: 2, message: 'Name must be at least 2 characters' },
          ]}
        >
          <Input
            placeholder="John Doe"
            autoCapitalize="words"
            autoComplete="name"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label={emailLabel}
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={passwordLabel}
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
        >
          <Input
            placeholder="Create a strong password"
            secureTextEntry
            autoComplete="password-new"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label={confirmPasswordLabel}
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match'));
              },
            }),
          ]}
        >
          <Input
            placeholder="Re-enter your password"
            secureTextEntry
            autoComplete="password-new"
          />
        </Form.Item>

        {showTermsAndConditions && (
          <View className="flex-row items-center gap-2 mb-4">
            <Checkbox
              checked={agreeToTerms}
              onCheckedChange={setAgreeToTerms}
              aria-labelledby="terms-label"
            />
            <Label
              nativeID="terms-label"
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              className="flex-1"
            >
              {termsText}
              {onTermsClick && (
                <Text
                  className="text-primary underline"
                  onPress={onTermsClick}
                >
                  {' '}View Terms
                </Text>
              )}
            </Label>
          </View>
        )}

        <Button
          onPress={handleSubmit}
          disabled={loading || (showTermsAndConditions && !agreeToTerms)}
          className="w-full"
        >
          <Text>{loading ? 'Creating account...' : submitText}</Text>
        </Button>
      </Form>
    </View>
  );
}

