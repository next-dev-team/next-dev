import * as React from 'react';
import { View } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Cart03() {
  return (
    <View className="h-[400px] w-full items-center justify-center p-4 text-center">
      <View className="bg-muted mb-6 h-20 w-20 items-center justify-center rounded-full">
        <Icon as={ShoppingCart} size={40} className="text-muted-foreground" />
      </View>
      <Text className="mb-2 text-2xl font-bold">Your cart is empty</Text>
      <Text className="text-muted-foreground mb-8 max-w-md text-center">
        Looks like you haven't added anything to your cart yet. Explore our products and find
        something you love.
      </Text>
      <Button>
        <Text>Start Shopping</Text>
      </Button>
    </View>
  );
}
