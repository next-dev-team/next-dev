'use client';

import { Minus, Plus } from 'lucide-react';
import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';

export default function Page() {
  const [count, setCount] = React.useState(0);

  return (
    <View className="bg-background flex-1 items-center justify-center gap-6 p-8">
      <Text className="text-4xl font-bold">Counter App</Text>

      <View className="flex-row items-center gap-8">
        <Button
          variant="destructive"
          size="icon"
          onPress={() => setCount(count - 1)}
          className="rounded-full"
        >
          <Minus className="h-4 w-4 text-white" />
        </Button>

        <Text className="min-w-[120px] text-center font-mono text-6xl font-medium tabular-nums">
          {count}
        </Text>

        <Button
          variant="outline"
          size="icon"
          onPress={() => setCount(count + 1)}
          className="rounded-full"
        >
          <Plus className="text-foreground h-4 w-4" />
        </Button>
      </View>

      <Text className="text-muted-foreground max-w-md text-center">
        This counter uses @rnr/registry components (Button, Text) sharing code between Web and
        Native.
      </Text>
    </View>
  );
}
