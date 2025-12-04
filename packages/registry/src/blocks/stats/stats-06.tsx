import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';

export function Stats06() {
  return (
    <View className="w-full px-4 py-24 text-center">
      <Text className="text-8xl font-black text-primary mb-4">1M+</Text>
      <Text className="text-2xl font-medium text-muted-foreground">
        Lines of code written by our AI assistant.
      </Text>
    </View>
  );
}