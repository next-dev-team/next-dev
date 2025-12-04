import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Timer } from 'lucide-react-native';

export function Otp03() {
  return (
    <View className="w-full max-w-sm mx-auto p-6 gap-6 items-center">
      <View className="h-12 w-12 rounded-full bg-muted items-center justify-center">
        <Icon as={Timer} size={24} className="text-foreground" />
      </View>
      <View className="items-center gap-2">
        <Text className="text-xl font-bold">Check your email</Text>
        <Text className="text-muted-foreground text-center">
          We sent a verification code to user@example.com
        </Text>
      </View>
      
      <Input 
        className="text-center text-2xl tracking-[1em] font-mono h-14" 
        placeholder="000000"
        keyboardType="number-pad" 
        maxLength={6}
      />

      <View className="items-center gap-4 w-full">
        <Button className="w-full">
            <Text>Verify</Text>
        </Button>
        <Text className="text-sm text-muted-foreground">
            Resend code in <Text className="text-primary font-medium">00:59</Text>
        </Text>
      </View>
    </View>
  );
}
