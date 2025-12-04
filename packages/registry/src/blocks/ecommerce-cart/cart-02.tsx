import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Separator } from '@/registry/new-york/components/ui/separator';

export function Cart02() {
  return (
    <View className="mx-auto w-full max-w-6xl flex-col gap-8 p-4 lg:flex-row">
      <View className="flex-1">
        <Text className="mb-6 text-2xl font-bold">Shopping Cart</Text>
        <View className="space-y-6">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="flex-row gap-4 p-4">
              <View className="bg-muted h-24 w-24 rounded" />
              <View className="flex-1 justify-between py-1">
                <View>
                  <Text className="text-lg font-semibold">Premium Product {item}</Text>
                  <Text className="text-muted-foreground">Color: Black | Size: M</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="font-medium">$120.00</Text>
                  <Text className="text-primary text-sm">Edit</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </View>

      <View className="w-full lg:w-80">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Subtotal</Text>
              <Text>$360.00</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Shipping</Text>
              <Text>$15.00</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-muted-foreground">Tax</Text>
              <Text>$36.00</Text>
            </View>
            <Separator />
            <View className="flex-row justify-between">
              <Text className="text-lg font-bold">Total</Text>
              <Text className="text-lg font-bold">$411.00</Text>
            </View>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Text>Proceed to Checkout</Text>
            </Button>
          </CardFooter>
        </Card>
      </View>
    </View>
  );
}
