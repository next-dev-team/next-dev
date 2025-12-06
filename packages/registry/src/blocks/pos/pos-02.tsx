import * as React from 'react';
import { View, Image } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Text } from '@/registry/new-york/components/ui/text';
import { Card, CardContent, CardFooter } from '@/registry/new-york/components/ui/card';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Badge } from '@/registry/new-york/components/ui/badge';

export function Pos02() {
  return (
    <Card className="w-[200px] overflow-hidden">
      <View className="h-32 bg-muted items-center justify-center relative">
         <Text className="text-muted-foreground">Product Img</Text>
         <Badge className="absolute top-2 right-2 bg-green-600">
            <Text className="text-white text-xs">In Stock</Text>
         </Badge>
      </View>
      <CardContent className="p-3">
        <Text className="font-semibold truncate">Signature Coffee Blend</Text>
        <Text className="text-sm text-muted-foreground">Beverages</Text>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex-row justify-between items-center">
        <Text className="font-bold text-lg">$4.50</Text>
        <Button size="icon" className="h-8 w-8 rounded-full">
            <Icon as={Plus} size={16} className="text-primary-foreground" />
        </Button>
      </CardFooter>
    </Card>
  );
}