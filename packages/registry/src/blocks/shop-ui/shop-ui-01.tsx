import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/components/ui/avatar';

export function ShopUi01() {
  const categories = [
    { name: 'New In', image: 'https://github.com/shadcn.png' },
    { name: 'Clothing', image: 'https://github.com/shadcn.png' },
    { name: 'Shoes', image: 'https://github.com/shadcn.png' },
    { name: 'Accessories', image: 'https://github.com/shadcn.png' },
    { name: 'Sale', image: 'https://github.com/shadcn.png' },
    { name: 'Collections', image: 'https://github.com/shadcn.png' },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full py-4">
      <View className="flex-row gap-6 px-4">
        {categories.map((cat, index) => (
          <View key={index} className="items-center gap-2">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage source={{ uri: cat.image }} />
              <AvatarFallback>{cat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Text className="text-sm font-medium text-center">{cat.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}