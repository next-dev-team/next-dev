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
import { Separator } from '@/registry/new-york/components/ui/separator';
import { Check } from 'lucide-react-native';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Pricing04() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Starter</CardTitle>
        <CardDescription>Great for personal projects</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6 gap-4">
        <View>
          <Text className="text-3xl font-bold">$0</Text>
          <Text className="text-muted-foreground text-sm">Free forever</Text>
        </View>
        <View className="gap-2">
          <Text className="font-medium">Includes:</Text>
          {['1 Project', 'Community Support', '1GB Storage'].map((feature) => (
             <View key={feature} className="flex-row items-center gap-2">
             <Icon as={Check} size={16} className="text-muted-foreground" />
             <Text className="text-sm text-muted-foreground">{feature}</Text>
           </View>
          ))}
        </View>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" className="w-full">
          <Text>Start for Free</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
