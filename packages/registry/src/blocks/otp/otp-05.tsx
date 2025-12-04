import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Text } from '@/registry/new-york/components/ui/text';
import { ShieldCheck } from 'lucide-react-native';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Otp05() {
  return (
    <View className="mx-auto w-full max-w-sm items-center gap-8 p-4 text-center">
      <View className="bg-primary/10 h-20 w-20 items-center justify-center rounded-full">
        <Icon as={ShieldCheck} size={40} className="text-primary" />
      </View>

      <View className="gap-2">
        <Text className="text-center text-2xl font-bold">Secure Login</Text>
        <Text className="text-muted-foreground text-center">
          Please verify your identity by entering the code sent to +1 (555) ***-**99
        </Text>
      </View>

      <View className="w-full gap-4">
        <Input
          className="h-14 text-center text-2xl font-bold tracking-[8px]"
          placeholder="******"
          keyboardType="number-pad"
        />
        <Button size="lg" className="w-full">
          <Text>Verify Identity</Text>
        </Button>
        <Button variant="ghost" className="w-full">
          <Text>Use another method</Text>
        </Button>
      </View>
    </View>
  );
}
