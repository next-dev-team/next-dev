import * as React from 'react';
import { View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Card } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function ProductCard04() {
  return (
    <View className="w-full max-w-xs group">
      <Card className="aspect-[4/5] w-full bg-muted overflow-hidden relative border-0 shadow-none rounded-lg mb-3">
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-muted-foreground">Product Image</Text>
        </View>
        <View className="absolute bottom-3 right-3">
          <Button size="icon" className="h-8 w-8 rounded-full shadow-md">
            <Icon as={Plus} size={16} className="text-primary-foreground" />
          </Button>
        </View>
      </Card>
      <View>
        <Text className="font-medium text-base">Minimalist Chair</Text>
        <Text className="text-sm text-muted-foreground mt-1">Furniture</Text>
        <Text className="font-semibold mt-1">$249.00</Text>
      </View>
    </View>
  );
}
