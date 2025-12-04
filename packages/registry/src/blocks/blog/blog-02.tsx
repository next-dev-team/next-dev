import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';

export function Blog02() {
  return (
    <View className="w-full max-w-5xl px-4 py-12">
      <View className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <View className="h-48 bg-muted items-center justify-center">
                <Text className="text-muted-foreground">Cover Image</Text>
            </View>
            <CardHeader>
              <CardTitle className="leading-normal">Designing for Accessibility in 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-muted-foreground">
                Tips and tricks for building inclusive applications.
              </Text>
            </CardContent>
          </Card>
        ))}
      </View>
    </View>
  );
}