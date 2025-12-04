import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { ArrowRight } from 'lucide-react-native';

export function Features08() {
  return (
    <View className="w-full max-w-md gap-4 px-4 py-12">
      <Text className="text-2xl font-bold mb-4">Checklist</Text>
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} className="flex-row items-center justify-between p-3 bg-muted/50 rounded-lg">
          <Text className="font-medium">Integration {i}</Text>
          <Icon as={ArrowRight} className="text-muted-foreground" size={16} />
        </View>
      ))}
    </View>
  );
}