import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { ProductCard03 } from '../ecommerce-product-card/product-card-03';

export function ProductList02() {
  return (
    <View className="w-full p-4 max-w-3xl mx-auto">
      <Text className="text-2xl font-bold mb-6">Trending Products</Text>
      <View className="gap-4">
        <ProductCard03 />
        <ProductCard03 />
        <ProductCard03 />
      </View>
    </View>
  );
}
