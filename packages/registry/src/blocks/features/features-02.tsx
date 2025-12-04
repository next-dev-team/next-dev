import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Zap, Shield, Smartphone } from 'lucide-react-native';

export function Features02() {
  const features = [
    { icon: Zap, title: 'Fast', description: 'Lightning fast performance.' },
    { icon: Shield, title: 'Secure', description: 'Bank-grade security.' },
    { icon: Smartphone, title: 'Mobile', description: 'Mobile-first design.' },
  ];

  return (
    <View className="w-full max-w-4xl gap-8 px-4 py-12">
      <View className="gap-2">
        <Text className="text-3xl font-bold">Why choose us?</Text>
      </View>
      <View className="flex-row flex-wrap gap-6">
        {features.map((f, i) => (
          <View key={i} className="flex-1 min-w-[250px] gap-2 p-4 border border-border rounded-lg">
            <Icon as={f.icon} className="text-primary mb-2" size={32} />
            <Text className="text-xl font-semibold">{f.title}</Text>
            <Text className="text-muted-foreground">{f.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
