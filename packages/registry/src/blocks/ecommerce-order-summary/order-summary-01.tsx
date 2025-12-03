import * as React from 'react';
import { View } from 'react-native';
import { Package } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function OrderSummary01() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex-row items-center justify-between">
        <View>
          <CardTitle>Order #1234</CardTitle>
          <Text className="text-sm text-muted-foreground">Placed on Jan 23, 2024</Text>
        </View>
        <View className="bg-primary/10 px-2 py-1 rounded">
           <Text className="text-primary text-xs font-bold uppercase">Processing</Text>
        </View>
      </CardHeader>
      <CardContent>
        <View className="flex-row items-center gap-4">
          <View className="w-12 h-12 bg-muted rounded items-center justify-center">
             <Icon as={Package} size={24} className="text-muted-foreground" />
          </View>
          <View>
             <Text className="font-medium">Estimated Delivery</Text>
             <Text className="text-muted-foreground">Jan 28 - Jan 30</Text>
          </View>
        </View>
      </CardContent>
      <CardFooter className="flex-row gap-2">
        <Button variant="outline" className="flex-1">
          <Text>View Details</Text>
        </Button>
        <Button className="flex-1">
          <Text>Track Order</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
