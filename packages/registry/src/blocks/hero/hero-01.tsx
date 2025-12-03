import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';

export function Hero01() {
  return (
    <View className="w-full max-w-md items-center gap-6 px-4 py-12 text-center">
      <View className="gap-2">
        <Text className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Build your next idea
        </Text>
        <Text className="text-muted-foreground text-lg">
          The faster way to build apps with React Native and Expo.
        </Text>
      </View>
      <View className="flex-row gap-4">
        <Button>
          <Text>Get Started</Text>
        </Button>
        <Button variant="outline">
          <Text>Learn More</Text>
        </Button>
      </View>
    </View>
  );
}
