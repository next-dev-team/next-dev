import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Badge } from '@/registry/new-york/components/ui/badge';

export function Features07() {
  return (
    <View className="w-full max-w-4xl gap-8 px-4 py-12">
      <View className="gap-2">
        <Badge className="self-start">
            <Text>New</Text>
        </Badge>
        <Text className="text-3xl font-bold">Advanced Capabilities</Text>
      </View>
      <View className="grid gap-6 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <View key={i} className="p-4 border rounded-xl gap-2">
             <Badge variant="outline" className="self-start">
                <Text>Pro</Text>
             </Badge>
             <Text className="text-lg font-semibold">Advanced Feature {i}</Text>
             <Text className="text-muted-foreground">Unlocked for pro users only.</Text>
          </View>
        ))}
      </View>
    </View>
  );
}