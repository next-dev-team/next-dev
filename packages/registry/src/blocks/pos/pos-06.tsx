import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';

export function Pos06() {
  return (
    <View className="flex-row gap-2 w-full max-w-md">
        <Button className="flex-1 bg-green-600"><Text className="text-white">Pay</Text></Button>
        <Button variant="outline" className="flex-1"><Text>Hold</Text></Button>
        <Button variant="secondary" className="flex-1"><Text>Discount</Text></Button>
    </View>
  );
}