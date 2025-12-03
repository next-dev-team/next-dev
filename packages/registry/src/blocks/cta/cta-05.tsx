import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { ArrowRight } from 'lucide-react-native';

export function Cta05() {
  return (
    <View className="mx-auto w-full max-w-4xl items-center px-6 py-24 text-center">
      <Text className="mb-8 text-4xl font-black tracking-tighter sm:text-6xl">BUILD FASTER.</Text>
      <Text className="text-muted-foreground mb-12 text-4xl font-black tracking-tighter sm:text-6xl">
        SCALE BETTER.
      </Text>
      <Button size="lg" className="h-14 rounded-full px-8">
        <Text className="text-lg">Start Building Now</Text>
        <Icon as={ArrowRight} className="text-primary-foreground ml-2" />
      </Button>
    </View>
  );
}
