import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';

export function Stats08() {
  return (
    <View className="w-full max-w-6xl px-4 py-12">
      <View className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <View key={i} className="bg-card p-6 rounded-xl border shadow-sm">
            <Text className="text-sm font-medium text-muted-foreground">Metric {i}</Text>
            <Text className="text-2xl font-bold mt-2">1,234</Text>
            <Text className="text-xs text-muted-foreground mt-1">Updated just now</Text>
          </View>
        ))}
      </View>
    </View>
  );
}