'use client';

import { LoginForm } from '@rnr/rnr-ui-pro';
import { useRouter } from 'next/navigation';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Button } from '@/registry/new-york/components/ui/button';
import Link from 'next/link';

export default function LoginProPage() {
  const router = useRouter();

  const handleLogin = async (values: any) => {
    console.log('Login values:', values);
    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1500));
    router.push('/dashboard');
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="bg-primary text-primary-foreground mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
            <span className="text-3xl font-bold">R</span>
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Using ProForm component with built-in features
          </p>
        </div>

        {/* LoginForm Component */}
        <div className="bg-card rounded-lg border p-8 shadow-lg">
          <LoginForm
            onFinish={handleLogin}
            showRememberMe
            showForgotPassword
            onForgotPassword={handleForgotPassword}
            title=""
            description=""
            emailLabel="Email Address"
            passwordLabel="Password"
            submitText="Sign In"
          />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-2">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-background hover:bg-accent flex items-center justify-center space-x-2 rounded-lg border px-4 py-2 text-sm transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              <span>Google</span>
            </button>
            <button className="bg-background hover:bg-accent flex items-center justify-center space-x-2 rounded-lg border px-4 py-2 text-sm transition-colors">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span>GitHub</span>
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-muted-foreground text-center text-sm">
          {`Don't have an account? `}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Sign up for free
          </Link>
        </p>

        {/* Feature Notice */}
        <div className="rounded-lg border bg-muted/50 p-4 text-center">
          <Text className="text-sm text-muted-foreground">
            💡 This page uses the <strong>LoginForm</strong> component from{' '}
            <strong>@rnr/rnr-ui-pro</strong>
          </Text>
        </div>
      </div>
    </div>
  );
}

