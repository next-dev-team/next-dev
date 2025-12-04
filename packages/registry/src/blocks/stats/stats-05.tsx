import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';

export function Stats05() {
  return (
    <View className="w-full bg-primary px-4 py-16 text-primary-foreground">
      <View className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-primary-foreground/20">
        {[
            { label: 'Uptime', value: '99.99%' },
            { label: 'Support', value: '24/7' },
            { label: 'SLA', value: '1hr' }
        ].map((stat, i) => (
           <View key={i} className="pt-8 md:pt-0">
             <Text className="text-5xl font-bold text-primary-foreground mb-2">{stat.value}</Text>
             <Text className="text-primary-foreground/70 font-medium uppercase tracking-wider">{stat.label}</Text>
           </View>
        ))}
      </View>
    </View>
  );
}