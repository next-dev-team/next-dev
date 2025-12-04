import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Separator } from '@/registry/new-york/components/ui/separator';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Cart04() {
  return (
    <View className="border-border bg-background h-[600px] w-full max-w-sm flex-col border shadow-lg">
      <View className="border-border flex-row items-center justify-between border-b p-4">
        <Text className="text-lg font-bold">Shopping Cart (3)</Text>
        <Button variant="ghost" size="icon">
          <Icon as={X} size={20} />
        </Button>
      </View>

      <ScrollView className="flex-1 p-4">
        <View className="space-y-6">
          {[1, 2, 3].map((item) => (
            <View key={item} className="flex-row gap-4">
              <View className="bg-muted h-20 w-20 rounded" />
              <View className="flex-1 justify-center">
                <Text className="font-medium">Product {item}</Text>
                <Text className="text-muted-foreground text-sm">Qty: 1</Text>
                <Text className="mt-1 font-bold">$45.00</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="border-border bg-muted/10 border-t p-4">
        <View className="mb-4 flex-row justify-between">
          <Text className="font-medium">Subtotal</Text>
          <Text className="font-bold">$135.00</Text>
        </View>
        <Button className="mb-2 w-full">
          <Text>Checkout</Text>
        </Button>
        <Button variant="outline" className="w-full">
          <Text>View Cart</Text>
        </Button>
      </View>
    </View>
  );
}
