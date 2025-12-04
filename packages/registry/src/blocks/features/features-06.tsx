import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Activity, Globe, Server } from 'lucide-react-native';

export function Features06() {
  return (
    <View className="w-full max-w-6xl px-4 py-12">
      <View className="grid gap-8 text-center md:grid-cols-3">
        <View className="items-center gap-3">
          <View className="bg-primary/10 rounded-full p-3">
            <Icon as={Activity} className="text-primary" size={32} />
          </View>
          <Text className="text-xl font-bold">Real-time</Text>
          <Text className="text-muted-foreground">Updates instantly across all devices.</Text>
        </View>
        <View className="items-center gap-3">
          <View className="bg-primary/10 rounded-full p-3">
            <Icon as={Globe} className="text-primary" size={32} />
          </View>
          <Text className="text-xl font-bold">Global</Text>
          <Text className="text-muted-foreground">Available in 100+ countries worldwide.</Text>
        </View>
        <View className="items-center gap-3">
          <View className="bg-primary/10 rounded-full p-3">
            <Icon as={Server} className="text-primary" size={32} />
          </View>
          <Text className="text-xl font-bold">Scalable</Text>
          <Text className="text-muted-foreground">Built to handle millions of requests.</Text>
        </View>
      </View>
    </View>
  );
}
