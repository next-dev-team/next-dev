'use client';

import Link from 'next/link';
import { View } from 'react-native';
import { Input } from '@/registry/new-york/components/ui/input';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Send password reset email
      // TODO: Implement password reset
      setSubmitted(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4">
            <span className="text-3xl font-bold">R</span>
          </div>
          <h1 className="text-3xl font-bold">Forgot password?</h1>
            <p className="text-muted-foreground mt-2">
              {`No worries, we'll send you reset instructions`}
          </p>
        </div>

        {!submitted ? (
          <>
            {/* Reset Form */}
            <div className="rounded-lg border bg-card p-8 shadow-lg">
              <View className="space-y-6">
                {/* Email Field */}
                <View>
                  <Text className="mb-2 text-sm font-medium">Email</Text>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="pl-10"
                  />
                  </div>
                  {error && (
                    <Text variant="small" className="text-destructive mt-1">
                      {error}
                    </Text>
                  )}
                </View>

                {/* Submit Button */}
                <Button onPress={handleSubmit} className="w-full">
                  <View className="flex-row items-center justify-center space-x-2">
                    <Send className="h-5 w-5 text-primary-foreground" />
                    <Text className="text-primary-foreground font-medium">
                      Send Reset Link
                    </Text>
                  </View>
                </Button>
              </View>
            </div>

            {/* Back to Login */}
            <Link
              href="/login"
              className="flex items-center justify-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to login</span>
            </Link>
          </>
        ) : (
          <>
            {/* Success Message */}
            <div className="rounded-lg border bg-card p-8 shadow-lg text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-muted-foreground mb-6">
                We sent a password reset link to <br />
                <span className="font-medium text-foreground">{email}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {`Didn't receive the email? `}
                <button
                  onClick={handleSubmit}
                  className="font-medium text-primary hover:underline"
                >
                  Click to resend
                </button>
              </p>
              <Link
                href="/login"
                className="inline-flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to login</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

