import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Separator } from '@/registry/new-york/components/ui/separator';

export function OrderSummary04() {
  return (
    <Card className="w-full max-w-3xl mx-auto p-8">
      <View className="flex-row justify-between items-start mb-8">
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
      
      <View className="flex-row justify-between mb-8">
         <View>
            <Text className="text-sm font-bold uppercase text-muted-foreground mb-1">Bill To</Text>
            <Text className="font-medium">John Doe</Text>
            <Text className="text-muted-foreground">john@example.com</Text>
         </View>
         <View className="items-end">
            <Text className="text-sm font-bold uppercase text-muted-foreground mb-1">Date</Text>
            <Text className="font-medium">Jan 24, 2024</Text>
         </View>
      </View>
      
      <View className="mb-8">
        <View className="flex-row border-b pb-2 mb-4">
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
         <View className="flex-row justify-between w-48">
            <Text className="text-muted-foreground">Subtotal</Text>
            <Text>$1,700.00</Text>
         </View>
         <View className="flex-row justify-between w-48">
            <Text className="text-muted-foreground">Tax (10%)</Text>
            <Text>$170.00</Text>
         </View>
         <View className="flex-row justify-between w-48">
            <Text className="font-bold text-lg">Total</Text>
            <Text className="font-bold text-lg">$1,870.00</Text>
         </View>
      </View>
      
      <View className="mt-8 pt-8 border-t items-center">
        <Text className="text-muted-foreground text-sm">Thank you for your business!</Text>
        <Button variant="outline" className="mt-4">
          <Text>Download PDF</Text>
        </Button>
      </View>
    </Card>
  );
}
