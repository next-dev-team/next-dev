import * as React from 'react';
import { View } from 'react-native';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

export function Stats04() {
  return (
    <View className="w-full max-w-4xl px-4 py-12">
      <View className="grid grid-cols-2 gap-8">
        <View className="gap-2">
            <Text className="text-muted-foreground">Sales</Text>
            <Text className="text-3xl font-bold">$12,345</Text>
            <View className="flex-row items-center gap-1 text-green-600">
                <Icon as={TrendingUp} size={16} className="text-green-600" />
                <Text className="text-sm text-green-600 font-medium">+12%</Text>
            </View>
        </View>
        <View className="gap-2">
            <Text className="text-muted-foreground">Churn</Text>
            <Text className="text-3xl font-bold">2.1%</Text>
             <View className="flex-row items-center gap-1 text-red-600">
                <Icon as={TrendingDown} size={16} className="text-red-600" />
                <Text className="text-sm text-red-600 font-medium">-1%</Text>
            </View>
        </View>
      </View>
    </View>
  );
}