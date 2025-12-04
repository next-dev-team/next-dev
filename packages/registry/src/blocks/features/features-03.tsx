import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardHeader, CardTitle, CardContent } from '@/registry/new-york/components/ui/card';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Star } from 'lucide-react-native';

export function Features03() {
  return (
    <View className="w-full max-w-4xl gap-6 px-4 py-12">
      <View className="flex-row flex-wrap gap-4 justify-center">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="w-full max-w-xs">
            <CardHeader>
              <Icon as={Star} className="text-primary mb-2" />
              <CardTitle>Feature {i}</CardTitle>
            </CardHeader>
            <CardContent>
              <Text className="text-muted-foreground">
                This is a detailed description of feature {i} that explains its value.
              </Text>
            </CardContent>
          </Card>
        ))}
      </View>
    </View>
  );
}