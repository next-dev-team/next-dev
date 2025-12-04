import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Button } from '@/registry/new-york/components/ui/button';

export function Features04() {
  return (
    <View className="w-full max-w-5xl gap-12 px-4 py-12">
      <View className="flex-col md:flex-row gap-8 items-center">
        <View className="flex-1 h-64 bg-muted rounded-xl items-center justify-center">
            <Text className="text-muted-foreground">Image</Text>
        </View>
        <View className="flex-1 gap-4">
          <Text className="text-3xl font-bold">Feature Highlight</Text>
          <Text className="text-muted-foreground text-lg">
            Describe the main feature in detail here. It solves a specific problem for the user.
          </Text>
          <Button className="self-start">
            <Text>Learn More</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}