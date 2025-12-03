import * as React from 'react';
import { View } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Separator } from '@/registry/new-york/components/ui/separator';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Cart01() {
  return (
    <View className="w-full max-w-4xl mx-auto p-4">
      <Text className="text-2xl font-bold mb-6">Shopping Cart</Text>
      <View className="space-y-4">
        <View className="flex-row items-center justify-between pb-4">
          <Text className="font-semibold flex-1">Product</Text>
          <Text className="font-semibold w-24 text-center">Quantity</Text>
          <Text className="font-semibold w-24 text-right">Price</Text>
          <View className="w-10" />
        </View>
        <Separator />
        
        {[1, 2].map((item) => (
          <View key={item} className="flex-row items-center justify-between py-4">
            <View className="flex-1 flex-row gap-4">
              <View className="w-16 h-16 bg-muted rounded" />
              <View>
                <Text className="font-medium">Product Name {item}</Text>
                <Text className="text-sm text-muted-foreground">Variant: Blue</Text>
              </View>
            </View>
            <View className="w-24 items-center">
              <View className="border rounded px-3 py-1">
                <Text>1</Text>
              </View>
            </View>
            <Text className="w-24 text-right font-bold">$99.00</Text>
            <Button variant="ghost" size="icon" className="w-10">
              <Icon as={Trash2} size={16} className="text-destructive" />
            </Button>
          </View>
        ))}
        
        <Separator />
        <View className="flex-row justify-between items-center pt-4">
          <Text className="text-lg font-medium">Total</Text>
          <Text className="text-2xl font-bold">$198.00</Text>
        </View>
        <View className="items-end mt-4">
          <Button size="lg">
            <Text>Checkout</Text>
          </Button>
        </View>
      </View>
    </View>
  );
}
