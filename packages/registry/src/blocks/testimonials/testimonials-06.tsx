import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent } from '@/registry/new-york/components/ui/card';

export function Testimonials06() {
  return (
    <View className="w-full max-w-5xl px-4 py-12">
      <View className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="break-inside-avoid">
            <CardContent className="pt-6">
              <Text className="mb-4">"Short and sweet testimonial {i}."</Text>
              <Text className="font-semibold text-sm">- User {i}</Text>
            </CardContent>
          </Card>
        ))}
      </View>
    </View>
  );
}