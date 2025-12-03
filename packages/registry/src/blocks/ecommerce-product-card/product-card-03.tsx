import * as React from 'react';
import { View } from 'react-native';
import { Heart, ShoppingBag } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import {
  Card,
  CardContent,
} from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function ProductCard03() {
  return (
    <Card className="w-full max-w-lg overflow-hidden flex-row">
      <View className="w-1/3 bg-muted items-center justify-center h-full min-h-[150px]">
        <Text className="text-muted-foreground text-sm">Image</Text>
      </View>
      <View className="flex-1 p-4 justify-between">
        <View>
          <View className="flex-row justify-between items-start">
            <Text className="text-lg font-semibold">Wireless Headphones</Text>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icon as={Heart} size={16} />
            </Button>
          </View>
          <Text className="text-sm text-muted-foreground mt-1">High fidelity sound</Text>
        </View>
        
        <View className="flex-row justify-between items-end mt-4">
          <Text className="text-xl font-bold">$199.00</Text>
          <Button size="sm" className="gap-2">
            <Icon as={ShoppingBag} size={14} className="text-primary-foreground" />
            <Text>Add</Text>
          </Button>
        </View>
      </View>
    </Card>
  );
}
