import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Separator } from '@/registry/new-york/components/ui/separator';
import { Checkbox } from '@/registry/new-york/components/ui/checkbox';
import { ProductCard04 } from '../ecommerce-product-card/product-card-04';

export function ProductList05() {
  return (
    <View className="w-full flex-row gap-8 p-4">
      {/* Sidebar Filters */}
      <View className="hidden w-64 space-y-6 md:flex">
        <View>
          <Text className="mb-4 font-semibold">Categories</Text>
          <View className="space-y-2">
            <View className="flex-row items-center gap-2">
              <Checkbox checked />
              <Text>All</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Checkbox />
              <Text>Clothing</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Checkbox />
              <Text>Accessories</Text>
            </View>
          </View>
        </View>
        <Separator />
        <View>
          <Text className="mb-4 font-semibold">Price Range</Text>
          <View className="space-y-2">
            <View className="flex-row items-center gap-2">
              <Checkbox />
              <Text>Under $50</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Checkbox />
              <Text>$50 - $100</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Checkbox />
              <Text>$100+</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Product Grid */}
      <View className="flex-1">
        <View className="flex-row flex-wrap gap-4">
          <View className="w-full sm:w-[48%] lg:w-[31%]">
            <ProductCard04 />
          </View>
          <View className="w-full sm:w-[48%] lg:w-[31%]">
            <ProductCard04 />
          </View>
          <View className="w-full sm:w-[48%] lg:w-[31%]">
            <ProductCard04 />
          </View>
          <View className="w-full sm:w-[48%] lg:w-[31%]">
            <ProductCard04 />
          </View>
          <View className="w-full sm:w-[48%] lg:w-[31%]">
            <ProductCard04 />
          </View>
        </View>
      </View>
    </View>
  );
}
