import * as React from 'react';
import { View } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Card, CardContent } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Checkout05() {
  return (
    <View className="w-full min-h-[400px] items-center justify-center p-4">
      <Card className="w-full max-w-md items-center p-8 text-center">
        <Icon as={CheckCircle} size={64} className="text-green-500 mb-6" />
        <Text className="text-2xl font-bold mb-2">Order Confirmed!</Text>
        <Text className="text-muted-foreground mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </Text>
        <View className="bg-muted p-4 rounded-md w-full mb-6">
          <Text className="text-sm text-muted-foreground mb-1">Order Number</Text>
          <Text className="font-mono font-bold">#ORD-12345-XYZ</Text>
        </View>
        <Button className="w-full">
          <Text>Continue Shopping</Text>
        </Button>
      </Card>
    </View>
  );
}
