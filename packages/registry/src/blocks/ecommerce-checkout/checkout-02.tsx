import * as React from 'react';
import { View } from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import { Input } from '@/registry/new-york/components/ui/input';
import { Label } from '@/registry/new-york/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/registry/new-york/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/new-york/components/ui/card';
import { Icon } from '@/registry/new-york/components/ui/icon';
import { Text } from '@/registry/new-york/components/ui/text';

export function Checkout02() {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup defaultValue="card" className="gap-4">
          <View className="flex-row items-center space-x-2 rounded-md border p-4">
            <RadioGroupItem value="card" id="card" />
            <Label className="flex-1 cursor-pointer">Credit Card</Label>
            <Icon as={CreditCard} size={24} />
          </View>
          <View className="flex-row items-center space-x-2 rounded-md border p-4">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label className="flex-1 cursor-pointer">PayPal</Label>
          </View>
        </RadioGroup>

        <View className="space-y-4 pt-4">
          <View className="space-y-2">
            <Label>Card Number</Label>
            <Input placeholder="0000 0000 0000 0000" />
          </View>
          <View className="flex-row gap-4">
            <View className="flex-1 space-y-2">
              <Label>Expiry Date</Label>
              <Input placeholder="MM/YY" />
            </View>
            <View className="flex-1 space-y-2">
              <Label>CVC</Label>
              <Input placeholder="123" />
            </View>
          </View>
          <View className="space-y-2">
            <Label>Cardholder Name</Label>
            <Input placeholder="Name on card" />
          </View>
        </View>

        <Button className="w-full">Pay Now</Button>
      </CardContent>
    </Card>
  );
}
