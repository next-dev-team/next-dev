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

export function ProductCard05() {
  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <View className="bg-muted h-56 w-full items-center justify-center">
        <Text className="text-muted-foreground">Product Image</Text>
      </View>
      <CardHeader>
        <CardTitle className="text-lg">Running Shoes</CardTitle>
        <Text className="text-muted-foreground text-sm">Performance running gear</Text>
      </CardHeader>
      <CardContent>
        <View className="space-y-3">
          <View>
            <Text className="mb-2 text-xs font-medium">Colors</Text>
            <View className="flex-row gap-2">
              <View className="border-primary h-6 w-6 rounded-full border bg-black" />
              <View className="h-6 w-6 rounded-full bg-blue-500" />
              <View className="h-6 w-6 rounded-full bg-red-500" />
            </View>
          </View>
          <View>
            <Text className="mb-2 text-xs font-medium">Size</Text>
            <View className="flex-row gap-2">
              <View className="border-input bg-background h-8 w-8 items-center justify-center rounded border">
                <Text className="text-xs">8</Text>
              </View>
              <View className="border-primary bg-primary h-8 w-8 items-center justify-center rounded border">
                <Text className="text-primary-foreground text-xs">9</Text>
              </View>
              <View className="border-input bg-background h-8 w-8 items-center justify-center rounded border">
                <Text className="text-xs">10</Text>
              </View>
            </View>
          </View>
        </View>
      </CardContent>
      <CardFooter className="flex-row items-center justify-between">
        <Text className="text-xl font-bold">$125.00</Text>
        <Button>
          <Text>Add to Cart</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
