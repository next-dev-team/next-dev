import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';

export function Cta03() {
  return (
    <View className="w-full max-w-5xl mx-auto p-8">
      <View className="flex-col md:flex-row items-center justify-between gap-8 bg-muted/50 p-10 rounded-2xl border border-border">
        <View className="flex-1 gap-2 items-start">
          <Text className="text-2xl font-bold sm:text-3xl">
            Start your free trial
          </Text>
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
