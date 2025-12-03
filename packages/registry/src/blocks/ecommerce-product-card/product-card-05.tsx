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
      <View className="h-56 w-full bg-muted items-center justify-center">
        <Text className="text-muted-foreground">Product Image</Text>
      </View>
      <CardHeader>
        <CardTitle className="text-lg">Running Shoes</CardTitle>
        <Text className="text-sm text-muted-foreground">Performance running gear</Text>
      </CardHeader>
      <CardContent>
        <View className="space-y-3">
          <View>
            <Text className="text-xs font-medium mb-2">Colors</Text>
            <View className="flex-row gap-2">
              <View className="w-6 h-6 rounded-full bg-black border border-primary" />
              <View className="w-6 h-6 rounded-full bg-blue-500" />
              <View className="w-6 h-6 rounded-full bg-red-500" />
            </View>
          </View>
          <View>
            <Text className="text-xs font-medium mb-2">Size</Text>
            <View className="flex-row gap-2">
              <View className="w-8 h-8 rounded border border-input items-center justify-center bg-background">
                <Text className="text-xs">8</Text>
              </View>
              <View className="w-8 h-8 rounded border border-primary bg-primary items-center justify-center">
                <Text className="text-xs text-primary-foreground">9</Text>
              </View>
              <View className="w-8 h-8 rounded border border-input items-center justify-center bg-background">
                <Text className="text-xs">10</Text>
              </View>
            </View>
          </View>
        </View>
      </CardContent>
      <CardFooter className="flex-row justify-between items-center">
        <Text className="text-xl font-bold">$125.00</Text>
        <Button>
          <Text>Add to Cart</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
