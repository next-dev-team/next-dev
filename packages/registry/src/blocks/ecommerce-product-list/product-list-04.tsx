import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { ProductCard02 } from '../ecommerce-product-card/product-card-02';

export function ProductList04() {
  return (
    <View className="w-full py-8">
      <View className="mb-4 flex-row items-center justify-between px-4">
        <Text className="text-2xl font-bold">Flash Sale</Text>
        <Text className="text-primary">View All</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
        <View className="flex-row gap-4 pr-4">
          <View className="w-72">
            <ProductCard02 />
          </View>
          <View className="w-72">
            <ProductCard02 />
          </View>
          <View className="w-72">
            <ProductCard02 />
          </View>
          <View className="w-72">
            <ProductCard02 />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
