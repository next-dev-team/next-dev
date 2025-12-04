import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Button } from '@/registry/new-york/components/ui/button';

export function Blog01() {
  return (
    <View className="w-full max-w-3xl px-4 py-12 gap-8">
      <View className="gap-2">
        <Text className="text-3xl font-bold">Latest Articles</Text>
        <Text className="text-muted-foreground">Insights from our team.</Text>
      </View>
      <View className="gap-8">
        {[1, 2, 3].map((i) => (
          <View key={i} className="gap-2 border-b pb-8">
            <Text className="text-sm text-muted-foreground">March 15, 2024</Text>
            <Text className="text-xl font-bold">The Future of React Native</Text>
            <Text className="text-muted-foreground leading-relaxed">
              Explore the new features coming to the platform and how they will impact your development workflow.
            </Text>
            <Button variant="link" className="self-start px-0">
              <Text>Read more</Text>
            </Button>
          </View>
        ))}
      </View>
    </View>
  );
}