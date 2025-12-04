import * as React from 'react';
import { View } from 'react-native';
import { Heart, ShoppingBag } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Card, CardContent } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function ProductCard03() {
  return (
    <Card className="w-full max-w-lg flex-row overflow-hidden">
      <View className="bg-muted h-full min-h-[150px] w-1/3 items-center justify-center">
        <Text className="text-muted-foreground text-sm">Image</Text>
      </View>
      <View className="flex-1 justify-between p-4">
        <View>
          <View className="flex-row items-start justify-between">
            <Text className="text-lg font-semibold">Wireless Headphones</Text>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Icon as={Heart} size={16} />
            </Button>
          </View>
          <Text className="text-muted-foreground mt-1 text-sm">High fidelity sound</Text>
        </View>

        <View className="mt-4 flex-row items-end justify-between">
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
