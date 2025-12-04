import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { View } from 'react-native';
import React, { useState } from 'react';

export default function CounterScreen() {
  const [count, setCount] = useState(0);

  return (
    <View className="flex-1 justify-center items-center gap-4 bg-background p-4">
      <Text className="text-4xl font-bold text-foreground">Counter: {count}</Text>
      <View className="flex-row gap-4">
        <Button onPress={() => setCount(count - 1)} variant="outline">
          <Text>Decrement</Text>
        </Button>
        <Button onPress={() => setCount(count + 1)}>
          <Text>Increment</Text>
        </Button>
      </View>
    </View>
  );
}
