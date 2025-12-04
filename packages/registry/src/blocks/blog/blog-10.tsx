import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';

export function Blog10() {
  return (
    <View className="w-full max-w-3xl px-4 py-12 gap-8">
      <View className="border-l-2 border-primary pl-6">
         <Text className="text-4xl font-bold mb-4">Editor's Picks</Text>
         <Text className="text-muted-foreground text-lg">Curated articles for this week.</Text>
      </View>
      <View className="grid gap-6">
        {[1, 2, 3, 4].map((i) => (
          <View key={i} className="flex-row justify-between items-center border p-4 rounded-lg hover:bg-muted/50">
             <View className="gap-1">
               <Text className="font-bold">Deep Learning Basics</Text>
               <Text className="text-sm text-muted-foreground">By Alice • 2 days ago</Text>
             </View>
             <Text className="text-sm font-mono text-muted-foreground">5 min</Text>
          </View>
        ))}
      </View>
    </View>
  );
}