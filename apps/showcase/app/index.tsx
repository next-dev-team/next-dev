import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Button } from '@/registry/new-york/components/ui/button';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-6">
      <Text variant="h1">Hello World</Text>
      <Button onPress={() => console.log('Button pressed')}>
        <Text>Press Me</Text>
      </Button>
    </View>
  );
}
