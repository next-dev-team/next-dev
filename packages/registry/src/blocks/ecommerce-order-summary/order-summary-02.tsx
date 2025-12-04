import * as React from 'react';
import { View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Separator } from '@/registry/new-york/components/ui/separator';

export function OrderSummary02() {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {[1, 2, 3].map((order) => (
          <View key={order}>
            <View className="flex-row items-center justify-between py-2">
              <View className="flex-1">
                <Text className="font-semibold">Order #{1000 + order}</Text>
                <Text className="text-muted-foreground text-sm">3 items • $120.00</Text>
                <Text className="text-muted-foreground text-sm">Delivered on Jan 20, 2024</Text>
              </View>
              <Button variant="ghost" size="icon">
                <Icon as={ChevronRight} size={20} />
              </Button>
            </View>
            {order < 3 && <Separator className="my-2" />}
          </View>
        ))}
      </CardContent>
    </Card>
  );
}
