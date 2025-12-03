import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Label } from '@/registry/new-york/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Separator } from '@/registry/new-york/components/ui/separator';

export function Checkout04() {
  return (
    <View className="w-full max-w-6xl mx-auto p-4 flex-col lg:flex-row gap-8">
      <View className="flex-1 space-y-8">
        <View>
           <Text className="text-xl font-bold mb-4">1. Contact Information</Text>
           <Input placeholder="Email Address" />
        </View>
        
        <View>
           <Text className="text-xl font-bold mb-4">2. Shipping Details</Text>
           <View className="grid gap-4">
              <View className="flex-row gap-4">
                 <Input className="flex-1" placeholder="First Name" />
                 <Input className="flex-1" placeholder="Last Name" />
              </View>
              <Input placeholder="Address" />
              <Input placeholder="City" />
           </View>
        </View>
        
        <View>
           <Text className="text-xl font-bold mb-4">3. Payment</Text>
           <Input placeholder="Card Number" />
        </View>
      </View>
      
      <View className="w-full lg:w-96">
        <Card className="bg-muted/20">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <View className="flex-row gap-4">
              <View className="w-16 h-16 bg-muted rounded" />
              <View>
                 <Text className="font-medium">Product Name</Text>
                 <Text className="text-sm text-muted-foreground">$99.00</Text>
              </View>
            </View>
            <Separator />
            <View className="flex-row justify-between font-bold">
              <Text>Total</Text>
              <Text>$99.00</Text>
            </View>
            <Button className="w-full">Pay $99.00</Button>
          </CardContent>
        </Card>
      </View>
    </View>
  );
}
