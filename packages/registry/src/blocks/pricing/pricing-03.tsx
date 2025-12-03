import * as React from 'react';
import { View } from 'react-native';
import { Button } from '@/registry/new-york/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/registry/new-york/components/ui/card';
import { Text } from '@/registry/new-york/components/ui/text';
import { Check } from 'lucide-react-native';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Pricing03() {
  return (
    <Card className="w-full max-w-sm bg-card">
      <CardHeader>
        <CardTitle>Enterprise</CardTitle>
        <CardDescription>For large-scale organizations.</CardDescription>
      </CardHeader>
      <CardContent>
        <View className="flex-row items-baseline gap-1">
          <Text className="text-3xl font-bold">$99</Text>
          <Text className="text-muted-foreground">/month</Text>
        </View>
        <View className="mt-4 gap-2">
          {['Unlimited users', 'Unlimited storage', '24/7 Dedicated support', 'SSO & Advanced Security', 'Custom SLA', 'Dedicated account manager'].map((feature) => (
            <View key={feature} className="flex-row items-center gap-2">
               <Icon as={Check} size={16} className="text-primary" />
              <Text className="text-sm">{feature}</Text>
            </View>
          ))}
        </View>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <Text>Contact Sales</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
