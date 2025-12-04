import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Text } from '@/registry/new-york/components/ui/text';

export function Otp02() {
  // In a real app, you'd manage focus between these inputs
  return (
    <View className="mx-auto w-full max-w-sm gap-6 p-6">
      <View className="items-center gap-2">
        <Text className="text-2xl font-bold">Verification Code</Text>
        <Text className="text-muted-foreground text-center">
          Enter the 4-digit code sent to your phone.
        </Text>
      </View>

      <View className="flex-row justify-center gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Input
            key={i}
            className="h-14 w-14 text-center text-xl font-bold"
            keyboardType="number-pad"
            maxLength={1}
          />
        ))}
      </View>

      <Button className="w-full">
        <Text>Verify Code</Text>
      </Button>
    </View>
  );
}
