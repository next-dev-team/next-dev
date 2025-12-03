import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Lock } from 'lucide-react-native';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Error04() {
  return (
    <View className="w-full max-w-md items-center gap-6 px-4 py-12 text-center">
       <View className="bg-destructive/10 h-24 w-24 items-center justify-center rounded-full">
        <Icon as={Lock} size={48} className="text-destructive" />
      </View>
      <View className="gap-2">
        <Text className="text-2xl font-bold tracking-tight">Access Denied</Text>
        <Text className="text-muted-foreground text-lg">
          You do not have permission to view this page.
        </Text>
      </View>
      <Button variant="secondary">
        <Text>Return to Dashboard</Text>
      </Button>
    </View>
  );
}
