import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Separator } from '@/registry/new-york/components/ui/separator';

export function Cart02() {
  return (
    <View className="w-full max-w-6xl mx-auto p-4 flex-col lg:flex-row gap-8">
      <View className="flex-1">
        <Text className="text-2xl font-bold mb-6">Shopping Cart</Text>
        <View className="space-y-6">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="flex-row p-4 gap-4">
              <View className="w-24 h-24 bg-muted rounded" />
              <View className="flex-1 justify-between py-1">
                <View>
                  <Text className="font-semibold text-lg">Premium Product {item}</Text>
                  <Text className="text-muted-foreground">Color: Black | Size: M</Text>
                </View>
                <View className="flex-row justify-between items-center">
                   <Text className="font-medium">$120.00</Text>
                   <Text className="text-sm text-primary">Edit</Text>
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
              <Text className="font-bold text-lg">Total</Text>
              <Text className="font-bold text-lg">$411.00</Text>
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
