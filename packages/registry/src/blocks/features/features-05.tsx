import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Button } from '@/registry/new-york/components/ui/button';

export function Features05() {
  return (
    <View className="w-full max-w-5xl gap-12 px-4 py-12">
      <View className="flex-col-reverse items-center gap-8 md:flex-row">
        <View className="flex-1 gap-4">
          <Text className="text-3xl font-bold">Another Great Feature</Text>
          <Text className="text-muted-foreground text-lg">
            This feature helps you achieve more in less time. It is integrated seamlessly.
          </Text>
          <Button variant="outline" className="self-start">
            <Text>Details</Text>
          </Button>
        </View>
        <View className="bg-muted h-64 flex-1 items-center justify-center rounded-xl">
          <Text className="text-muted-foreground">Image</Text>
        </View>
      </View>
    </View>
  );
}
