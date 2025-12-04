import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';

export function Testimonials10() {
  return (
    <View className="w-full bg-primary px-4 py-16">
      <View className="max-w-3xl mx-auto text-center gap-8">
        <Text className="text-2xl md:text-4xl font-bold text-primary-foreground leading-tight">
          "This platform completely transformed how we work. The efficiency gains are undeniable."
        </Text>
        <View>
          <Text className="text-primary-foreground font-bold text-lg">Alex Morgan</Text>
          <Text className="text-primary-foreground/80">CEO, Innovation Labs</Text>
        </View>
      </View>
    </View>
  );
}