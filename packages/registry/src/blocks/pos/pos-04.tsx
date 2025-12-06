import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Separator } from '@/registry/new-york/components/ui/separator';

export function Pos04() {
  return (
    <View className="p-4 bg-card border rounded-lg w-full max-w-sm">
      <View className="flex-row justify-between mb-2">
        <Text className="text-muted-foreground">Subtotal</Text>
        <Text>$24.50</Text>
      </View>
      <View className="flex-row justify-between mb-2">
        <Text className="text-muted-foreground">Tax (10%)</Text>
        <Text>$2.45</Text>
      </View>
      <View className="flex-row justify-between mb-4">
        <Text className="text-muted-foreground">Discount</Text>
        <Text className="text-green-600">-$0.00</Text>
      </View>
      
      <Separator className="mb-4" />
      
      <View className="flex-row justify-between mb-6">
        <Text className="text-xl font-bold">Total</Text>
        <Text className="text-xl font-bold">$26.95</Text>
      </View>

      <Button size="lg" className="w-full">
        <Text className="font-semibold">Proceed to Payment</Text>
      </Button>
    </View>
  );
}