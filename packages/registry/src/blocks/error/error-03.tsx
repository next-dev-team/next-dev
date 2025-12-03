import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Wrench } from 'lucide-react-native';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Error03() {
  return (
    <View className="w-full max-w-md items-center gap-6 px-4 py-12 text-center">
      <Icon as={Wrench} size={64} className="text-primary" />
      <View className="gap-2">
        <Text className="text-2xl font-bold tracking-tight">Under Maintenance</Text>
        <Text className="text-muted-foreground text-lg">
          We are currently performing scheduled maintenance. We should be back shortly.
        </Text>
      </View>
    </View>
  );
}
