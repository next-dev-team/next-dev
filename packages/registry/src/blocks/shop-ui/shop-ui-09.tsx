import * as React from 'react';
import { View } from 'react-native';
import { ChevronRight, Home } from 'lucide-react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function ShopUi09() {
  return (
    <View className="flex-row items-center gap-2 p-4">
        <Icon as={Home} size={14} className="text-muted-foreground" />
        <Icon as={ChevronRight} size={14} className="text-muted-foreground" />
        <Text className="text-sm text-muted-foreground">Women</Text>
        <Icon as={ChevronRight} size={14} className="text-muted-foreground" />
        <Text className="text-sm text-muted-foreground">Shoes</Text>
        <Icon as={ChevronRight} size={14} className="text-muted-foreground" />
        <Text className="text-sm font-medium">Running Sneakers</Text>
    </View>
  );
}