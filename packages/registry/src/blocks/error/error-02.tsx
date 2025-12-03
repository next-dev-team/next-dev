import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { ServerCrash } from 'lucide-react-native';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Error02() {
  return (
    <View className="w-full max-w-md items-center gap-6 px-4 py-12 text-center">
      <View className="bg-muted h-24 w-24 items-center justify-center rounded-full">
        <Icon as={ServerCrash} size={48} className="text-muted-foreground" />
      </View>
      <View className="gap-2">
        <Text className="text-2xl font-bold tracking-tight">Internal Server Error</Text>
        <Text className="text-muted-foreground text-lg">
          Something went wrong on our end. Please try again later.
        </Text>
      </View>
      <View className="flex-row gap-4">
        <Button variant="outline">
            <Text>Contact Support</Text>
        </Button>
        <Button>
            <Text>Refresh Page</Text>
        </Button>
      </View>
    </View>
  );
}
