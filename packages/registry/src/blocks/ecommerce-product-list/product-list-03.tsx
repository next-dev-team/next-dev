import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Button } from '@/registry/new-york/components/ui/button';
import { ProductCard01 } from '../ecommerce-product-card/product-card-01';

export function ProductList03() {
  return (
    <View className="w-full p-4">
      <View className="bg-muted mb-8 flex-col items-center gap-8 rounded-lg p-8 md:flex-row">
        <View className="flex-1">
          <Text className="mb-4 text-3xl font-bold">Summer Collection</Text>
          <Text className="text-muted-foreground mb-6">
            Discover our new summer styles with premium comfort.
          </Text>
          <Button>
            <Text>Shop Collection</Text>
          </Button>
        </View>
        <View className="bg-card border-border h-64 w-full items-center justify-center rounded-md border md:w-1/3">
          <Text className="text-muted-foreground">Featured Image</Text>
        </View>
      </View>

      <Text className="mb-4 text-xl font-semibold">Popular Items</Text>
      <View className="flex-row flex-wrap gap-4">
        <View className="w-full sm:w-[48%] lg:w-[31%]">
          <ProductCard01 />
        </View>
        <View className="w-full sm:w-[48%] lg:w-[31%]">
          <ProductCard01 />
        </View>
        <View className="w-full sm:w-[48%] lg:w-[31%]">
          <ProductCard01 />
        </View>
      </View>
    </View>
  );
}
