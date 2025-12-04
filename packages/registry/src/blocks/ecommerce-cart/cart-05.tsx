import * as React from 'react';
import { View } from 'react-native';
import { Heart, Trash2, Minus, Plus } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Card } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Cart05() {
  return (
    <Card className="w-full max-w-2xl flex-row items-start gap-4 p-4">
      <View className="bg-muted h-24 w-24 rounded-md" />

      <View className="flex-1">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-lg font-bold">Designer Handbag</Text>
            <Text className="text-muted-foreground mt-1 text-sm">Leather, Brown</Text>
            <Text className="mt-1 text-sm text-green-600">In Stock</Text>
          </View>
          <Text className="text-xl font-bold">$250.00</Text>
        </View>

        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-row items-center rounded-md border">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
              <Icon as={Minus} size={14} />
            </Button>
            <View className="h-8 w-10 items-center justify-center border-l border-r">
              <Text className="text-sm">1</Text>
            </View>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
              <Icon as={Plus} size={14} />
            </Button>
          </View>

          <View className="flex-row gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Icon as={Heart} size={14} />
              <Text>Save</Text>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-destructive border-destructive/50 hover:bg-destructive/10 gap-2"
            >
              <Icon as={Trash2} size={14} className="text-destructive" />
              <Text className="text-destructive">Remove</Text>
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );
}
