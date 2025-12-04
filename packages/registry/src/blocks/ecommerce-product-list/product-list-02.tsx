import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { ProductCard03 } from '../ecommerce-product-card/product-card-03';

export function ProductList02() {
  return (
    <View className="mx-auto w-full max-w-3xl p-4">
      <Text className="mb-6 text-2xl font-bold">Trending Products</Text>
      <View className="gap-4">
        <ProductCard03 />
        <ProductCard03 />
        <ProductCard03 />
      </View>
    </View>
  );
}
