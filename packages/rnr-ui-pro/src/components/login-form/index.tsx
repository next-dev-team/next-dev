import { Form } from '@rnr/rnr-ui/src/components/ui/forms';
import React, { useState } from 'react';
import { View, ViewStyle } from 'react-native';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';
import { Input } from '@rnr/registry/src/new-york/components/ui/input';
import { Text } from '@rnr/registry/src/new-york/components/ui/text';
import { Checkbox } from '@rnr/registry/src/new-york/components/ui/checkbox';
import { Label } from '@rnr/registry/src/new-york/components/ui/label';
import { cn } from '@rnr/registry/src/new-york/lib/utils';

export interface LoginFormProps {
  onFinish?: (values: LoginFormValues) => void | Promise<void>;
  onFinishFailed?: (errorInfo: any) => void;
  loading?: boolean;
  showRememberMe?: boolean;
  showForgotPassword?: boolean;
  onForgotPassword?: () => void;
  title?: string;
  description?: string;
  className?: string;
  style?: ViewStyle;
  emailLabel?: string;
  passwordLabel?: string;
  submitText?: string;
  rememberMeText?: string;
  forgotPasswordText?: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * LoginForm - Pre-built authentication form
 * Ready-to-use login form with email/password and optional remember me
 */
export function LoginForm({
  onFinish,
  onFinishFailed,
  loading = false,
  showRememberMe = true,
  showForgotPassword = true,
  onForgotPassword,
  title = 'Sign In',
  description = 'Enter your credentials to access your account',
  className,
  style,
  emailLabel = 'Email',
  passwordLabel = 'Password',
  submitText = 'Sign In',
  rememberMeText = 'Remember me',
  forgotPasswordText = 'Forgot password?',
}: LoginFormProps) {
  const [form] = Form.useForm();
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onFinish?.({ ...values, remember: rememberMe });
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
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input
            placeholder="Enter your password"
            secureTextEntry
            autoComplete="password"
          />
        </Form.Item>

        {(showRememberMe || showForgotPassword) && (
          <View className="flex-row justify-between items-center mb-4">
            {showRememberMe && (
              <View className="flex-row items-center gap-2">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={setRememberMe}
                  aria-labelledby="remember-label"
                />
                <Label
                  nativeID="remember-label"
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  {rememberMeText}
                </Label>
              </View>
            )}

            {showForgotPassword && (
              <Button
                variant="link"
                onPress={onForgotPassword}
                size="sm"
                className="p-0"
              >
                <Text className="text-primary text-sm">{forgotPasswordText}</Text>
              </Button>
            )}
          </View>
        )}

        <Button
          onPress={handleSubmit}
          disabled={loading}
          className="w-full"
        >
          <Text>{loading ? 'Signing in...' : submitText}</Text>
        </Button>
      </Form>
    </View>
  );
}

