import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Button } from '@/registry/new-york/components/ui/button';
import { ProductCard01 } from '../ecommerce-product-card/product-card-01';

export function ProductList03() {
  return (
    <View className="w-full p-4">
      <View className="bg-muted rounded-lg p-8 mb-8 flex-col md:flex-row items-center gap-8">
        <View className="flex-1">
          <Text className="text-3xl font-bold mb-4">Summer Collection</Text>
          <Text className="text-muted-foreground mb-6">Discover our new summer styles with premium comfort.</Text>
          <Button>
            <Text>Shop Collection</Text>
          </Button>
        </View>
        <View className="w-full md:w-1/3 h-64 bg-card rounded-md items-center justify-center border border-border">
           <Text className="text-muted-foreground">Featured Image</Text>
        </View>
      </View>
      
      <Text className="text-xl font-semibold mb-4">Popular Items</Text>
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
