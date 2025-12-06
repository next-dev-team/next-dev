import * as React from 'react';
import { View } from 'react-native';
import { Separator } from '@/registry/new-york/components/ui/separator';
import { Text } from '@/registry/new-york/components/ui/text';

export function Pos09() {
  return (
    <View className="p-6 bg-white border rounded-sm w-64 shadow-sm">
        <Text className="text-center font-bold mb-4 text-xl text-black">Store Name</Text>
        <Text className="text-center text-sm text-muted-foreground mb-6">123 Main St, City</Text>
        
        <View className="flex-row justify-between mb-2">
            <Text className="text-black">Item A</Text>
            <Text className="text-black">$10.00</Text>
        </View>
        <View className="flex-row justify-between mb-4">
            <Text className="text-black">Item B</Text>
            <Text className="text-black">$5.00</Text>
        </View>
        
        <Separator className="mb-4 border-dashed" />
        
        <View className="flex-row justify-between mb-2">
            <Text className="font-bold text-black">Total</Text>
            <Text className="font-bold text-black">$15.00</Text>
        </View>
        
        <Text className="text-center text-xs text-muted-foreground mt-6">Thank you for shopping!</Text>
    </View>
  );
}