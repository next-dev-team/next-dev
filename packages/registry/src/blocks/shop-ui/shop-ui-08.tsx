import * as React from 'react';
import { View } from 'react-native';
import { X } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function ShopUi08() {
  return (
    <View className="bg-primary px-4 py-3 flex-row items-center justify-between w-full">
        <View className="flex-1" />
        <View className="flex-row items-center gap-2">
            <Text className="text-primary-foreground font-medium text-center">
                Summer Sale! Up to 50% off selected items.
            </Text>
            <Button variant="link" size="sm" className="h-auto p-0">
                <Text className="text-white underline font-bold">Shop Now</Text>
            </Button>
        </View>
        <View className="flex-1 items-end">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20">
                <Icon as={X} size={14} className="text-primary-foreground" />
            </Button>
        </View>
    </View>
  );
}