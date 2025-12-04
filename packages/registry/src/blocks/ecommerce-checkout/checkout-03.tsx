import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Separator } from '@/registry/new-york/components/ui/separator';

export function Checkout03() {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Review Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <View>
          <Text className="mb-2 font-semibold">Shipping Address</Text>
          <Text className="text-muted-foreground">John Doe</Text>
          <Text className="text-muted-foreground">123 Main St, New York, NY 10001</Text>
        </View>
        <Separator />
        <View>
          <Text className="mb-2 font-semibold">Payment Method</Text>
          <Text className="text-muted-foreground">Visa ending in 4242</Text>
        </View>
        <Separator />
        <View>
          <Text className="mb-2 font-semibold">Items</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">1 x Premium Jacket</Text>
              <Text>$120.00</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">2 x Basic Tee</Text>
              <Text>$50.00</Text>
            </View>
          </View>
        </View>
        <Separator />
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text>Subtotal</Text>
            <Text>$170.00</Text>
          </View>
          <View className="flex-row justify-between">
            <Text>Shipping</Text>
            <Text>$10.00</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-lg font-bold">Total</Text>
            <Text className="text-lg font-bold">$180.00</Text>
          </View>
        </View>

        <Button className="w-full">Place Order</Button>
      </CardContent>
    </Card>
  );
}
