import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Label } from '@/registry/new-york/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';

export function Checkout01() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <View className="flex-row gap-4">
          <View className="flex-1 space-y-2">
            <Label>First Name</Label>
            <Input placeholder="John" />
          </View>
          <View className="flex-1 space-y-2">
            <Label>Last Name</Label>
            <Input placeholder="Doe" />
          </View>
        </View>
        
        <View className="space-y-2">
          <Label>Address</Label>
          <Input placeholder="123 Main St" />
        </View>
        
        <View className="flex-row gap-4">
          <View className="flex-1 space-y-2">
            <Label>City</Label>
            <Input placeholder="New York" />
          </View>
          <View className="flex-1 space-y-2">
            <Label>State</Label>
            <Input placeholder="NY" />
          </View>
          <View className="flex-1 space-y-2">
            <Label>Zip Code</Label>
            <Input placeholder="10001" />
          </View>
        </View>
        
        <Button className="w-full mt-4">Continue to Payment</Button>
      </CardContent>
    </Card>
  );
}
