import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';

export function Stats10() {
  return (
    <View className="w-full max-w-5xl px-4 py-12 flex-row justify-between items-center border-y">
      <View className="p-4 text-center flex-1 border-r last:border-r-0">
        <Text className="text-3xl font-bold">10k</Text>
        <Text className="text-sm text-muted-foreground">Stars</Text>
      </View>
      <View className="p-4 text-center flex-1 border-r last:border-r-0">
        <Text className="text-3xl font-bold">5k</Text>
        <Text className="text-sm text-muted-foreground">Forks</Text>
      </View>
      <View className="p-4 text-center flex-1">
        <Text className="text-3xl font-bold">100+</Text>
        <Text className="text-sm text-muted-foreground">Contributors</Text>
      </View>
    </View>
  );
}