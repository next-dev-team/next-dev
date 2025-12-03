import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';

export function Hero02() {
  return (
    <View className="w-full max-w-4xl gap-8 px-4 py-12 md:flex-row md:items-center">
      <View className="flex-1 gap-6">
        <View className="gap-2">
          <Text className="text-3xl font-bold tracking-tighter md:text-5xl">
            Master the art of development
          </Text>
          <Text className="text-muted-foreground text-lg">
            Everything you need to create stunning applications with ease and speed.
          </Text>
        </View>
        <View className="flex-row gap-4">
          <Button>
            <Text>Get Started</Text>
          </Button>
          <Button variant="ghost">
            <Text>View Demo</Text>
          </Button>
        </View>
      </View>
      <View className="bg-muted aspect-video flex-1 items-center justify-center rounded-xl">
        <Text className="text-muted-foreground">Image Placeholder</Text>
      </View>
    </View>
  );
}
