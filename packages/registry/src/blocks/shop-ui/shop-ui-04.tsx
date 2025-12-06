import * as React from 'react';
import { View } from 'react-native';
import { Star, X } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent } from '@/registry/new-york/components/ui/card';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Separator } from '@/registry/new-york/components/ui/separator';

export function ShopUi04() {
  return (
    <Card className="w-full max-w-2xl flex-row overflow-hidden">
      <View className="w-1/2 bg-muted h-full min-h-[400px] items-center justify-center">
        <Text className="text-muted-foreground">Product Image</Text>
      </View>
      <View className="w-1/2 p-6">
        <View className="flex-row justify-between items-start mb-4">
            <View>
                <Text className="text-2xl font-bold">Classic Leather Watch</Text>
                <Text className="text-muted-foreground">Accessories</Text>
            </View>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <Icon as={X} size={16} />
            </Button>
        </View>
        
        <View className="flex-row items-center gap-1 mb-4">
            <Icon as={Star} size={16} className="text-yellow-500 fill-yellow-500" />
            <Icon as={Star} size={16} className="text-yellow-500 fill-yellow-500" />
            <Icon as={Star} size={16} className="text-yellow-500 fill-yellow-500" />
            <Icon as={Star} size={16} className="text-yellow-500 fill-yellow-500" />
            <Icon as={Star} size={16} className="text-muted-foreground" />
            <Text className="text-sm text-muted-foreground ml-2">(128 reviews)</Text>
        </View>

        <Text className="text-3xl font-bold mb-6">$129.00</Text>
        
        <Text className="text-muted-foreground mb-6">
            Elegant and timeless, this leather watch features a minimalist design perfect for any occasion.
        </Text>

        <View className="flex-1" />

        <Button size="lg" className="w-full mb-2">
            <Text>Add to Cart</Text>
        </Button>
        <Button variant="outline" className="w-full">
            <Text>View Details</Text>
        </Button>
      </View>
    </Card>
  );
}