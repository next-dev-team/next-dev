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
        <View className="border-muted relative ml-4 space-y-8 border-l pl-8">
          <View className="relative">
            <View className="bg-primary absolute -left-[41px] top-0 h-8 w-8 items-center justify-center rounded-full">
              <Icon as={Check} size={16} className="text-primary-foreground" />
            </View>
            <View>
              <Text className="font-bold">Order Placed</Text>
              <Text className="text-muted-foreground text-sm">Jan 23, 2024 - 10:30 AM</Text>
            </View>
          </View>

          <View className="relative">
            <View className="bg-primary absolute -left-[41px] top-0 h-8 w-8 items-center justify-center rounded-full">
              <Icon as={Package} size={16} className="text-primary-foreground" />
            </View>
            <View>
              <Text className="font-bold">Processing</Text>
              <Text className="text-muted-foreground text-sm">Jan 23, 2024 - 02:15 PM</Text>
            </View>
          </View>

          <View className="relative">
            <View className="bg-muted absolute -left-[41px] top-0 h-8 w-8 items-center justify-center rounded-full">
              <Icon as={Truck} size={16} className="text-muted-foreground" />
            </View>
            <View>
              <Text className="text-muted-foreground font-bold">Shipped</Text>
              <Text className="text-muted-foreground text-sm">Pending</Text>
            </View>
          </View>
        </View>
      </CardContent>
    </Card>
  );
}
