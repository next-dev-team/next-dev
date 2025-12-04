import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Text } from '@/registry/new-york/components/ui/text';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/registry/new-york/components/ui/card';

export function Otp01() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Enter OTP</CardTitle>
        <CardDescription>We sent a code to your email.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <View className="gap-2">
          <Input
            placeholder="Enter 6-digit code"
            keyboardType="number-pad"
            className="text-center text-lg tracking-widest"
            maxLength={6}
          />
        </View>
        <Button className="w-full">
          <Text>Verify</Text>
        </Button>
      </CardContent>
    </Card>
  );
}
