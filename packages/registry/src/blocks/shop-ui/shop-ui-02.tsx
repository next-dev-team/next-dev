import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Checkbox } from '@/registry/new-york/components/ui/checkbox';
import { Label } from '@/registry/new-york/components/ui/label';
import { Separator } from '@/registry/new-york/components/ui/separator';

export function ShopUi02() {
  return (
    <View className="w-64 p-4 border-r bg-background">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold">Filters</Text>
        <Button variant="link" size="sm">
            <Text>Clear all</Text>
        </Button>
      </View>
      
      <Separator className="mb-4" />
      
      <View className="gap-4">
        <Text className="font-semibold">Category</Text>
        <View className="gap-2">
            <View className="flex-row items-center gap-2">
                <Checkbox id="cat-1" />
                <Label nativeID="cat-1" onPress={() => {}}>Men</Label>
            </View>
            <View className="flex-row items-center gap-2">
                <Checkbox id="cat-2" checked />
                <Label nativeID="cat-2" onPress={() => {}}>Women</Label>
            </View>
            <View className="flex-row items-center gap-2">
                <Checkbox id="cat-3" />
                <Label nativeID="cat-3" onPress={() => {}}>Kids</Label>
            </View>
        </View>
      </View>

      <Separator className="my-4" />

      <View className="gap-4">
        <Text className="font-semibold">Price Range</Text>
        <View className="gap-2">
            <View className="flex-row items-center gap-2">
                <Checkbox id="price-1" />
                <Label nativeID="price-1" onPress={() => {}}>$0 - $50</Label>
            </View>
            <View className="flex-row items-center gap-2">
                <Checkbox id="price-2" />
                <Label nativeID="price-2" onPress={() => {}}>$50 - $100</Label>
            </View>
            <View className="flex-row items-center gap-2">
                <Checkbox id="price-3" />
                <Label nativeID="price-3" onPress={() => {}}>$100+</Label>
            </View>
        </View>
      </View>
    </View>
  );
}