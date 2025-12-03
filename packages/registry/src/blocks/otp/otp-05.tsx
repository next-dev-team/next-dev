import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Text } from '@/registry/new-york/components/ui/text';
import { ShieldCheck } from 'lucide-react-native';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Otp05() {
  return (
    <View className="w-full max-w-sm mx-auto p-4 items-center text-center gap-8">
      <View className="h-20 w-20 bg-primary/10 rounded-full items-center justify-center">
        <Icon as={ShieldCheck} size={40} className="text-primary" />
      </View>

      <View className="gap-2">
        <Text className="text-2xl font-bold text-center">Secure Login</Text>
        <Text className="text-muted-foreground text-center">
          Please verify your identity by entering the code sent to +1 (555) ***-**99
        </Text>
      </View>

      <View className="w-full gap-4">
        <Input 
            className="text-center text-2xl tracking-[8px] h-14 font-bold" 
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
