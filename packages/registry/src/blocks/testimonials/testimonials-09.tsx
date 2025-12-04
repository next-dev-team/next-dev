import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';

export function Testimonials09() {
  return (
    <View className="w-full max-w-4xl px-4 py-12">
      <View className="grid md:grid-cols-3 border-t border-l">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} className="p-6 border-r border-b gap-4">
            <Text className="text-sm leading-relaxed">
              "The API is intuitive and the performance is outstanding. Definitely a game changer for us."
            </Text>
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 bg-muted rounded-full" />
              <Text className="text-xs font-bold">User {i}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}