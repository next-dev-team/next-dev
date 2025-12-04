import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card } from '@/registry/new-york/components/ui/card';

export function Blog09() {
  return (
    <View className="w-full max-w-4xl px-4 py-12 gap-6">
      {[1, 2].map((i) => (
        <Card key={i} className="flex-col md:flex-row overflow-hidden">
          <View className="h-48 md:h-auto md:w-64 bg-muted shrink-0" />
          <View className="p-6 gap-2">
            <Text className="text-sm text-primary font-bold uppercase tracking-wider">News</Text>
            <Text className="text-2xl font-bold">Company reaches 1M users</Text>
            <Text className="text-muted-foreground">
              We are thrilled to announce that we have reached a major milestone.
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
}