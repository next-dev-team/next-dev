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
import { Badge } from '@/registry/new-york/components/ui/badge';
import { Check } from 'lucide-react-native';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Pricing02() {
  return (
    <Card className="w-full max-w-sm border-primary relative">
      <View className="absolute -top-3 left-0 right-0 items-center">
        <Badge className="bg-primary px-3">
          <Text className="text-primary-foreground text-xs font-semibold">Most Popular</Text>
        </Badge>
      </View>
      <CardHeader>
        <CardTitle>Pro Plan</CardTitle>
        <CardDescription>Perfect for growing businesses.</CardDescription>
      </CardHeader>
      <CardContent>
        <View className="flex-row items-baseline gap-1">
          <Text className="text-3xl font-bold">$29</Text>
          <Text className="text-muted-foreground">/month</Text>
        </View>
        <View className="mt-4 gap-2">
          {['Everything in Basic', 'Advanced analytics', 'Up to 50 users', '100GB data storage', 'Priority support', 'Custom integrations'].map((feature) => (
            <View key={feature} className="flex-row items-center gap-2">
              <Icon as={Check} size={16} className="text-primary" />
              <Text className="text-sm">{feature}</Text>
            </View>
          ))}
        </View>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="lg">
          <Text>Upgrade to Pro</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
