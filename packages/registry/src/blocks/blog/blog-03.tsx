import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Badge } from '@/registry/new-york/components/ui/badge';

export function Blog03() {
  return (
    <View className="w-full max-w-5xl px-4 py-12 grid md:grid-cols-2 gap-12">
      <View className="gap-4">
        <View className="h-64 bg-muted rounded-xl items-center justify-center">
            <Text className="text-muted-foreground">Featured Image</Text>
        </View>
        <Badge className="self-start">
            <Text>Featured</Text>
        </Badge>
        <Text className="text-3xl font-bold">Understanding Server Components</Text>
        <Text className="text-muted-foreground text-lg">
            A deep dive into the architecture and benefits of RSC.
        </Text>
      </View>
      <View className="gap-6">
        {[1, 2, 3].map((i) => (
          <View key={i} className="flex-row gap-4">
             <View className="w-24 h-24 bg-muted rounded-lg items-center justify-center">
                <Text className="text-xs text-muted-foreground">Image</Text>
             </View>
             <View className="flex-1 gap-2">
                <Text className="font-semibold text-lg">Quick Tip: Performance</Text>
                <Text className="text-muted-foreground text-sm line-clamp-2">
                    Optimize your bundle size with these simple steps.
                </Text>
             </View>
          </View>
        ))}
      </View>
    </View>
  );
}