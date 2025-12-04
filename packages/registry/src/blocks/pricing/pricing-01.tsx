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

export function Pricing01() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Basic Plan</CardTitle>
        <CardDescription>Essential features for individuals.</CardDescription>
      </CardHeader>
      <CardContent>
        <View className="flex-row items-baseline gap-1">
          <Text className="text-3xl font-bold">$10</Text>
          <Text className="text-muted-foreground">/month</Text>
        </View>
        <View className="mt-4 gap-2">
          {[
            'Access to all basic features',
            'Basic reporting and analytics',
            'Up to 10 individual users',
            '20GB individual data',
            'Basic chat and email support',
          ].map((feature) => (
            <View key={feature} className="flex-row items-center gap-2">
              <Icon as={Check} size={16} className="text-primary" />
              <Text className="text-sm">{feature}</Text>
            </View>
          ))}
        </View>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Text>Get Started</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
