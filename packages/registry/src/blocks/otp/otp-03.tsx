import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Timer } from 'lucide-react-native';

export function Otp03() {
  return (
    <View className="mx-auto w-full max-w-sm items-center gap-6 p-6">
      <View className="bg-muted h-12 w-12 items-center justify-center rounded-full">
        <Icon as={Timer} size={24} className="text-foreground" />
      </View>
      <View className="items-center gap-2">
        <Text className="text-xl font-bold">Check your email</Text>
        <Text className="text-muted-foreground text-center">
          We sent a verification code to user@example.com
        </Text>
      </View>

      <Input
        className="h-14 text-center font-mono text-2xl tracking-[1em]"
        placeholder="000000"
        keyboardType="number-pad"
        maxLength={6}
      />

      <View className="w-full items-center gap-4">
        <Button className="w-full">
          <Text>Verify</Text>
        </Button>
        <Text className="text-muted-foreground text-sm">
          Resend code in <Text className="text-primary font-medium">00:59</Text>
        </Text>
      </View>
    </View>
  );
}
