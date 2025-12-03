import * as React from 'react';
import { View } from 'react-native';
import { Heart, Trash2, Minus, Plus } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Card } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Cart05() {
  return (
    <Card className="w-full max-w-2xl p-4 flex-row gap-4 items-start">
      <View className="w-24 h-24 bg-muted rounded-md" />
      
      <View className="flex-1">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="font-bold text-lg">Designer Handbag</Text>
            <Text className="text-sm text-muted-foreground mt-1">Leather, Brown</Text>
            <Text className="text-sm text-green-600 mt-1">In Stock</Text>
          </View>
          <Text className="font-bold text-xl">$250.00</Text>
        </View>
        
        <View className="flex-row justify-between items-center mt-4">
          <View className="flex-row items-center border rounded-md">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none">
              <Icon as={Minus} size={14} />
            </Button>
            <View className="w-10 items-center justify-center border-l border-r h-8">
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
            <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/50 hover:bg-destructive/10">
              <Icon as={Trash2} size={14} className="text-destructive" />
              <Text className="text-destructive">Remove</Text>
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );
}
