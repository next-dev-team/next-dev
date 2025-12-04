import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';

export function Cta01() {
  return (
    <View className="mx-auto w-full max-w-3xl items-center gap-6 p-12 text-center">
      <View className="gap-2">
        <Text className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Ready to get started?
        </Text>
        <Text className="text-muted-foreground mx-auto max-w-xl text-lg">
          Join thousands of developers building the next generation of apps.
        </Text>
      </View>
      <View className="flex-row gap-4">
        <Button size="lg">
          <Text>Get Started</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>Learn More</Text>
        </Button>
      </View>
    </View>
  );
}
