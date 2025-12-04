import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';

export function Blog07() {
  return (
    <View className="w-full max-w-5xl px-4 py-12 gap-8">
      <Text className="text-2xl font-bold">Related Articles</Text>
      <View className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-muted/20 border-none shadow-none">
            <CardHeader>
              <Text className="text-sm text-primary font-medium mb-2">Tutorial</Text>
              <CardTitle className="text-lg">Getting started with React Native</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </View>
    </View>
  );
}