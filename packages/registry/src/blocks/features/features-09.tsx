import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Box, Layers, Layout } from 'lucide-react-native';

export function Features09() {
  return (
    <View className="w-full max-w-4xl px-4 py-12">
      <View className="border rounded-xl overflow-hidden">
        <View className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
           <View className="p-8 gap-4 items-center text-center">
             <Icon as={Box} size={40} className="text-primary" />
             <Text className="font-bold text-lg">Modular</Text>
             <Text className="text-muted-foreground">Everything is a component.</Text>
           </View>
           <View className="p-8 gap-4 items-center text-center">
             <Icon as={Layers} size={40} className="text-primary" />
             <Text className="font-bold text-lg">Stackable</Text>
             <Text className="text-muted-foreground">Build complex layouts easily.</Text>
           </View>
           <View className="p-8 gap-4 items-center text-center">
             <Icon as={Layout} size={40} className="text-primary" />
             <Text className="font-bold text-lg">Responsive</Text>
             <Text className="text-muted-foreground">Works on any screen size.</Text>
           </View>
        </View>
      </View>
    </View>
  );
}