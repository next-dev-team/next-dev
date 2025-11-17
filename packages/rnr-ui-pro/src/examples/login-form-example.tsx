import React from 'react';
import { View } from 'react-native';
import { LoginForm } from '../components/login-form';
import { Text } from '@rnr/registry/src/new-york/components/ui/text';
import { Button } from '@rnr/registry/src/new-york/components/ui/button';

/**
 * Example: LoginForm usage
 */
export function LoginFormExample() {
  const handleLogin = async (values: any) => {
    console.log('Login values:', values);
    // Simulate authentication
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const handleForgotPassword = () => {
    console.log('Navigate to forgot password');
  };

  return (
    <View className="flex-1 items-center justify-center p-4 bg-background">
      <LoginForm
        onFinish={handleLogin}
        showRememberMe
        showForgotPassword
        onForgotPassword={handleForgotPassword}
      />

      <View className="mt-6 flex-row items-center gap-1">
        <Text className="text-muted-foreground">Don't have an account?</Text>
        <Button variant="link" className="p-0 h-auto">
          <Text className="text-primary">Sign up</Text>
        </Button>
      </View>
    </View>
  );
}

