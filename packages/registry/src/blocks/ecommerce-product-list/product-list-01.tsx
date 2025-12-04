import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { ProductCard01 } from '../ecommerce-product-card/product-card-01';

export function ProductList01() {
  return (
    <View className="w-full p-4">
      <Text className="mb-6 text-2xl font-bold">New Arrivals</Text>
      <View className="flex-row flex-wrap justify-center gap-4 sm:justify-start">
        <View className="w-full sm:w-[48%] lg:w-[23%]">
          <ProductCard01 />
        </View>
        <View className="w-full sm:w-[48%] lg:w-[23%]">
          <ProductCard01 />
        </View>
        <View className="w-full sm:w-[48%] lg:w-[23%]">
          <ProductCard01 />
        </View>
        <View className="w-full sm:w-[48%] lg:w-[23%]">
          <ProductCard01 />
        </View>
      </View>
    </View>
  );
}
