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
import { Check, X } from 'lucide-react-native';
import { Icon } from '@/registry/new-york/components/ui/icon';

export function Pricing05() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Team Plan</CardTitle>
        <CardDescription>Collaborate with your team.</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <View className="flex-row items-baseline gap-1">
          <Text className="text-3xl font-bold">$49</Text>
          <Text className="text-muted-foreground">/month</Text>
        </View>

        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm">Users</Text>
            <Text className="text-sm font-medium">Unlimited</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm">Projects</Text>
            <Text className="text-sm font-medium">Unlimited</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm">Storage</Text>
            <Text className="text-sm font-medium">500GB</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm">Analytics</Text>
            <Icon as={Check} size={16} className="text-primary" />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm">Custom Domain</Text>
            <Icon as={Check} size={16} className="text-primary" />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-sm">White labeling</Text>
            <Icon as={X} size={16} className="text-muted-foreground" />
          </View>
        </View>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Text>Get Team Plan</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}
