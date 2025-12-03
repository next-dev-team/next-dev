import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Badge } from '@/registry/new-york/components/ui/badge';

export function Hero03() {
  return (
    <View className="w-full max-w-md items-center gap-6 px-4 py-12 text-center">
      <Badge variant="secondary" className="rounded-full">
        <Text>New version 2.0 released</Text>
      </Badge>
      <View className="gap-2">
        <Text className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Beautiful UI Components
        </Text>
        <Text className="text-muted-foreground text-lg">
          Accessible and customizable components that you can copy and paste into your apps.
        </Text>
      </View>
      <View className="flex-row gap-4">
        <Button>
          <Text>Documentation</Text>
        </Button>
      </View>
    </View>
  );
}
