import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Separator } from '@/registry/new-york/components/ui/separator';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Cart04() {
  return (
    <View className="w-full max-w-sm h-[600px] border border-border bg-background shadow-lg flex-col">
      <View className="p-4 flex-row items-center justify-between border-b border-border">
        <Text className="font-bold text-lg">Shopping Cart (3)</Text>
        <Button variant="ghost" size="icon">
          <Icon as={X} size={20} />
        </Button>
      </View>
      
      <ScrollView className="flex-1 p-4">
        <View className="space-y-6">
          {[1, 2, 3].map((item) => (
            <View key={item} className="flex-row gap-4">
              <View className="w-20 h-20 bg-muted rounded" />
              <View className="flex-1 justify-center">
                <Text className="font-medium">Product {item}</Text>
                <Text className="text-sm text-muted-foreground">Qty: 1</Text>
                <Text className="font-bold mt-1">$45.00</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View className="p-4 border-t border-border bg-muted/10">
        <View className="flex-row justify-between mb-4">
          <Text className="font-medium">Subtotal</Text>
          <Text className="font-bold">$135.00</Text>
        </View>
        <Button className="w-full mb-2">
          <Text>Checkout</Text>
        </Button>
        <Button variant="outline" className="w-full">
          <Text>View Cart</Text>
        </Button>
      </View>
    </View>
  );
}
