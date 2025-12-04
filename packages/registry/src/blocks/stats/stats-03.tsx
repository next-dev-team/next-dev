import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Users, Download, Star } from 'lucide-react-native';

export function Stats03() {
  return (
    <View className="w-full max-w-5xl px-4 py-12">
      <View className="grid md:grid-cols-3 gap-8">
        <View className="flex-row items-center gap-4 p-6 bg-muted/30 rounded-xl">
            <View className="p-3 bg-primary/10 rounded-full">
                <Icon as={Users} className="text-primary" size={24} />
            </View>
            <View>
                <Text className="text-2xl font-bold">2.5M</Text>
                <Text className="text-muted-foreground">Active Users</Text>
            </View>
        </View>
        <View className="flex-row items-center gap-4 p-6 bg-muted/30 rounded-xl">
            <View className="p-3 bg-primary/10 rounded-full">
                <Icon as={Download} className="text-primary" size={24} />
            </View>
             <View>
                <Text className="text-2xl font-bold">10M+</Text>
                <Text className="text-muted-foreground">Downloads</Text>
            </View>
        </View>
        <View className="flex-row items-center gap-4 p-6 bg-muted/30 rounded-xl">
            <View className="p-3 bg-primary/10 rounded-full">
                <Icon as={Star} className="text-primary" size={24} />
            </View>
             <View>
                <Text className="text-2xl font-bold">4.9</Text>
                <Text className="text-muted-foreground">App Rating</Text>
            </View>
        </View>
      </View>
    </View>
  );
}