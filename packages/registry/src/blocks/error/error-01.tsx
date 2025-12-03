import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';

export function Error01() {
  return (
    <View className="w-full max-w-md items-center gap-6 px-4 py-12 text-center">
      <Text className="text-9xl font-bold text-primary">404</Text>
      <View className="gap-2">
        <Text className="text-2xl font-bold tracking-tight">Page not found</Text>
        <Text className="text-muted-foreground text-lg">
          The page you are looking for doesn't exist or has been moved.
        </Text>
      </View>
      <Button>
        <Text>Go Home</Text>
      </Button>
    </View>
  );
}
