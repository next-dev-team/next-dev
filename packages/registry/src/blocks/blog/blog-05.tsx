import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';

export function Blog05() {
  return (
    <View className="w-full max-w-3xl px-4 py-12">
      <Text className="text-2xl font-bold mb-8">Archive</Text>
      <View className="gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} className="flex-row justify-between items-baseline border-b pb-4 border-border/50">
            <Text className="font-medium text-lg hover:underline">Update v2.0 Release Notes</Text>
            <Text className="text-muted-foreground text-sm">Jan {i}, 2024</Text>
          </View>
        ))}
      </View>
    </View>
  );
}