import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Separator } from '@/registry/new-york/components/ui/separator';

export function OrderSummary04() {
  return (
    <Card className="mx-auto w-full max-w-3xl p-8">
      <View className="mb-8 flex-row items-start justify-between">
        <View>
          <Text className="text-2xl font-bold">INVOICE</Text>
          <Text className="text-muted-foreground">#INV-2024-001</Text>
        </View>
        <View className="items-end">
          <Text className="font-bold">Acme Corp Inc.</Text>
          <Text className="text-muted-foreground text-right">123 Business Rd</Text>
          <Text className="text-muted-foreground text-right">City, Country</Text>
        </View>
      </View>

      <View className="mb-8 flex-row justify-between">
        <View>
          <Text className="text-muted-foreground mb-1 text-sm font-bold uppercase">Bill To</Text>
          <Text className="font-medium">John Doe</Text>
          <Text className="text-muted-foreground">john@example.com</Text>
        </View>
        <View className="items-end">
          <Text className="text-muted-foreground mb-1 text-sm font-bold uppercase">Date</Text>
          <Text className="font-medium">Jan 24, 2024</Text>
        </View>
      </View>

      <View className="mb-8">
        <View className="mb-4 flex-row border-b pb-2">
          <Text className="flex-1 font-bold">Description</Text>
          <Text className="w-20 text-right font-bold">Qty</Text>
          <Text className="w-32 text-right font-bold">Amount</Text>
        </View>
        <View className="flex-row py-2">
          <Text className="flex-1">Web Design Services</Text>
          <Text className="w-20 text-right">1</Text>
          <Text className="w-32 text-right">$1,500.00</Text>
        </View>
        <View className="flex-row py-2">
          <Text className="flex-1">Hosting (Annual)</Text>
          <Text className="w-20 text-right">1</Text>
          <Text className="w-32 text-right">$200.00</Text>
        </View>
      </View>

      <Separator className="mb-4" />

      <View className="items-end space-y-2">
        <View className="w-48 flex-row justify-between">
          <Text className="text-muted-foreground">Subtotal</Text>
          <Text>$1,700.00</Text>
        </View>
        <View className="w-48 flex-row justify-between">
          <Text className="text-muted-foreground">Tax (10%)</Text>
          <Text>$170.00</Text>
        </View>
        <View className="w-48 flex-row justify-between">
          <Text className="text-lg font-bold">Total</Text>
          <Text className="text-lg font-bold">$1,870.00</Text>
        </View>
      </View>

      <View className="mt-8 items-center border-t pt-8">
        <Text className="text-muted-foreground text-sm">Thank you for your business!</Text>
        <Button variant="outline" className="mt-4">
          <Text>Download PDF</Text>
        </Button>
      </View>
    </Card>
  );
}
