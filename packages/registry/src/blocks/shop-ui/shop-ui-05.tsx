import * as React from 'react';
import { View } from 'react-native';
import { ShoppingCart, Trash2 } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Badge } from '@/registry/new-york/components/ui/badge';

export function ShopUi05() {
  return (
    <View className="flex-row items-center p-4 border rounded-lg bg-card">
      <View className="h-24 w-24 bg-muted rounded-md items-center justify-center mr-4">
        <Text className="text-muted-foreground">Img</Text>
      </View>
      
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
            <Text className="font-bold text-lg">Running Shoes</Text>
            <Text className="font-bold text-lg">$89.00</Text>
        </View>
        <Text className="text-muted-foreground">Size: 42 • Color: Black</Text>
        <Badge variant="secondary" className="self-start mt-1">
            <Text>In Stock</Text>
        </Badge>
      </View>

      <View className="flex-col gap-2 ml-4">
        <Button size="sm" className="w-32 flex-row gap-2">
            <Icon as={ShoppingCart} size={14} className="text-primary-foreground" />
            <Text>Add to Cart</Text>
        </Button>
        <Button variant="outline" size="sm" className="w-32 flex-row gap-2 border-destructive/50 hover:bg-destructive/10">
            <Icon as={Trash2} size={14} className="text-destructive" />
            <Text className="text-destructive">Remove</Text>
        </Button>
      </View>
    </View>
  );
}