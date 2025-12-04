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
    <Card className="relative w-full max-w-sm overflow-hidden">
      <View className="absolute right-2 top-2 z-10">
        <Badge variant="destructive">
          <Text>Sale</Text>
        </Badge>
      </View>
      <View className="bg-muted h-56 w-full items-center justify-center">
        <Text className="text-muted-foreground text-lg">Product Image</Text>
      </View>
      <CardHeader>
        <View className="flex-row items-start justify-between">
          <CardTitle className="text-lg">Premium Jacket</CardTitle>
          <View className="flex-row items-center gap-1">
            <Icon as={Star} size={14} className="fill-yellow-500 text-yellow-500" />
            <Text className="text-muted-foreground text-sm">4.8</Text>
          </View>
        </View>
        <Text className="text-muted-foreground text-sm">Winter collection 2024</Text>
      </CardHeader>
      <CardContent>
        <View className="flex-row items-baseline gap-2">
          <Text className="text-xl font-bold">$89.00</Text>
          <Text className="text-muted-foreground text-sm line-through">$120.00</Text>
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
