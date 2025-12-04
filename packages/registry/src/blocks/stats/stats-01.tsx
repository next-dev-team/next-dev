import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';

export function Stats01() {
  return (
    <View className="w-full max-w-5xl px-4 py-12">
      <View className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
            { label: 'Users', value: '10K+' },
            { label: 'Revenue', value: '$2M' },
            { label: 'Countries', value: '50+' },
            { label: 'Employees', value: '100+' }
        ].map((stat, i) => (
          <View key={i} className="gap-2">
            <Text className="text-4xl font-bold">{stat.value}</Text>
            <Text className="text-muted-foreground uppercase tracking-wide text-sm">{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}