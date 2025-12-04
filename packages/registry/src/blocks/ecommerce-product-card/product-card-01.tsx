import * as React from 'react';
import { View } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function ProductCard01() {
  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <View className="bg-muted h-48 w-full items-center justify-center">
        <Text className="text-muted-foreground text-lg">Product Image</Text>
      </View>
      <CardHeader>
        <CardTitle className="text-lg">Basic Tee</CardTitle>
        <Text className="text-muted-foreground text-sm">Classic cotton t-shirt</Text>
      </CardHeader>
      <CardContent>
        <Text className="text-xl font-bold">$25.00</Text>
      </CardContent>
      <CardFooter>
        <Button className="w-full flex-row items-center gap-2">
          <Icon as={ShoppingCart} size={16} className="text-primary-foreground" />
          <Text>Add to Cart</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
