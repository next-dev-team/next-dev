import * as React from 'react';
import { View } from 'react-native';
import { Star } from 'lucide-react-native';
import { Badge } from '@/registry/new-york/components/ui/badge';
import { Button } from '@/registry/new-york/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function ProductCard02() {
  return (
    <Card className="w-full max-w-sm overflow-hidden relative">
      <View className="absolute top-2 right-2 z-10">
        <Badge variant="destructive">
          <Text>Sale</Text>
        </Badge>
      </View>
      <View className="h-56 w-full bg-muted items-center justify-center">
        <Text className="text-muted-foreground text-lg">Product Image</Text>
      </View>
      <CardHeader>
        <View className="flex-row justify-between items-start">
          <CardTitle className="text-lg">Premium Jacket</CardTitle>
          <View className="flex-row items-center gap-1">
            <Icon as={Star} size={14} className="text-yellow-500 fill-yellow-500" />
            <Text className="text-sm text-muted-foreground">4.8</Text>
          </View>
        </View>
        <Text className="text-sm text-muted-foreground">Winter collection 2024</Text>
      </CardHeader>
      <CardContent>
        <View className="flex-row items-baseline gap-2">
          <Text className="text-xl font-bold">$89.00</Text>
          <Text className="text-sm text-muted-foreground line-through">$120.00</Text>
        </View>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="secondary">
          <Text>View Details</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
