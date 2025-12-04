import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';

export function Cta03() {
  return (
    <View className="mx-auto w-full max-w-5xl p-8">
      <View className="bg-muted/50 border-border flex-col items-center justify-between gap-8 rounded-2xl border p-10 md:flex-row">
        <View className="flex-1 items-start gap-2">
          <Text className="text-2xl font-bold sm:text-3xl">Start your free trial</Text>
          <Text className="text-muted-foreground text-lg">
            No credit card required. Cancel anytime.
          </Text>
        </View>
        <View className="flex-row gap-4">
          <Button size="lg">
            <Text>Get Started</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
