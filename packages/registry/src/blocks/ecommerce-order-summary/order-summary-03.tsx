import * as React from 'react';
import { View } from 'react-native';
import { Check, Package, Truck } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function OrderSummary03() {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Order Status</CardTitle>
        <Text className="text-muted-foreground">Arriving by Friday, Feb 2</Text>
      </CardHeader>
      <CardContent>
        <View className="relative space-y-8 pl-8 border-l border-muted ml-4">
          
          <View className="relative">
             <View className="absolute -left-[41px] top-0 bg-primary rounded-full w-8 h-8 items-center justify-center">
               <Icon as={Check} size={16} className="text-primary-foreground" />
             </View>
             <View>
               <Text className="font-bold">Order Placed</Text>
               <Text className="text-sm text-muted-foreground">Jan 23, 2024 - 10:30 AM</Text>
             </View>
          </View>
          
          <View className="relative">
             <View className="absolute -left-[41px] top-0 bg-primary rounded-full w-8 h-8 items-center justify-center">
               <Icon as={Package} size={16} className="text-primary-foreground" />
             </View>
             <View>
               <Text className="font-bold">Processing</Text>
               <Text className="text-sm text-muted-foreground">Jan 23, 2024 - 02:15 PM</Text>
             </View>
          </View>
          
          <View className="relative">
             <View className="absolute -left-[41px] top-0 bg-muted rounded-full w-8 h-8 items-center justify-center">
               <Icon as={Truck} size={16} className="text-muted-foreground" />
             </View>
             <View>
               <Text className="font-bold text-muted-foreground">Shipped</Text>
               <Text className="text-sm text-muted-foreground">Pending</Text>
             </View>
          </View>
          
        </View>
      </CardContent>
    </Card>
  );
}
