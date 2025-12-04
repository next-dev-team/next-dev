import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Badge } from '@/registry/new-york/components/ui/badge';

export function Blog06() {
  return (
    <View className="w-full max-w-4xl mx-auto px-4 py-16 text-center gap-6">
      <View className="flex-row justify-center gap-2">
        <Badge variant="secondary">
            <Text>Engineering</Text>
        </Badge>
         <Badge variant="secondary">
            <Text>Product</Text>
        </Badge>
      </View>
      <Text className="text-4xl md:text-6xl font-bold tracking-tighter">
        The Engineering Blog
      </Text>
      <Text className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Stories about how we build, scale, and improve our products.
      </Text>
    </View>
  );
}