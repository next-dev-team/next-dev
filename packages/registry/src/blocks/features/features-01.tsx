import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Check } from 'lucide-react-native';

export function Features01() {
  return (
    <View className="w-full max-w-4xl gap-6 px-4 py-12">
      <View className="gap-2 text-center">
        <Text className="text-3xl font-bold tracking-tighter">Key Features</Text>
        <Text className="text-muted-foreground text-lg">
          Everything you need to build your app.
        </Text>
      </View>
      <View className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} className="flex-row items-start gap-2">
            <Icon as={Check} className="text-primary mt-1" size={20} />
            <View>
              <Text className="font-medium">Feature {i}</Text>
              <Text className="text-muted-foreground text-sm">Description for feature {i}.</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
