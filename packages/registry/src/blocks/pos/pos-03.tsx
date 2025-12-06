import * as React from 'react';
import { View } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Pos03() {
  const [qty, setQty] = React.useState(1);

  return (
    <View className="flex-row items-center p-3 border rounded-lg bg-card mb-2">
      <View className="h-12 w-12 bg-muted rounded-md items-center justify-center mr-3">
        <Text className="text-xs text-muted-foreground">Img</Text>
      </View>
      
      <View className="flex-1">
        <Text className="font-medium">Croissant</Text>
        <Text className="text-sm text-muted-foreground">$3.50</Text>
      </View>

      <View className="flex-row items-center gap-2 mr-4">
        <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onPress={() => setQty(Math.max(1, qty - 1))}
        >
            <Icon as={Minus} size={14} />
        </Button>
        <Text className="w-6 text-center font-medium">{qty}</Text>
        <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onPress={() => setQty(qty + 1)}
        >
            <Icon as={Plus} size={14} />
        </Button>
      </View>

      <Text className="font-bold w-16 text-right mr-2">${(3.50 * qty).toFixed(2)}</Text>
      
      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
        <Icon as={Trash2} size={16} className="text-destructive" />
      </Button>
    </View>
  );
}