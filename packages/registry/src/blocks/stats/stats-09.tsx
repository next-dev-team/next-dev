import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';

export function Stats09() {
  return (
    <View className="w-full max-w-4xl px-4 py-12">
      <View className="grid md:grid-cols-2 gap-12">
        <View className="gap-2">
          <Text className="text-5xl font-bold text-primary">40%</Text>
          <Text className="text-xl font-semibold">Efficiency Boost</Text>
          <Text className="text-muted-foreground">
            Companies see an average of 40% increase in productivity after switching to our platform.
          </Text>
        </View>
        <View className="gap-2">
          <Text className="text-5xl font-bold text-primary">2x</Text>
          <Text className="text-xl font-semibold">Faster Deployment</Text>
          <Text className="text-muted-foreground">
            Deploy your applications twice as fast with our automated pipelines and tooling.
          </Text>
        </View>
      </View>
    </View>
  );
}