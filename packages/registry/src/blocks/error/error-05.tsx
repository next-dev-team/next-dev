import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { AlertCircle } from 'lucide-react-native';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Error05() {
  return (
    <View className="w-full max-w-md items-center gap-6 px-4 py-12 text-center border border-dashed rounded-lg">
      <Icon as={AlertCircle} size={48} className="text-muted-foreground" />
      <View className="gap-2">
        <Text className="text-xl font-bold tracking-tight">Something went wrong</Text>
        <Text className="text-muted-foreground">
          An error occurred while loading the data.
        </Text>
      </View>
      <Button size="sm">
        <Text>Try Again</Text>
      </Button>
    </View>
  );
}
